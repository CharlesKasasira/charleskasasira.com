
export type Subscribers = {
  count: number;
};

export type Views = {
  total: number;
};

export type YouTube = {
  subscriberCount: string;
  viewCount: string;
  videoCount: string;
  latestVideo: {
    videoId: string;
    title: string;
    publishedAt: string;
  } | null;
};
