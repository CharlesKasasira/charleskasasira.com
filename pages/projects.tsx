import Container from "components/Container";
import GithubGraph from "components/GithubGraph";
import Image from "next/image";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import useSWR from "swr";
import { AiFillStar } from "react-icons/ai";
import { FiExternalLink, FiGitBranch } from "react-icons/fi";
import { RiGitRepositoryLine, RiUserFollowLine } from "react-icons/ri";
import { BiCodeBlock } from "react-icons/bi";
import fetcher from "utils/fetcher";
import type { GithubSummary } from "utils/github";

const DEFAULT_USERNAME = "charleskasasira";

const liveProjects = [
  {
    name: "Git Quest",
    href: "https://git.charleskasasira.com/",
    description:
      "Learn Git by restoring a fractured timeline through interactive terminal challenges.",
  },
  {
    name: "Fala — Portuguese Flashcards",
    href: "https://portuguese.charleskasasira.com/",
    description:
      "Learn Brazilian Portuguese for real conversations with survival phrases, stories, speaking practice, and offline study.",
  },
];

function formatDate(value?: string) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

type ProjectsProps = {
  initialSummary: GithubSummary;
};

export const getStaticProps: GetStaticProps<ProjectsProps> = async () => {
  const { getGithubSummary } = await import("utils/github");
  const initialSummary = await getGithubSummary();

  return {
    props: { initialSummary },
    revalidate: 10 * 60,
  };
};

export default function Projects({
  initialSummary,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { data, isLoading } = useSWR<GithubSummary>("/api/github", fetcher, {
    fallbackData: initialSummary,
    revalidateOnFocus: false,
    dedupingInterval: 5 * 60 * 1000,
  });

  const stats = [
    {
      id: "followers",
      label: "Followers",
      value: data?.followers,
      icon: <RiUserFollowLine />,
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

  const flagshipProjects = data?.flagship_projects ?? [];
  const repositoryProjects = flagshipProjects.filter(
    (project) => project.name !== "git-quest"
  );
  const username = data?.username ?? DEFAULT_USERNAME;

  return (
    <Container
      title="Projects - Charles Kasasira"
      description="A summary of Charles Kasasira's GitHub activity, contributions, and featured project work."
    >
      <div className="studio-page">
      <section className="mb-[12vh] w-full">
        <p className="studio-page-kicker mb-5">Projects</p>
        <h1 className="studio-page-title max-w-5xl">
          Selected work and experiments.
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-8 text-[var(--site-muted)]">
          A curated view of the products, experiments, and public resources
          that best represent what I am building.
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
            <div className="site-skeleton h-14 w-14 animate-pulse rounded-full" />
          )}

          <a
            href={data?.profile_url ?? `https://github.com/${DEFAULT_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--site-rule)] px-4 py-2 text-sm font-medium text-[var(--site-muted)] transition hover:border-[var(--site-ink)] hover:text-[var(--site-ink)]"
          >
            @{username}
            <FiExternalLink />
          </a>
        </div>
      </section>

      <section className="mb-[12vh] w-full">
        <div className="studio-section-heading mb-5">
          <h2>GitHub</h2>
          <b>Public activity</b>
        </div>
        {isLoading && !data ? (
          <div
            className="grid sm:grid-cols-2 lg:grid-cols-4"
            aria-label="Loading GitHub statistics"
          >
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="site-skeleton h-24 animate-pulse border-b border-[var(--site-rule)]"
              />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <article
                key={stat.id}
                className="border-b border-[var(--site-rule)] py-5 lg:border-r lg:px-5 lg:first:pl-0 lg:last:border-r-0"
              >
                <p className="mb-3 flex items-center gap-2 text-sm text-[var(--site-muted)]">
                  {stat.icon}
                  {stat.label}
                </p>
                <p className="text-4xl font-medium tracking-[-0.025em]">
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
        {data?.source === "fallback" ? (
          <p className="mt-3 text-xs text-[var(--site-muted)]">
            Showing a recent snapshot while GitHub refreshes.
          </p>
        ) : null}
      </section>

      <section className="mb-[12vh] w-full">
        <h2 className="mb-2 text-2xl font-medium tracking-[-0.02em]">
          Commit graph
        </h2>
        <p className="mb-4 text-sm text-[var(--site-muted)]">
          A live view of recent GitHub contribution activity, with a direct
          profile link if GitHub cannot provide the graph.
        </p>
        <GithubGraph username={username} />
      </section>

      <section className="mb-4 w-full">
        <div className="studio-section-heading mb-5">
          <h2>Selected work</h2>
          <b>Products and code</b>
        </div>
        <p className="mb-5 max-w-3xl text-sm text-[var(--site-muted)]">
          These projects are selected deliberately for the problems they solve
          and the range of engineering they represent. Live links open the
          deployed products, while GitHub keeps repository metadata current.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          {liveProjects.map((project) => (
            <article
              key={project.href}
              className="flex h-full flex-col border-t border-[var(--site-rule)] py-6 transition hover:pl-3"
            >
              <div className="mb-3 flex items-start justify-between gap-4">
                <div>
                  <p className="studio-label mb-2 text-[var(--site-muted)]">
                    Live project
                  </p>
                  <h3 className="text-3xl font-medium tracking-[-0.025em]">
                    {project.name}
                  </h3>
                </div>
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${project.name}`}
                  className="rounded-full border border-[var(--site-rule)] p-2 transition hover:border-[var(--site-ink)]"
                >
                  <FiExternalLink />
                </a>
              </div>
              <p className="mb-5 flex-1 text-[var(--site-muted)]">
                {project.description}
              </p>
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center gap-2 text-sm font-semibold underline decoration-[var(--site-rule)] underline-offset-4 transition hover:decoration-current"
              >
                Visit live site
                <FiExternalLink aria-hidden="true" />
              </a>
            </article>
          ))}

          {repositoryProjects.map((project) => (
            <article
              key={project.name}
              className="flex h-full flex-col border-t border-[var(--site-rule)] py-6 transition hover:pl-3"
            >
              <div className="mb-3 flex items-start justify-between gap-4">
                <h3 className="text-3xl font-medium tracking-[-0.025em]">
                  {project.name}
                </h3>
                <a
                  href={project.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${project.name} on GitHub`}
                  className="rounded-full border border-[var(--site-rule)] p-2 text-[var(--site-muted)] transition hover:border-[var(--site-ink)] hover:text-[var(--site-ink)]"
                >
                  <FiExternalLink />
                </a>
              </div>

              <p className="mb-5 flex-1 text-[var(--site-muted)]">
                {project.description}
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[var(--site-rule)] pt-4 text-sm text-[var(--site-muted)]">
                <span>{project.language || "Mixed stack"}</span>
                <span className="inline-flex items-center gap-1">
                  <AiFillStar />
                  {project.stars.toLocaleString("en-US")}
                </span>
                <span className="inline-flex items-center gap-1">
                  <FiGitBranch />
                  {project.forks.toLocaleString("en-US")}
                </span>
                <span>Updated {formatDate(project.pushed_at)}</span>
              </div>
            </article>
          ))}
        </div>

        {repositoryProjects.length === 0 ? (
          <div className="site-panel p-5">
            <p className="text-sm text-[var(--site-muted)]">
              {isLoading
                ? "Loading repository details..."
                : "Repository details are unavailable right now."}
            </p>
          </div>
        ) : null}
      </section>
      </div>
    </Container>
  );
}
