import type { NextApiRequest, NextApiResponse } from "next";

type GithubUser = {
  avatar_url: string;
  followers: number;
  following: number;
  public_repos: number;
  public_gists: number;
  html_url: string;
  login: string;
  name?: string;
};

type GithubRepo = {
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  pushed_at: string;
  size: number;
  fork: boolean;
};

type FeaturedProject = {
  name: string;
  html_url: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  pushed_at: string;
  updated_at: string;
};

type GithubSummary = {
  username: string;
  name: string;
  avatar: string;
  profile_url: string;
  followers: number;
  following: number;
  stars: number;
  public_repos: number;
  public_gists: number;
  featured_kind: "biggest" | "latest";
  featured_project: FeaturedProject | null;
  latest_project: FeaturedProject | null;
  biggest_project: FeaturedProject | null;
  source?: "live" | "cache" | "fallback";
};

const USERNAME = "charleskasasira";
const CACHE_TTL_MS = 10 * 60 * 1000;

const FALLBACK_SUMMARY: GithubSummary = {
  username: "charleskasasira",
  name: "Charles Kasasira",
  avatar: "https://avatars.githubusercontent.com/u/14454257?v=4",
  profile_url: "https://github.com/charleskasasira",
  followers: 89,
  following: 25,
  stars: 33,
  public_repos: 119,
  public_gists: 29,
  featured_kind: "biggest",
  featured_project: {
    name: "Toll-Pay",
    html_url: "https://github.com/CharlesKasasira/Toll-Pay",
    description: "A toll payment mobile Application. For Android and IOS",
    stars: 15,
    forks: 9,
    language: "Dart",
    pushed_at: "2022-10-28T08:48:16Z",
    updated_at: "2022-10-28T08:48:16Z",
  },
  latest_project: {
    name: "Toll-Pay",
    html_url: "https://github.com/CharlesKasasira/Toll-Pay",
    description: "A toll payment mobile Application. For Android and IOS",
    stars: 15,
    forks: 9,
    language: "Dart",
    pushed_at: "2022-10-28T08:48:16Z",
    updated_at: "2022-10-28T08:48:16Z",
  },
  biggest_project: {
    name: "Toll-Pay",
    html_url: "https://github.com/CharlesKasasira/Toll-Pay",
    description: "A toll payment mobile Application. For Android and IOS",
    stars: 15,
    forks: 9,
    language: "Dart",
    pushed_at: "2022-10-28T08:48:16Z",
    updated_at: "2022-10-28T08:48:16Z",
  },
  source: "fallback",
};

let cachedSummary: GithubSummary | null = null;
let cacheExpiresAt = 0;

function toFeaturedProject(repo?: GithubRepo): FeaturedProject | null {
  if (!repo) return null;

  return {
    name: repo.name,
    html_url: repo.html_url,
    description: repo.description,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    language: repo.language,
    pushed_at: repo.pushed_at,
    updated_at: repo.updated_at,
  };
}

async function githubFetchJson<T>(url: string): Promise<T> {
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "charleskasasira.com",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`GitHub request failed (${response.status}) for ${url}`);
  }

  return (await response.json()) as T;
}

async function fetchLiveSummary(): Promise<GithubSummary> {
  const [user, repositories] = await Promise.all([
    githubFetchJson<GithubUser>(`https://api.github.com/users/${USERNAME}`),
    githubFetchJson<GithubRepo[]>(
      `https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`
    ),
  ]);

  const mine = repositories.filter((repo) => !repo.fork);
  const stars = mine.reduce(
    (accumulator, repository) => accumulator + repository.stargazers_count,
    0
  );

  const biggestProject = [...mine].sort((a, b) => {
    if (b.stargazers_count !== a.stargazers_count) {
      return b.stargazers_count - a.stargazers_count;
    }
    if (b.size !== a.size) {
      return b.size - a.size;
    }
    return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime();
  })[0];

  const latestProject = [...mine].sort(
    (a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()
  )[0];

  const featuredProject =
    biggestProject && biggestProject.stargazers_count > 0
      ? biggestProject
      : latestProject;

  const featuredKind =
    biggestProject && biggestProject.stargazers_count > 0 ? "biggest" : "latest";

  return {
    username: user.login,
    name: user.name ?? user.login,
    avatar: user.avatar_url,
    profile_url: user.html_url,
    followers: user.followers,
    following: user.following,
    stars,
    public_repos: user.public_repos,
    public_gists: user.public_gists,
    featured_kind: featuredKind,
    featured_project: toFeaturedProject(featuredProject),
    latest_project: toFeaturedProject(latestProject),
    biggest_project: toFeaturedProject(biggestProject),
    source: "live",
  };
}

function sendJson(res: NextApiResponse, body: GithubSummary, maxAgeSeconds: number) {
  res.setHeader(
    "cache-control",
    `public, s-maxage=${maxAgeSeconds}, stale-while-revalidate=${maxAgeSeconds / 2}`
  );
  res.setHeader("x-github-source", body.source || "live");
  res.status(200).json(body);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const now = Date.now();

  if (cachedSummary && now < cacheExpiresAt) {
    sendJson(res, { ...cachedSummary, source: "cache" }, 300);
    return;
  }

  try {
    const summary = await fetchLiveSummary();
    cachedSummary = summary;
    cacheExpiresAt = now + CACHE_TTL_MS;
    sendJson(res, summary, 1200);
    return;
  } catch (error) {
    if (cachedSummary) {
      sendJson(res, { ...cachedSummary, source: "cache" }, 300);
      return;
    }

    sendJson(res, FALLBACK_SUMMARY, 300);
  }
}
