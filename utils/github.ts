export type RepoSummary = {
  name: string;
  html_url: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  pushed_at: string;
  updated_at: string;
};

export type GithubSummary = {
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
  featured_project: RepoSummary | null;
  latest_project: RepoSummary | null;
  biggest_project: RepoSummary | null;
  source: "live" | "cache" | "fallback";
};

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

const USERNAME = "CharlesKasasira";
const CACHE_TTL_MS = 10 * 60 * 1000;

const FALLBACK_SUMMARY: GithubSummary = {
  username: USERNAME,
  name: "Charles Kasasira",
  avatar: "https://avatars.githubusercontent.com/u/59878203?v=4",
  profile_url: `https://github.com/${USERNAME}`,
  followers: 89,
  following: 22,
  stars: 35,
  public_repos: 127,
  public_gists: 29,
  featured_kind: "biggest",
  featured_project: {
    name: "Toll-Pay",
    html_url: `https://github.com/${USERNAME}/Toll-Pay`,
    description: "A toll payment mobile application for Android and iOS.",
    stars: 15,
    forks: 9,
    language: "Dart",
    pushed_at: "2022-10-28T07:21:55Z",
    updated_at: "2025-02-26T07:05:40Z",
  },
  latest_project: {
    name: "LoopList",
    html_url: `https://github.com/${USERNAME}/LoopList`,
    description: null,
    stars: 0,
    forks: 0,
    language: "PHP",
    pushed_at: "2026-05-31T22:29:18Z",
    updated_at: "2026-05-31T22:29:22Z",
  },
  biggest_project: {
    name: "Toll-Pay",
    html_url: `https://github.com/${USERNAME}/Toll-Pay`,
    description: "A toll payment mobile application for Android and iOS.",
    stars: 15,
    forks: 9,
    language: "Dart",
    pushed_at: "2022-10-28T07:21:55Z",
    updated_at: "2025-02-26T07:05:40Z",
  },
  source: "fallback",
};

let cachedSummary: GithubSummary | null = null;
let cacheExpiresAt = 0;

function toRepoSummary(repo?: GithubRepo): RepoSummary | null {
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

  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`GitHub request failed (${response.status})`);
  }

  return (await response.json()) as T;
}

async function fetchRepositories(): Promise<GithubRepo[]> {
  const repositories: GithubRepo[] = [];

  for (let page = 1; ; page += 1) {
    const batch = await githubFetchJson<GithubRepo[]>(
      `https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated&page=${page}`
    );
    repositories.push(...batch);

    if (batch.length < 100) return repositories;
  }
}

async function fetchLiveSummary(): Promise<GithubSummary> {
  const [user, repositories] = await Promise.all([
    githubFetchJson<GithubUser>(`https://api.github.com/users/${USERNAME}`),
    fetchRepositories(),
  ]);

  const mine = repositories.filter((repo) => !repo.fork);
  const stars = mine.reduce(
    (total, repository) => total + repository.stargazers_count,
    0
  );
  const biggestProject = [...mine].sort((a, b) => {
    if (b.stargazers_count !== a.stargazers_count) {
      return b.stargazers_count - a.stargazers_count;
    }
    if (b.size !== a.size) return b.size - a.size;
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
    featured_project: toRepoSummary(featuredProject),
    latest_project: toRepoSummary(latestProject),
    biggest_project: toRepoSummary(biggestProject),
    source: "live",
  };
}

export async function getGithubSummary(): Promise<GithubSummary> {
  const now = Date.now();

  if (cachedSummary && now < cacheExpiresAt) {
    return { ...cachedSummary, source: "cache" };
  }

  try {
    const summary = await fetchLiveSummary();
    cachedSummary = summary;
    cacheExpiresAt = now + CACHE_TTL_MS;
    return summary;
  } catch {
    if (cachedSummary) return { ...cachedSummary, source: "cache" };
    return FALLBACK_SUMMARY;
  }
}
