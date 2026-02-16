import Container from "components/Container";
import Link from "next/link";

const skills = [
  "Frontend Engineering",
  "Product Design Systems",
  "TypeScript + Next.js",
  "API Integrations",
  "Technical Writing",
  "Developer Education",
];

const timeline = [
  {
    org: "RENU",
    role: "Intern",
    date: "Aug 2023",
  },
  {
    org: "Ablestate",
    role: "Frontend Developer",
    date: "May 2023",
  },
  {
    org: "WHD",
    role: "Graphics Designer",
    date: "Sept 2020",
  },
  {
    org: "Byte Of Hope",
    role: "Founding Member",
    date: "June 2019",
  },
];

const certifications = [
  "Machine Learning with Python - FreeCodeCamp",
  "Introduction to Generative AI - Google Cloud Skill Boost",
  "Introduction to Machine Learning - Kaggle",
  "Front-End Development Libraries - FreeCodeCamp",
  "Full-Stack Web Development - Ablestate",
  "Mobile App Development with Flutter - GDSC MUK",
];

export default function About() {
  return (
    <Container
      title="About | Charles Kasasira"
      description="Background, skills, and experience for Charles Kasasira."
    >
      <div className="mb-16 w-full space-y-10 text-zinc-900 dark:text-zinc-100">
        <section className="space-y-5">
          <p className="inline-flex rounded-full border border-emerald-500/30 bg-emerald-50 px-4 py-1 text-xs font-semibold tracking-[0.12em] text-emerald-900 dark:border-emerald-400/30 dark:bg-emerald-500/10 dark:text-emerald-200">
            ABOUT
          </p>
          <h1 className="text-4xl font-black tracking-tight md:text-5xl">
            I build digital products that are useful, fast, and easy to grow.
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
            I am a software designer and developer based in Kampala, Uganda. I
            enjoy turning ideas into scalable products, then documenting the
            process so other developers can ship faster with fewer mistakes.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold">Core Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-zinc-300 bg-zinc-100 px-4 py-1 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold">Experience Highlights</h2>
          <div className="space-y-3">
            {timeline.map((item) => (
              <article
                key={item.org}
                className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900/60"
              >
                <div>
                  <p className="font-semibold">{item.org}</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {item.role}
                  </p>
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {item.date}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold">Certifications</h2>
          <ul className="space-y-2 text-zinc-700 dark:text-zinc-300">
            {certifications.map((cert) => (
              <li key={cert} className="rounded-xl bg-zinc-100 px-4 py-2 dark:bg-zinc-900/70">
                {cert}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold">Links</h2>
          <ul className="space-y-2 text-zinc-700 dark:text-zinc-300">
            <li>
              GitHub:{" "}
              <a
                href="https://github.com/charleskasasira"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-amber-700 hover:text-amber-800 dark:text-amber-300 dark:hover:text-amber-200"
              >
                @charleskasasira
              </a>
            </li>
            <li>
              LinkedIn:{" "}
              <a
                href="https://www.linkedin.com/in/charleskasasira/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-amber-700 hover:text-amber-800 dark:text-amber-300 dark:hover:text-amber-200"
              >
                linkedin.com/in/charleskasasira
              </a>
            </li>
            <li>
              YouTube:{" "}
              <a
                href="https://youtube.com/@charleskasasira"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-amber-700 hover:text-amber-800 dark:text-amber-300 dark:hover:text-amber-200"
              >
                youtube.com/@charleskasasira
              </a>
            </li>
            <li>
              Website:{" "}
              <Link
                href="https://charleskasasira.com"
                className="font-medium text-amber-700 hover:text-amber-800 dark:text-amber-300 dark:hover:text-amber-200"
              >
                charleskasasira.com
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </Container>
  );
}
