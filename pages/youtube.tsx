import Container from "components/Container";
import useSWR from "swr";
import { currencyFormatter } from "utils/numberFormatter";
import type { YouTube } from "utils/types";

const CHANNEL_URL =
  "https://www.youtube.com/channel/UClhrdUmdjbQi9fMq3R65BVw";
const SUBSCRIBER_GOAL = 1_000;

function formatPublishedDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

async function fetchYouTube(input: RequestInfo): Promise<YouTube> {
  const response = await fetch(input);

  if (!response.ok) {
    throw new Error("YouTube data unavailable");
  }

  return response.json();
}

function StatCard({
  label,
  value,
  isLoading,
}: {
  label: string;
  value: number | null;
  isLoading: boolean;
}) {
  return (
    <article className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900/60">
      {isLoading ? (
        <div className="h-9 w-28 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      ) : (
        <p className="text-3xl font-black text-zinc-900 dark:text-zinc-100">
          {value === null ? "—" : currencyFormatter(value)}
        </p>
      )}
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{label}</p>
    </article>
  );
}

export default function YouTubePage() {
  const { data, error, isLoading } = useSWR<YouTube>(
    "/api/youtube",
    fetchYouTube,
    {
      revalidateOnFocus: false,
      dedupingInterval: 10 * 60 * 1000,
    }
  );

  const subscriberCount = Number(data?.subscriberCount ?? 0);
  const viewCount = Number(data?.viewCount ?? 0);
  const videoCount = Number(data?.videoCount ?? 0);
  const progress = Math.min(
    100,
    Math.round((subscriberCount / SUBSCRIBER_GOAL) * 100)
  );
  const subscribersRemaining = Math.max(
    0,
    SUBSCRIBER_GOAL - subscriberCount
  );

  return (
    <Container
      title="YouTube | Charles Kasasira"
      description="Videos by Charles Kasasira about frontend engineering, product development, and shipping real software."
    >
      <div className="mb-4 w-full space-y-10 text-zinc-900 dark:text-zinc-100">
        <section className="space-y-5">
          <p className="inline-flex rounded-full border border-red-500/30 bg-red-50 px-4 py-1 text-xs font-semibold tracking-[0.12em] text-red-900 dark:border-red-400/30 dark:bg-red-500/10 dark:text-red-200">
            YOUTUBE
          </p>
          <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h1 className="text-4xl font-black tracking-tight md:text-5xl">
                Build useful software with me.
              </h1>
              <p className="mt-3 max-w-2xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
                Practical frontend engineering, product development, and honest
                lessons from building and shipping real projects.
              </p>
            </div>
            <a
              href={`${CHANNEL_URL}?sub_confirmation=1`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-red-600 px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-red-700 focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950"
            >
              Subscribe on YouTube
            </a>
          </div>
        </section>

        <section aria-labelledby="channel-progress">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="channel-progress" className="text-2xl font-bold">
                Road to {SUBSCRIBER_GOAL.toLocaleString("en-US")}
              </h2>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {data
                  ? `${subscriberCount.toLocaleString("en-US")} of ${SUBSCRIBER_GOAL.toLocaleString("en-US")} subscribers — ${subscribersRemaining.toLocaleString("en-US")} to go.`
                  : error
                    ? "Subscriber progress is temporarily unavailable."
                    : "Loading the latest subscriber count..."}
              </p>
            </div>
            <p className="text-2xl font-black text-red-600 dark:text-red-400">
              {data ? `${progress}%` : "—"}
            </p>
          </div>
          <div
            className="h-4 overflow-hidden rounded-full bg-red-100 dark:bg-red-950/60"
            role="progressbar"
            aria-label="Subscriber goal progress"
            aria-valuemin={0}
            aria-valuemax={SUBSCRIBER_GOAL}
            aria-valuenow={subscriberCount}
          >
            <div
              className="h-full rounded-full bg-red-600 transition-[width] duration-500"
              style={{ width: `${data ? progress : 0}%` }}
            />
          </div>
          {error ? (
            <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
              Live channel statistics are temporarily unavailable. The channel
              and videos are still accessible below.
            </p>
          ) : null}
        </section>

        <section
          className="grid gap-3 sm:grid-cols-3"
          aria-label="Channel statistics"
        >
          <StatCard
            label="Subscribers"
            value={data ? subscriberCount : null}
            isLoading={isLoading}
          />
          <StatCard
            label="Total views"
            value={data ? viewCount : null}
            isLoading={isLoading}
          />
          <StatCard
            label="Videos published"
            value={data ? videoCount : null}
            isLoading={isLoading}
          />
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-2xl font-bold">Latest video</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              The newest upload from the channel.
            </p>
          </div>

          {data?.latestVideo ? (
            <article className="grid overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/60 lg:grid-cols-[minmax(0,1.6fr)_minmax(16rem,1fr)]">
              <div className="aspect-video w-full bg-black">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${data.latestVideo.videoId}`}
                  title={data.latestVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              <div className="flex flex-col items-start justify-center p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-red-600 dark:text-red-400">
                  Latest upload
                </p>
                <h3 className="mt-3 text-2xl font-bold">
                  {data.latestVideo.title}
                </h3>
                <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                  Published {formatPublishedDate(data.latestVideo.publishedAt)}
                </p>
                <a
                  href={`https://www.youtube.com/watch?v=${data.latestVideo.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold transition hover:border-zinc-900 dark:border-zinc-700 dark:hover:border-zinc-100"
                >
                  Watch on YouTube
                </a>
              </div>
            </article>
          ) : (
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/60">
              <p className="text-zinc-600 dark:text-zinc-400">
                {isLoading
                  ? "Loading the latest upload..."
                  : "The latest video could not be loaded here."}
              </p>
              <a
                href={`${CHANNEL_URL}/videos`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold transition hover:border-zinc-900 dark:border-zinc-700 dark:hover:border-zinc-100"
              >
                Browse videos on YouTube
              </a>
            </div>
          )}
        </section>
      </div>
    </Container>
  );
}
