export type MenuItem = {
  text: string;
  href: string;
  external?: boolean;
};

export const menuData: MenuItem[] = [
  {
    text: "Home",
    href: "/",
  },
  {
    text: "About",
    href: "/about",
  },
  {
    text: "Projects",
    href: "/projects",
  },
  {
    text: "YouTube",
    href: "/youtube",
  },
  {
    text: "Blog",
    href: "https://blog.charleskasasira.com",
    external: true,
  },
];
