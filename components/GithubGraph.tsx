import React from "react";

type GithubGraphProps = {
  username: string;
};

function GithubGraph({ username }: GithubGraphProps) {
  const contributionsUrl = `/api/githubGraph?username=${encodeURIComponent(
    username
  )}`;

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
      <div className="min-w-[760px]">
        {/* GitHub returns the exact same yearly contributions chart used on profile pages. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={contributionsUrl}
          alt={`${username} GitHub contribution graph`}
          className="h-auto w-full"
          loading="lazy"
        />
      </div>
    </div>
  );
}

export default GithubGraph;
