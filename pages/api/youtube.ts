import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=UClhrdUmdjbQi9fMq3R65BVw&key=${process.env.YOUTUBE_APIKEY}`
    );
    const data = await response.json();

    if (!response.ok || !data?.items?.[0]?.statistics) {
      return res.status(500).json({ message: "Failed" });
    }

    const { subscriberCount, viewCount, videoCount } = data.items[0].statistics;
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=1200, stale-while-revalidate=600"
    );
    return res.status(200).json({
      subscriberCount,
      viewCount,
      videoCount,
    });
  } catch {
    return res.status(500).json({ message: "Failed" });
  }
}
