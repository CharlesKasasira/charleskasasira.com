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
  flagship_projects: RepoSummary[];
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

const FLAGSHIP_PROJECTS = [
  {
    name: "iHatePDF",
    description:
      "A self-hosted PDF platform with web, API, worker, and desktop surfaces.",
  },
  {
    name: "git-quest",
    description:
      "An interactive game for learning Git through challenges, visualizations, and a simulated terminal.",
  },
  {
    name: "charleskasasira.com",
    description:
      "This portfolio, built to connect selected projects, technical writing, and video work.",
  },
  {
    name: "manuals",
    description:
      "A manuals governance platform for drafting, review, publishing, search, and organizational knowledge.",
  },
  {
    name: "Uganda-data",
    description:
      "A growing collection of structured Ugandan public data for practical software and analysis projects.",
  },
  {
    name: "LoopList",
    description:
      "A Laravel application for turning recurring responsibilities into clear, trackable loops.",
  },
] as const;

const FLAGSHIP_FALLBACKS: Record<string, RepoSummary> = {
  iHatePDF: {
    name: "iHatePDF",
    html_url: `https://github.com/${USERNAME}/iHatePDF`,
    description: FLAGSHIP_PROJECTS[0].description,
    stars: 0,
    forks: 1,
    language: "JavaScript",
    pushed_at: "2026-05-24T21:35:36Z",
    updated_at: "2026-05-24T21:35:41Z",
  },
  "git-quest": {
    name: "git-quest",
    html_url: `https://github.com/${USERNAME}/git-quest`,
    description: FLAGSHIP_PROJECTS[1].description,
    stars: 3,
    forks: 0,
    language: "TypeScript",
    pushed_at: "2026-05-15T07:14:26Z",
    updated_at: "2026-05-15T07:14:30Z",
  },
  "charleskasasira.com": {
    name: "charleskasasira.com",
    html_url: `https://github.com/${USERNAME}/charleskasasira.com`,
    description: FLAGSHIP_PROJECTS[2].description,
    stars: 2,
    forks: 0,
    language: "TypeScript",
    pushed_at: "2026-10-13T15:34:24Z",
    updated_at: "2026-10-13T15:34:29Z",
  },
  manuals: {
    name: "manuals",
    html_url: `https://github.com/${USERNAME}/manuals`,
    description: FLAGSHIP_PROJECTS[3].description,
    stars: 0,
    forks: 0,
    language: "TypeScript",
    pushed_at: "2026-05-30T13:28:14Z",
    updated_at: "2026-05-30T13:28:17Z",
  },
  "Uganda-data": {
    name: "Uganda-data",
    html_url: `https://github.com/${USERNAME}/Uganda-data`,
    description: FLAGSHIP_PROJECTS[4].description,
    stars: 0,
    forks: 0,
    language: "Data",
    pushed_at: "2026-03-29T22:37:43Z",
    updated_at: "2026-03-29T22:37:48Z",
  },
  LoopList: {
    name: "LoopList",
    html_url: `https://github.com/${USERNAME}/LoopList`,
    description: FLAGSHIP_PROJECTS[5].description,
    stars: 0,
    forks: 0,
    language: "PHP",
    pushed_at: "2026-05-31T22:29:18Z",
    updated_at: "2026-05-31T22:29:22Z",
  },
};

const FALLBACK_SUMMARY: GithubSummary = {
  username: USERNAME,
  name: "Charles Kasasira",
  avatar: "https://avatars.githubusercontent.com/u/59878203?v=4",
  profile_url: `https://github.com/${USERNAME}`,
  followers: 90,
  following: 22,
  stars: 35,
  public_repos: 127,
  public_gists: 29,
  flagship_projects: FLAGSHIP_PROJECTS.map(
    ({ name }) => FLAGSHIP_FALLBACKS[name]
  ),
  source: "fallback",
};

let cachedSummary: GithubSummary | null = null;
let cacheExpiresAt = 0;

function toRepoSummary(
  repo: GithubRepo | undefined,
  description?: string
): RepoSummary | null {
  if (!repo) return null;

  return {
    name: repo.name,
    html_url: repo.html_url,
    description: description ?? repo.description,
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
  const repositoriesByName = new Map(mine.map((repo) => [repo.name, repo]));
  const flagshipProjects = FLAGSHIP_PROJECTS.map(({ name, description }) => {
    return (
      toRepoSummary(repositoriesByName.get(name), description) ??
      FLAGSHIP_FALLBACKS[name]
    );
  });

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
    flagship_projects: flagshipProjects,
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
