import { type NextRequest } from "next/server";

export const config = {
  runtime: "edge",
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

const USERNAME = "charleskasasira";

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

export default async function handler(req: NextRequest) {
  try {
    const [userResponse, reposResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${USERNAME}`),
      fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`),
    ]);

    if (!userResponse.ok || !reposResponse.ok) {
      return new Response(
        JSON.stringify({ message: "Unable to load GitHub profile data right now." }),
        {
          status: 502,
          headers: {
            "content-type": "application/json",
            "cache-control": "public, s-maxage=300, stale-while-revalidate=300",
          },
        }
      );
    }

    const user = (await userResponse.json()) as GithubUser;
    const repositories = (await reposResponse.json()) as GithubRepo[];

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

    return new Response(
      JSON.stringify({
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
      }),
      {
        status: 200,
        headers: {
          "content-type": "application/json",
          "cache-control": "public, s-maxage=1200, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Unexpected error while loading GitHub data." }),
      {
        status: 500,
        headers: {
          "content-type": "application/json",
          "cache-control": "public, s-maxage=300, stale-while-revalidate=300",
        },
      }
    );
  }
}
