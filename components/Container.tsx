import dynamic from "next/dynamic";
import Head from "next/head";
import NextLink from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import cn from "classnames";
import { useRouter } from "next/router";
import MobileMenu from "./MobileMenu";
const Footer = dynamic(() => import("./Footer"), {
  ssr: false,
});
import { motion, AnimateSharedLayout } from "framer-motion";

import { DarkModeSwitch } from "react-toggle-dark-mode";
import { menuData } from "utils/menuData";

function NavItem({ href, text }) {
  const router = useRouter();
  const isActive = router.asPath === href;
  return (
    <NextLink href={href}>
      <span
        className={cn(
          isActive
            ? "font-semibold text-gray-800 dark:text-gray-200"
            : "font-normal text-gray-600 dark:text-gray-400",
          "hidden md:inline-block p-1 sm:px-3 sm:py-2 rounded-lg transition-all"
        )}
      >
        {text}
      </span>
    </NextLink>
  );
}

function Container(props) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  const router = useRouter();

  useEffect(() => setMounted(true), []);

  const { children, ...customProps } = props;
  const meta = {
    title: "Charles Kasasira - Developer, Creator",
    description:
      "Charles Kasasira is a Front-end developer, Computer Science enthusiast, and youtube creator",
    type: "website",
    ...customProps,
    image: "https://charleskasasira.com/static/images/charles-kasasira.png",
  };

  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <div className="bg-[#f6f7f8] dark:bg-[#000000]">
      <Head>
        <title>{meta.title}</title>
        <meta name="robots" content="follow, index" />
        <meta content={meta.description} name="description" />
        <meta
          property="og:url"
          content={`https://www.charleskasasira.com${router.asPath}`}
        />
        <link
          rel="canonical"
          href={`https://www.charleskasasira.com${router.asPath}`}
        />
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
      <div className="flex flex-col max-w-4xl lg:max-w-5xl mx-auto min-h-screen bg-white dark:bg-[#18181b] shadow-lg px-6 md:px-12">
        <div className="flex flex-col justify-center">
          <nav className="flex items-center w-full justify-between py-8">
            <a href="#skip" className="skip-nav">
              Skip to content
            </a>
            <AnimateSharedLayout>
              <motion.div className="ml-[-0.60rem]">
                <MobileMenu />
                <motion.ul
                  className="flex gap-1 relative z-10"
                  onHoverEnd={() => setActiveIndex(null)}
                >
                  {menuData.map((menu, index) => (
                    <motion.li
                    onHoverStart={() => setActiveIndex(index)}
                    className="relative px-2 inline-block  cursor-pointer z-10"
                  >
                    <NavItem href={menu.href} text={menu.text} />
                    {activeIndex === index ? (
                      <motion.span
                        layoutId="cover"
                        className="cover bg-[#eaeaea] dark:bg-zinc-800 absolute inset-0 -z-10 rounded-md"
                      />
                    ) : null}
                    
                  </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            </AnimateSharedLayout>
            <div className="nav-cta">
              <DarkModeSwitch
                style={{ marginBottom: "0" }}
                checked={resolvedTheme === "dark"}
                onChange={() =>
                  setTheme(resolvedTheme === "dark" ? "light" : "dark")
                }
                size={25}
              />
            </div>
          </nav>
        </div>
        <main id="skip" className="flex flex-col justify-center">
          {children}
          <Footer />
        </main>
      </div>
    </div>
  );
}

export default Container;
