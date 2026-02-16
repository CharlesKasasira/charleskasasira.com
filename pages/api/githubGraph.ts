import { type NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

const DEFAULT_USERNAME = "charleskasasira";
const VALID_USERNAME = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

function resolveUsername(value: string | null): string {
  if (!value) return DEFAULT_USERNAME;
  return VALID_USERNAME.test(value) ? value : DEFAULT_USERNAME;
}

export default async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = resolveUsername(searchParams.get("username"));
  const contributionsUrl = `https://github.com/users/${username}/contributions`;

  try {
    const response = await fetch(contributionsUrl, {
      headers: {
        accept: "image/svg+xml",
        "user-agent": "charleskasasira.com",
      },
    });

    if (!response.ok) {
      return new Response("Unable to load contributions graph.", {
        status: 502,
        headers: {
          "content-type": "text/plain; charset=utf-8",
          "cache-control": "public, s-maxage=300, stale-while-revalidate=300",
        },
      });
    }

    const svg = await response.text();

    return new Response(svg, {
      status: 200,
      headers: {
        "content-type": "image/svg+xml; charset=utf-8",
        "cache-control": "public, s-maxage=1200, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    return new Response("Unable to load contributions graph.", {
      status: 500,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "public, s-maxage=300, stale-while-revalidate=300",
      },
    });
  }
}
