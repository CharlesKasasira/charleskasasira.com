import type { NextApiRequest, NextApiResponse } from "next";

const DEFAULT_USERNAME = "charleskasasira";
const VALID_USERNAME = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

const cache = new Map<string, { svg: string; expiresAt: number }>();
const CACHE_TTL_MS = 10 * 60 * 1000;

function resolveUsername(value: string | string[] | undefined): string {
  const singleValue = Array.isArray(value) ? value[0] : value;
  if (!singleValue) return DEFAULT_USERNAME;
  return VALID_USERNAME.test(singleValue) ? singleValue : DEFAULT_USERNAME;
}

function extractSvgFromContributionPage(input: string): string | null {
  const explicitMatch = input.match(
    /<svg[^>]*class="[^"]*js-calendar-graph-svg[^"]*"[\s\S]*?<\/svg>/i
  );
  return explicitMatch ? explicitMatch[0] : null;
}

type ContributionDay = { date: string; count: number; color: string; intensity: string };

function buildSvgFromContributions(contributions: ContributionDay[]): string {
  const byDate: Record<string, string> = {};
  for (const c of contributions) {
    byDate[c.date] = c.color;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setDate(start.getDate() - 364);
  start.setDate(start.getDate() - start.getDay());

  const cellSize = 11;
  const gap = 3;
  const totalCell = cellSize + gap;
  const rects: string[] = [];
  for (let col = 0; col < 53; col++) {
    for (let row = 0; row < 7; row++) {
      const d = new Date(start);
      d.setDate(d.getDate() + col * 7 + row);
      const dateStr = d.toISOString().slice(0, 10);
      const color = byDate[dateStr] || "#ebedf0";
      const x = col * totalCell;
      const y = row * totalCell;
      rects.push(`<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="${color}" rx="1" ry="1"/>`);
    }
  }

  const width = 53 * totalCell - gap;
  const height = 7 * totalCell - gap;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="GitHub contribution graph">
${rects.join("\n")}
</svg>`;
}

async function fetchContributionsFromApi(username: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://github-contributions.vercel.app/api/v1/${encodeURIComponent(username)}`,
      { headers: { Accept: "application/json" } }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { contributions?: ContributionDay[] };
    if (!data?.contributions?.length) return null;
    return buildSvgFromContributions(data.contributions);
  } catch {
    return null;
  }
}

function fallbackSvg(username: string): string {
  const safeUsername = username.replace(/[<>&"']/g, "");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="780" height="120" viewBox="0 0 780 120" role="img" aria-label="GitHub contribution graph unavailable">
  <rect width="780" height="120" fill="#f4f4f5"/>
  <rect x="1" y="1" width="778" height="118" fill="none" stroke="#d4d4d8"/>
  <text x="20" y="50" font-family="system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-size="15" fill="#27272a">
    GitHub contribution graph is temporarily unavailable.
  </text>
  <text x="20" y="78" font-family="system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-size="13" fill="#52525b">
    Open github.com/${safeUsername} to view the live graph.
  </text>
</svg>`;
}

async function fetchSvg(url: string): Promise<string | null> {
  const response = await fetch(url, {
    headers: {
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    },
  });

  if (!response.ok) return null;

  const payload = await response.text();
  return extractSvgFromContributionPage(payload);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const username = resolveUsername(req.query.username);
  const now = Date.now();
  const cached = cache.get(username);

  if (cached && now < cached.expiresAt) {
    res.setHeader("content-type", "image/svg+xml; charset=utf-8");
    res.setHeader("cache-control", "public, s-maxage=300, stale-while-revalidate=300");
    res.setHeader("x-github-graph-source", "cache");
    res.status(200).send(cached.svg);
    return;
  }

  try {
    const contributionUrl = `https://github.com/users/${username}/contributions`;
    const profileUrl = `https://github.com/${username}`;

    const svgFromContributions = await fetchSvg(contributionUrl);
    const svgFromProfile = svgFromContributions ? null : await fetchSvg(profileUrl);
    let resolvedSvg = svgFromContributions || svgFromProfile;

    if (!resolvedSvg) {
      resolvedSvg = await fetchContributionsFromApi(username);
    }

    if (resolvedSvg) {
      cache.set(username, { svg: resolvedSvg, expiresAt: now + CACHE_TTL_MS });
      res.setHeader("content-type", "image/svg+xml; charset=utf-8");
      res.setHeader("cache-control", "public, s-maxage=1200, stale-while-revalidate=600");
      res.setHeader("x-github-graph-source", "live");
      res.status(200).send(resolvedSvg);
      return;
    }
  } catch {
    // Fall through to backup.
  }

  const backup = cached?.svg || fallbackSvg(username);
  res.setHeader("content-type", "image/svg+xml; charset=utf-8");
  res.setHeader("cache-control", "public, s-maxage=120, stale-while-revalidate=120");
  res.setHeader("x-github-graph-source", cached ? "cache" : "fallback");
  res.status(200).send(backup);
}
