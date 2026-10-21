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
    <div className="w-full overflow-x-auto rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
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
                className="h-2.5 w-2.5 rounded-[2px] bg-zinc-200 dark:bg-zinc-800"
                aria-hidden="true"
              />
            ))}
          </div>
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              The live graph is unavailable, but the GitHub profile remains
              accessible.
            </p>
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-900 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-100 dark:hover:text-zinc-100"
            >
              View activity on GitHub
            </a>
          </div>
        </div>
      ) : (
        <div className="relative min-h-24 min-w-[760px]">
          {!hasLoaded ? (
            <div className="absolute inset-0 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900" />
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
