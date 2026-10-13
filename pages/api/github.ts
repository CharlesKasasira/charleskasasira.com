import type { NextApiRequest, NextApiResponse } from "next";
import { getGithubSummary, type GithubSummary } from "utils/github";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<GithubSummary>
) {
  const summary = await getGithubSummary();
  const maxAge = summary.source === "live" ? 1200 : 300;

  res.setHeader(
    "cache-control",
    `public, s-maxage=${maxAge}, stale-while-revalidate=${Math.floor(maxAge / 2)}`
  );
  res.setHeader("x-github-source", summary.source);
  res.status(200).json(summary);
}
