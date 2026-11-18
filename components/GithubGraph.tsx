import { useMemo, useState } from "react";

type GithubGraphProps = {
  username: string;
};

type GithubGraphImageProps = GithubGraphProps & {
  contributionsUrl: string;
};

function GithubGraphImage({ username, contributionsUrl }: GithubGraphImageProps) {
  const [hasError, setHasError] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  return (
    <div className="site-panel w-full overflow-x-auto p-4">
      {hasError ? (
        <div className="min-w-[680px]">
          <div
            className="mb-4 grid grid-flow-col grid-rows-7 gap-1"
            role="img"
            aria-label="GitHub contribution graph preview unavailable"
          >
            {Array.from({ length: 140 }, (_, index) => (
              <span
                key={index}
                className="site-skeleton h-2.5 w-2.5 rounded-[2px]"
                aria-hidden="true"
              />
            ))}
          </div>
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-[var(--site-muted)]">
              The live graph is unavailable, but the GitHub profile remains
              accessible.
            </p>
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded-full border border-[var(--site-rule)] px-4 py-2 text-sm font-semibold text-[var(--site-muted)] transition hover:border-[var(--site-ink)] hover:text-[var(--site-ink)]"
            >
              View activity on GitHub
            </a>
          </div>
        </div>
      ) : (
        <div className="relative min-h-24 min-w-[760px]">
          {!hasLoaded ? (
            <div className="site-skeleton absolute inset-0 animate-pulse rounded-xl" />
          ) : null}
          <img
            src={contributionsUrl}
            alt={`${username} GitHub contribution graph`}
            className={`h-auto w-full transition-opacity ${hasLoaded ? "opacity-100" : "opacity-0"}`}
            loading="eager"
            onLoad={() => setHasLoaded(true)}
            onError={() => setHasError(true)}
          />
        </div>
      )}
    </div>
  );
}

function GithubGraph({ username }: GithubGraphProps) {
  const contributionsUrl = useMemo(
    () => `/api/githubGraph?username=${encodeURIComponent(username)}`,
    [username]
  );

  return (
    <GithubGraphImage
      key={contributionsUrl}
      username={username}
      contributionsUrl={contributionsUrl}
    />
  );
}

export default GithubGraph;
