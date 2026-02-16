import { useMemo, useState } from "react";

type GithubGraphProps = {
  username: string;
};

function GithubGraph({ username }: GithubGraphProps) {
  const contributionsUrl = useMemo(
    () => `/api/githubGraph?username=${encodeURIComponent(username)}`,
    [username]
  );

  const [hasError, setHasError] = useState(false);

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
      {hasError ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Unable to load the contributions graph right now. View it directly on{" "}
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-amber-700 hover:text-amber-800 dark:text-amber-300 dark:hover:text-amber-200"
          >
            GitHub
          </a>
          .
        </p>
      ) : (
        <div className="min-w-[760px]">
        {/* GitHub returns the exact same yearly contributions chart used on profile pages. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={contributionsUrl}
          alt={`${username} GitHub contribution graph`}
          className="h-auto w-full"
          loading="lazy"
          onError={() => setHasError(true)}
        />
        </div>
      )}
    </div>
  );
}

export default GithubGraph;
