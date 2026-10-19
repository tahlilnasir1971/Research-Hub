# Research Hub 🔬

> **Zero-Cost Open Scholarly Discovery Platform**  
> Explore 250M+ research papers, preprints, and open-access scientific publications powered directly by OpenAlex, arXiv, and Crossref. Built with an absolute **$0.00 required spend** architecture.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Zero-Cost Verified](https://img.shields.io/badge/Infrastructure-%240.00%20Zero--Cost-success)](#zero-cost-architecture-guarantee)

---

## 🌟 Key Features

* **Multi-Provider Scholarly Search**: Unified discovery across **OpenAlex**, **arXiv**, and **Crossref** with automatic title & DOI deduplication and polite pool rate boosting.
* **Abstract Reconstructor**: Reconstructs OpenAlex inverted abstract indexes into readable prose in real time.
* **Algorithmic Citation Export**: Instant client-side generation of **BibTeX**, **APA**, **MLA**, and **RIS** formats at zero cost.
* **Open Access PDF Reader**: Direct links to freely available full-text PDFs on publisher sites and preprint servers.
* **Curated Topic Explorer**: Browse 6 major scientific disciplines (Computer Science, Biology, Physics, Medicine, Climate, Mathematics) and dozens of specialized subfields.
* **Researcher Profiles**: Inspect author works, total citations, affiliations, and h-index via OpenAlex metadata.
* **Anonymous Saved Library**: Save papers into your personal reading list stored in browser `localStorage` (no user registration or paid database required), with batch `.bib` export.
* **Optional AI Companion**: Server-side proxy for **OpenRouter** free-tier models (`:free` suffix) providing plain-language summaries and research Q&A with rate limiting (20 req/hr per IP) and graceful failure.
* **Live System Status & Audit**: Built-in `/status` route displaying real-time API latency and quota compliance.

---

## 🛡️ Zero-Cost Architecture Guarantee

Research Hub operates under a strict zero-cost policy documented in [`docs/FREE_TIER_AUDIT.md`](docs/FREE_TIER_AUDIT.md):

1. **No Paid Dependencies**: Zero requirement for paid APIs, paid databases, or paid hosting.
2. **No Paid AI Fallback**: If OpenRouter free models are overloaded or unconfigured, the application gracefully disables AI features and keeps paper search 100% active.
3. **No Mandatory Cloud Database**: Core library and bookmarking features utilize client-side `localStorage`. Optional Supabase integration can be activated via environment variables without breaking existing workflows.
4. **No Custom Domain Requirement**: Deploys seamlessly to Vercel Hobby on a free `*.vercel.app` subdomain.

---

## 🚀 Quick Start (Local Development)

### Prerequisites
* Node.js 18+ (tested on Node.js 24)
* npm 9+

### 1. Clone & Install
```bash
git clone https://github.com/<your-username>/research-hub.git
cd research-hub
npm install
```

### 2. Configure Environment (Optional)
```bash
cp .env.example .env.local
```
> **Note**: All environment variables are optional. The platform runs out of the box with zero keys configured!

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Verification

Run the automated test suite:
```bash
npm test
```
* Tests abstract reconstruction algorithms.
* Tests multi-provider paper deduplication.
* Tests BibTeX, APA, MLA, and RIS citation generators.
* Tests OpenRouter rate limiting and graceful unconfigured degradation.

Run linter:
```bash
npm run lint
```

Run production build:
```bash
npm run build
```

---

## 🚢 Free Deployment to Vercel Hobby

Follow the detailed guide in [`docs/DEPLOYMENT_GUIDE.md`](docs/DEPLOYMENT_GUIDE.md):

1. Push your repository to GitHub:
   ```bash
   git remote add origin https://github.com/<your-username>/research-hub.git
   git branch -M main
   git push -u origin main
   ```
2. Log into [Vercel](https://vercel.com) and click **Import Project**.
3. Select your `research-hub` repository.
4. Leave all build settings as default (`npm run build`).
5. (Optional) Set `OPENROUTER_API_KEY` in Vercel Environment Variables to enable AI summaries.
6. Click **Deploy**.

---

## 📄 License

MIT License. Open-source and freely available for researchers, students, and educators worldwide.
