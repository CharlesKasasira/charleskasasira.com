const isDevelopment = process.env.NODE_ENV === 'development'

const legacyBlogHost = [
  {
    type: 'host',
    value: 'blog.charleskasasira.com',
  },
]

const legacyBlogSlugs = [
  'articles-and-books-i-reread-2025',
  'cheat-sheet-arrays-in-javascript',
  'contribute-to-open-source-10-outlined-steps-2c8c80f8c538',
  'css-art-instagram-logo-with-pure-css',
  'day-1-7-days-of-react-724281dd22a2',
  'day2-7-days-of-reactjs-for-absolute-beginners-69ecb80bb9a8',
  'deploying-a-simple-html-page-using-a-self-hosted-gitlab-runner',
  'does-sort-ever-sort-anything',
  'how-to-click-outside-to-close-in-javascript',
  'how-to-create-a-dynamic-avatar-from-the-users-initials-pure-javascript',
  'how-to-create-a-simple-modalpopup-with-reactjs-and-tailwindcss',
  'introduction-to-the-node-package-manager-ac6c3a23d148',
  'my-time-at-ablestate-creatives-limited-ea28ec4eea01',
  'nice-imports-paths-in-reactjs-with-jsconfig-json-df856f8427c8',
  'node-repl-2f9f44270e8b',
  'output-to-the-command-line-using-node-js-6a43cfcd3db7',
  'semantic-versioning-what-you-should-know-4beb159e9365',
  'spot-the-difference-url-vs-uri',
  'sql-the-structured-query-language-6977464f367b',
  'what-is-a-flow-chart-in-programming',
  'what-is-github-and-why-use-it',
]

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ''} https://va.vercel-scripts.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://avatars.githubusercontent.com https://cdn.hashnode.com https://media.giphy.com https://www.farnamstreetblog.com",
  "font-src 'self' data:",
  "connect-src 'self' https://vitals.vercel-insights.com",
  'frame-src https://www.youtube-nocookie.com',
  "media-src 'self'",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  'upgrade-insecure-requests',
].join('; ')

const securityHeaders = [
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'Content-Security-Policy-Report-Only',
    value: contentSecurityPolicy,
  },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        has: legacyBlogHost,
        destination: 'https://charleskasasira.com/blog',
        permanent: true,
      },
      {
        source: '/archive',
        has: legacyBlogHost,
        destination: 'https://charleskasasira.com/blog',
        permanent: true,
      },
      {
        source: '/sitemap.xml',
        has: legacyBlogHost,
        destination: 'https://charleskasasira.com/sitemap.xml',
        permanent: true,
      },
      {
        source: '/rss.xml',
        has: legacyBlogHost,
        destination: 'https://charleskasasira.com/rss.xml',
        permanent: true,
      },
      ...legacyBlogSlugs.map((slug) => ({
        source: `/${slug}`,
        has: legacyBlogHost,
        destination: `https://charleskasasira.com/blog/${slug}`,
        permanent: true,
      })),
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
  experimental: {
    agentUpgrade: 'security',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
