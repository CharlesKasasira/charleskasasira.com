import type { NextApiRequest, NextApiResponse } from "next";

const CHANNEL_ID = "UClhrdUmdjbQi9fMq3R65BVw";

type ChannelResponse = {
  items?: Array<{
    statistics?: {
      subscriberCount?: string;
      viewCount?: string;
      videoCount?: string;
    };
    contentDetails?: {
      relatedPlaylists?: { uploads?: string };
    };
  }>;
};

type PlaylistResponse = {
  items?: Array<{
    snippet?: {
      title?: string;
      publishedAt?: string;
      resourceId?: { videoId?: string };
    };
  }>;
};

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  const apiKey = process.env.YOUTUBE_APIKEY;
  if (!apiKey) {
    return res.status(503).json({ message: "YouTube data unavailable" });
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics,contentDetails&id=${CHANNEL_ID}&key=${apiKey}`
    );
    const data = (await response.json()) as ChannelResponse;

    if (!response.ok || !data?.items?.[0]?.statistics) {
      return res.status(502).json({ message: "YouTube data unavailable" });
    }

    const { subscriberCount, viewCount, videoCount } = data.items[0].statistics;
    const uploadsPlaylist =
      data.items[0].contentDetails?.relatedPlaylists?.uploads;
    let latestVideo = null;

    if (uploadsPlaylist) {
      try {
        const latestResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylist}&maxResults=1&key=${apiKey}`
        );
        const latestData = (await latestResponse.json()) as PlaylistResponse;
        const snippet = latestData.items?.[0]?.snippet;
        const videoId = snippet?.resourceId?.videoId;

        if (
          latestResponse.ok &&
          snippet?.title &&
          snippet.publishedAt &&
          videoId
        ) {
          latestVideo = {
            videoId,
            title: snippet.title,
            publishedAt: snippet.publishedAt,
          };
        }
      } catch {
        // Statistics are still useful if the latest-video lookup fails.
      }
    }

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=1200, stale-while-revalidate=600"
    );
    return res.status(200).json({
      subscriberCount,
      viewCount,
      videoCount,
      latestVideo,
    });
  } catch {
    return res.status(502).json({ message: "YouTube data unavailable" });
  }
}
