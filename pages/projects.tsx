import Container from "components/Container";
import GithubGraph from "components/GithubGraph";
import Image from "next/image";
import useSWR from "swr";
import { AiFillStar } from "react-icons/ai";
import { FiExternalLink, FiGitBranch } from "react-icons/fi";
import { RiGitRepositoryLine, RiUserFollowLine, RiUserSharedLine } from "react-icons/ri";
import { BiCodeBlock } from "react-icons/bi";

import fetcher from "utils/fetcher";

type RepoSummary = {
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
  featured_project: RepoSummary | null;
};

const DEFAULT_USERNAME = "charleskasasira";

function formatDate(value?: string) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default function Projects() {
  const { data, error, isLoading } = useSWR<GithubSummary>("/api/github", fetcher);

  const stats = [
    {
      id: "followers",
      label: "Followers",
      value: data?.followers,
      icon: <RiUserFollowLine />,
    },
    {
      id: "following",
      label: "Following",
      value: data?.following,
      icon: <RiUserSharedLine />,
    },
    {
      id: "repos",
      label: "Public repos",
      value: data?.public_repos,
      icon: <RiGitRepositoryLine />,
    },
    {
      id: "stars",
      label: "Stars",
      value: data?.stars,
      icon: <AiFillStar />,
    },
    {
      id: "gists",
      label: "Public gists",
      value: data?.public_gists,
      icon: <BiCodeBlock />,
    },
  ];

  const featuredProject = data?.featured_project;
  const featuredLabel =
    data?.featured_kind === "biggest"
      ? "Biggest project (by stars)"
      : "Latest project";
  const username = data?.username ?? DEFAULT_USERNAME;

  return (
    <Container
      title="Projects - Charles Kasasira"
      description="A summary of Charles Kasasira's GitHub activity, contributions, and featured project work."
    >
      <section className="mb-8 w-full">
        <p className="mb-3 inline-flex rounded-full border border-amber-500/30 bg-amber-50 px-4 py-1 text-xs font-medium tracking-[0.12em] text-amber-900 dark:border-amber-400/40 dark:bg-amber-500/20 dark:text-amber-100">
          GITHUB SUMMARY
        </p>
        <h1 className="mb-3 text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 md:text-5xl">
          Projects
        </h1>
        <p className="max-w-2xl text-zinc-700 dark:text-zinc-300">
          Quick snapshot of what I am building on GitHub: account stats, real
          commit graph, and a featured project.
        </p>

        <div className="mt-5 flex items-center gap-4">
          {data?.avatar ? (
            <Image
              src={data.avatar}
              alt={`${data.name} GitHub avatar`}
              width={56}
              height={56}
              className="rounded-full"
            />
          ) : (
            <div className="h-14 w-14 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
          )}

          <a
            href={data?.profile_url ?? `https://github.com/${DEFAULT_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:-translate-y-0.5 hover:border-zinc-900 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-100 dark:hover:text-zinc-100"
          >
            @{username}
            <FiExternalLink />
          </a>
        </div>
      </section>

      <section className="mb-10 w-full">
        <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Stats
        </h2>
        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">
            GitHub data is temporarily unavailable. Please try again in a moment.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {stats.map((stat) => (
              <article
                key={stat.id}
                className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/60"
              >
                <p className="mb-3 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {stat.icon}
                  {stat.label}
                </p>
                <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
                  {typeof stat.value === "number"
                    ? stat.value.toLocaleString("en-US")
                    : isLoading
                      ? "..."
                      : "-"}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="mb-10 w-full">
        <h2 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Commit graph
        </h2>
        <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
          This chart is loaded directly from GitHub, so it matches the graph on
          my profile.
        </p>
        <GithubGraph username={username} />
      </section>

      <section className="mb-16 w-full">
        <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {featuredLabel}
        </h2>

        {!featuredProject ? (
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900/60">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {isLoading
                ? "Loading featured project..."
                : "No featured project data is available right now."}
            </p>
          </div>
        ) : (
          <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
            <div className="mb-3 flex items-start justify-between gap-4">
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {featuredProject.name}
              </h3>
              <a
                href={featuredProject.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-zinc-300 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-zinc-700 transition hover:border-zinc-900 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-100 dark:hover:text-zinc-100"
              >
                View on GitHub
                <FiExternalLink />
              </a>
            </div>

            <p className="mb-5 max-w-3xl text-zinc-600 dark:text-zinc-400">
              {featuredProject.description ||
                "No description provided for this repository."}
            </p>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-xs uppercase tracking-[0.1em] text-zinc-500 dark:text-zinc-400">
                  Stars
                </p>
                <p className="mt-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {featuredProject.stars.toLocaleString("en-US")}
                </p>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-xs uppercase tracking-[0.1em] text-zinc-500 dark:text-zinc-400">
                  Forks
                </p>
                <p className="mt-2 flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  <FiGitBranch />
                  {featuredProject.forks.toLocaleString("en-US")}
                </p>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-xs uppercase tracking-[0.1em] text-zinc-500 dark:text-zinc-400">
                  Language
                </p>
                <p className="mt-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {featuredProject.language || "Not set"}
                </p>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-xs uppercase tracking-[0.1em] text-zinc-500 dark:text-zinc-400">
                  Last push
                </p>
                <p className="mt-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {formatDate(featuredProject.pushed_at)}
                </p>
              </div>
            </div>
          </article>
        )}
      </section>
    </Container>
  );
}
