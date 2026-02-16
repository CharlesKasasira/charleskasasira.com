import Head from "next/head";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import Footer from "./Footer";
import Nav from "./nav";

type ContainerProps = {
  children: ReactNode;
  title?: string;
  description?: string;
  type?: string;
  image?: string;
};

function Container(props: ContainerProps) {
  const router = useRouter();
  const siteUrl = "https://charleskasasira.com";
  const { children, ...customProps } = props;
  const meta = {
    title: "Charles Kasasira | Software Designer and Developer",
    description:
      "Portfolio for Charles Kasasira, a software designer and developer building useful digital products.",
    type: "website",
    image: `${siteUrl}/static/images/charles-kasasira.png`,
    ...customProps,
  };

  return (
    <div className="relative">
      <Head>
        <title>{meta.title}</title>
        <meta name="robots" content="follow, index" />
        <meta content={meta.description} name="description" />
        <meta property="og:url" content={`${siteUrl}${router.asPath}`} />
        <link rel="canonical" href={`${siteUrl}${router.asPath}`} />
        <meta property="og:type" content={meta.type} />
        <meta property="og:site_name" content="Charles Kasasira" />
        <meta property="og:description" content={meta.description} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:image" content={meta.image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@KasasiraC" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={meta.image} />
      </Head>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.15),transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.12),transparent_40%)] dark:bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.2),transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.16),transparent_40%)]" />
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-4 md:px-8">
        <div className="flex min-h-[calc(100vh-2rem)] flex-col rounded-3xl border border-zinc-200 bg-white/95 px-5 shadow-xl shadow-zinc-300/20 dark:border-zinc-800 dark:bg-[#151515]/95 dark:shadow-black/30 md:px-10">
          <Nav />
          <main id="skip" className="flex flex-1 flex-col pt-8">
            {children}
            <Footer />
          </main>
        </div>
      </div>
    </div>
  );
}

export default Container;
