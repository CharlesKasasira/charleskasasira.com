import { getAllPosts } from "lib/blog";

function generateSiteMap() {
  const lastUpdated = new Date().toISOString().split("T")[0];
  const posts = getAllPosts();
  const blogUrls = posts
    .map(
      (post) => `
     <url>
       <loc>https://charleskasasira.com/blog/${post.slug}</loc>
       <lastmod>${new Date(post.updated).toISOString().split("T")[0]}</lastmod>
       <changefreq>monthly</changefreq>
       <priority>0.6</priority>
     </url>`,
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>https://charleskasasira.com</loc>
       <lastmod>${lastUpdated}</lastmod>
       <changefreq>always</changefreq>
       <priority>0.8</priority>
     </url>
     <url>
       <loc>https://charleskasasira.com/about</loc>
       <lastmod>${lastUpdated}</lastmod>
       <changefreq>monthly</changefreq>
       <priority>0.5</priority>
     </url>
     <url>
       <loc>https://charleskasasira.com/projects</loc>
       <lastmod>${lastUpdated}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.3</priority>
     </url>
     <url>
       <loc>https://charleskasasira.com/blog</loc>
       <lastmod>${lastUpdated}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.7</priority>
     </url>
     <url>
       <loc>https://charleskasasira.com/youtube</loc>
       <lastmod>${lastUpdated}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.3</priority>
     </url>
     ${blogUrls}
   </urlset>
 `;
}

function SiteMap() {
  return null;
}

export async function getServerSideProps({ res }) {
  const sitemap = generateSiteMap();

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;
