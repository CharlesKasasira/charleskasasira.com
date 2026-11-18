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
    <article className="group relative overflow-hidden border-b border-[var(--site-rule)] py-5 sm:border-r sm:px-5 sm:first:pl-0 sm:last:border-r-0">
      {isLoading ? (
        <div className="site-skeleton h-9 w-28 animate-pulse rounded-lg" />
      ) : (
        <p className="origin-left text-4xl font-medium tracking-[-0.025em]">
          {value === null ? "—" : currencyFormatter(value)}
        </p>
      )}
      <p className="mt-2 text-sm text-[var(--site-muted)]">
        {label}
      </p>
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-[var(--site-ink)] transition-transform duration-200 group-hover:scale-x-100 motion-reduce:transition-none"
      />
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
      <div className="studio-page mb-4 w-full space-y-[12vh]">
        <section className="space-y-5 pt-[2vh]">
          <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="studio-page-kicker mb-5">YouTube</p>
              <h1 className="studio-page-title max-w-5xl">
                Build useful software with me.
              </h1>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-[var(--site-muted)]">
                Practical frontend engineering, product development, and honest
                lessons from building and shipping real projects.
              </p>
            </div>
            <a
              href={`${CHANNEL_URL}?sub_confirmation=1`}
              target="_blank"
              rel="noopener noreferrer"
              className="site-button-primary inline-flex shrink-0 items-center justify-center rounded-full px-6 py-3 font-semibold transition hover:px-7"
            >
              Subscribe on YouTube
            </a>
          </div>
        </section>

        <section aria-labelledby="channel-progress">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="channel-progress" className="text-2xl font-semibold tracking-[-0.018em]">
                Road to {SUBSCRIBER_GOAL.toLocaleString("en-US")}
              </h2>
              <p className="mt-1 text-sm text-[var(--site-muted)]">
                {data
                  ? `${subscriberCount.toLocaleString("en-US")} of ${SUBSCRIBER_GOAL.toLocaleString("en-US")} subscribers — ${subscribersRemaining.toLocaleString("en-US")} to go.`
                  : error
                    ? "Subscriber progress is temporarily unavailable."
                    : "Loading the latest subscriber count..."}
              </p>
            </div>
            <p className="text-3xl font-medium tracking-[-0.025em]">
              {data ? `${progress}%` : "—"}
            </p>
          </div>
          <div
            className="site-skeleton h-2 overflow-hidden rounded-full"
            role="progressbar"
            aria-label="Subscriber goal progress"
            aria-valuemin={0}
            aria-valuemax={SUBSCRIBER_GOAL}
            aria-valuenow={subscriberCount}
          >
            <div
              className="h-full rounded-full bg-[var(--site-ink)] transition-[width] duration-500"
              style={{ width: `${data ? progress : 0}%` }}
            />
          </div>
          {error ? (
            <p className="mt-3 text-xs text-[var(--site-muted)]">
              Live channel statistics are temporarily unavailable. The channel
              and videos are still accessible below.
            </p>
          ) : null}
        </section>

        <section
          className="grid sm:grid-cols-3"
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
            <h2 className="text-3xl font-medium tracking-[-0.025em]">Latest video</h2>
            <p className="mt-1 text-sm text-[var(--site-muted)]">
              The newest upload from the channel.
            </p>
          </div>

          {data?.latestVideo ? (
            <article className="grid overflow-hidden border-y border-[var(--site-rule)] lg:grid-cols-[minmax(0,1.6fr)_minmax(16rem,1fr)]">
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
                <p className="studio-label text-[var(--site-muted)]">
                  Latest upload
                </p>
                <h3 className="mt-3 text-3xl font-medium tracking-[-0.025em]">
                  {data.latestVideo.title}
                </h3>
                <p className="studio-caption mt-3">
                  Published {formatPublishedDate(data.latestVideo.publishedAt)}
                </p>
                <a
                  href={`https://www.youtube.com/watch?v=${data.latestVideo.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 rounded-full border border-[var(--site-rule)] px-4 py-2 text-sm font-semibold transition hover:border-[var(--site-ink)]"
                >
                  Watch on YouTube
                </a>
              </div>
            </article>
          ) : (
            <div className="site-panel p-6">
              <p className="text-[var(--site-muted)]">
                {isLoading
                  ? "Loading the latest upload..."
                  : "The latest video could not be loaded here."}
              </p>
              <a
                href={`${CHANNEL_URL}/videos`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex rounded-full border border-[var(--site-rule)] px-4 py-2 text-sm font-semibold transition hover:border-[var(--site-ink)]"
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
