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
    <div className="relative flex min-h-screen w-full flex-col">
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
      <div className="absolute inset-0 -z-10 dark:bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.2),transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.16),transparent_40%)]" />
      <Nav />
      <main
        id="skip"
        className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 pt-10 sm:px-8 lg:px-12"
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default Container;
