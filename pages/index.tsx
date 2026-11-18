import Container from "components/Container";
import { getAllPosts } from "lib/blog";
import type { BlogPostSummary } from "lib/blog-shared";
import { formatPostDate } from "lib/blog-shared";
import type { GetStaticProps } from "next";
import Link from "next/link";

const expertise = [
  "Product engineering",
  "Frontend architecture",
  "Design systems",
  "Developer experience",
  "Workflow automation",
  "Technical education",
];

const selectedWork = [
  {
    name: "Git Quest",
    description: "Learning Git through an interactive fractured timeline.",
    href: "https://git.charleskasasira.com/",
    category: "Developer education",
    visual: "git",
  },
  {
    name: "Fala",
    description: "Brazilian Portuguese for conversations that happen in real life.",
    href: "https://portuguese.charleskasasira.com/",
    category: "Learning product",
    visual: "fala",
  },
];

const sideProjects = [
  {
    number: "01",
    title: "Open-source work",
    description: "Public tools, experiments, and repositories.",
    href: "/projects",
  },
  {
    number: "02",
    title: "YouTube",
    description: "Practical lessons from building and shipping software.",
    href: "/youtube",
  },
  {
    number: "03",
    title: "Writing",
    description: "Notes on code, systems, and what I am learning.",
    href: "/blog",
  },
];

type HomeProps = {
  recentPosts: BlogPostSummary[];
};

export default function Home({ recentPosts }: HomeProps) {
  return (
    <Container
      title="Charles Kasasira | Product Engineer and Creator"
      description="Kampala-based product engineer designing and building useful digital products, systems, and educational experiences."
    >
      <div className="studio-home">
        <section className="min-h-[calc(100svh-6rem)] pt-[10vh]">
          <h1 className="home-display studio-reveal">
            <span>Product</span>
            <span>Engineer</span>
          </h1>

          <div className="studio-label studio-reveal studio-reveal-delay-1 mt-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <Link
              href="/about"
              className="text-[var(--site-muted)] underline decoration-transparent underline-offset-4 transition hover:text-[var(--site-ink)] hover:decoration-current"
            >
              Charles Kasasira — Kampala, Uganda
            </Link>
            <p className="sm:text-right">
              Kampala, Uganda
              <br />
              Designing in code
            </p>
          </div>

          <div className="mt-[15vh] grid gap-12 pb-[9vh] lg:grid-cols-[minmax(0,1.65fr)_minmax(18rem,0.75fr)] lg:items-end">
            <p className="studio-reveal studio-reveal-delay-2 max-w-[29ch] text-balance text-[clamp(1.75rem,3.4vw,3rem)] leading-[1.2] tracking-[-0.02em] text-[var(--site-muted)]">
              I turn complex ideas into{" "}
              <em className="not-italic text-[var(--site-ink)]">
                useful products
              </em>
              , then share what the work taught me.
            </p>

            <div className="studio-reveal studio-reveal-delay-3">
              <p className="section-label">Expertise</p>
              <ul className="grid grid-cols-2 gap-x-6">
                {expertise.map((item) => (
                  <li
                    key={item}
                    className="border-b border-[var(--site-rule)] py-2 text-sm font-medium"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="work">
          <div className="studio-section-heading">
            <h2>Selected work</h2>
            <b>Built to be used</b>
          </div>

          <div className="selected-work-grid">
            {selectedWork.map((project, index) => (
              <article
                key={project.name}
                className={index === 0 ? "work-tile work-tile-wide" : "work-tile work-tile-narrow"}
              >
                <a href={project.href} target="_blank" rel="noopener noreferrer">
                  <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
                    <h3 className="text-[clamp(1.75rem,2.5vw,2.5rem)] font-medium leading-[1.05] tracking-[-0.025em]">
                      {project.name}
                    </h3>
                    <p className="max-w-[24ch] text-sm leading-5 text-[var(--site-muted)] sm:text-right">
                      {project.description}
                    </p>
                  </div>

                  {project.visual === "git" ? (
                    <div className="project-visual project-visual-git">
                      <div className="terminal-window">
                        <div className="terminal-bar">
                          <i />
                          <i />
                          <i />
                          <span>git-quest — timeline</span>
                        </div>
                        <div className="terminal-body">
                          <p>$ git log --oneline</p>
                          <p className="text-emerald-300">a81f2c7 restore the future</p>
                          <p className="text-amber-200">c04d991 fractured timeline</p>
                          <p className="text-white/45">8b21a03 where it began</p>
                          <p className="mt-6 text-white/75">Your next move?</p>
                          <span className="terminal-cursor" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="project-visual project-visual-fala">
                      <div className="fala-word fala-word-one">Oi!</div>
                      <div className="fala-card">
                        <span>Today&apos;s phrase</span>
                        <strong>Como você está?</strong>
                        <p>How are you?</p>
                      </div>
                      <div className="fala-word fala-word-two">Tudo bem.</div>
                    </div>
                  )}

                  <div className="studio-label mt-3 flex items-center justify-between">
                    <span>{project.category}</span>
                    <span>Visit ↗</span>
                  </div>
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-[18vh]">
          <div className="studio-section-heading">
            <h2>Things I make</h2>
            <b>On the side</b>
          </div>
          <div>
            {sideProjects.map((project) => (
              <Link key={project.number} href={project.href} className="studio-row">
                <span className="studio-row-number">{project.number}</span>
                <strong>{project.title}</strong>
                <span className="studio-row-description">{project.description}</span>
                <span className="studio-row-action">View →</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-[18vh]">
          <div className="studio-section-heading">
            <h2>Writing</h2>
            <b>Recent notes</b>
          </div>
          <div>
            {recentPosts.map((post, index) => (
              <Link key={post.slug} href={"/blog/" + post.slug} className="studio-row">
                <span className="studio-row-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <strong>{post.title}</strong>
                <span className="studio-row-description">
                  {formatPostDate(post.date)} · {post.readingMinutes} min
                </span>
                <span className="studio-row-action">Read →</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </Container>
  );
}

export const getStaticProps = (async () => ({
  props: { recentPosts: getAllPosts().slice(0, 4) },
})) satisfies GetStaticProps<HomeProps>;
