# [charleskasasira.com](https://charleskasasira.com)

Charles Kasasira's portfolio for selected software projects, technical writing,
and videos. The projects page combines a manually curated showcase with live
GitHub statistics, so popularity does not decide which work represents the
portfolio.

## Stack

- Next.js 16 and React 19
- TypeScript
- Tailwind CSS 4
- Vercel Analytics and deployment

## Local development

Use Node.js 24 and npm. The committed `package-lock.json` is the authoritative
dependency lockfile.

```sh
git clone https://github.com/CharlesKasasira/charleskasasira.com.git
cd charleskasasira.com
npm ci
npm run dev
```

The development server runs at <http://localhost:3002>.

## Verification

Run the same checks used by GitHub Actions:

```sh
npm run lint
npm audit --omit=dev --audit-level=high
npm run build
```

Dependabot checks npm dependencies weekly. GitHub secret scanning and push
protection are enabled on the repository.
