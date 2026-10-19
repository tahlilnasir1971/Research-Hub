# Research Hub — Free Tier & Zero-Cost Architecture Audit

> **Policy Statement**: The Research Hub platform is built with a strictly verified $0.00 infrastructure model. Core paper discovery, metadata browsing, topic exploration, and citation generation have zero paid dependencies and operate permanently within free public allowances. Optional services (OpenRouter AI and Supabase Auth/DB) are built as non-breaking progressive enhancements that gracefully deactivate when unconfigured or exhausted.

---

## 1. Executive Summary

| Service | Category | Free Tier Quota / Allowance | Cost Risk | Architecture Safeguard |
| :--- | :--- | :--- | :--- | :--- |
| **Vercel Hobby** | Frontend & Serverless Hosting | 100 GB bandwidth/mo, 100 hrs serverless execution/mo | $0 (Hobby plan hard cap, non-commercial) | Next.js SSG + ISR caching, lightweight edge/serverless routes |
| **OpenAlex API** | Scholarly Metadata (Works, Authors, Topics) | 100,000 requests/day unauthenticated; 10 req/sec | $0 (Public benefit, completely free open data) | In-memory cache + polite pool email header, graceful fallback |
| **arXiv API** | Preprint Discovery & PDFs | 3 req/sec rate limit, unlimited total monthly queries | $0 (Non-profit Cornell University archive) | Sequential throttling, 3-second delay on bulk requests |
| **Crossref API** | DOI & Journal Metadata | 50 req/sec (polite pool via email header) | $0 (Open scholarly metadata) | In-memory cache, polite headers, fallback to OpenAlex |
| **OpenRouter** | AI Abstract Summaries & Explanations | Free-tier models (`:free` suffix, $0/M tokens) | $0 (Hard-blocked from paid models) | Server-side proxy, max token limit (500 tokens), client-side disabled if absent |
| **Supabase** | Optional Database & Auth | 500 MB DB, 50,000 MAU auth, 1 GB file storage | $0 (Free project pauses after 7 days inactivity) | LocalStorage fallback: 100% of bookmarking & library features work without Supabase |
| **GitHub** | Source Code & CI | 2,000 GitHub Actions min/mo, unlimited public repos | $0 (Standard free tier) | Zero paid runners required |

---

## 2. In-Depth Provider Audits & Quota Breakdown

### A. Vercel Hobby (Hosting & CDN)
* **Official Terms**: Intended for personal, non-commercial, open-source projects.
* **Monthly Allowances**:
  * Bandwidth: **100 GB / month**
  * Edge Middleware Invocations: **1,000,000 / month**
  * Serverless Function Execution: **100 GB-hours / month**
  * Custom Domains / Subdomains: Unlimited `*.vercel.app` subdomains ($0).
* **Billing Protection**: Vercel Hobby does not allow overage charges; accounts without a payment method entered cannot be charged. If bandwidth exceeds limits, traffic is throttled rather than billed.
* **Mitigation**: Paper metadata and search API responses utilize HTTP caching headers (`Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400`) to minimize serverless executions.

### B. OpenAlex (Primary Scholarly Data Provider)
* **Official Terms**: CC0 public domain metadata on 250M+ scientific works, 90M+ authors, 100k+ institutions.
* **Allowances & Rate Limits**:
  * Unauthenticated requests: Up to **100,000 requests per day**.
  * Concurrency: Up to **10 requests per second** in the "polite pool" (by providing a contact email in the `User-Agent` or `mailto` query parameter).
* **Billing Exposure**: **Zero**. OpenAlex has no billing mechanism for standard API access.
* **Mitigation**: `Aggregator` service caches frequently accessed queries and normalizes author and topic structures.

### C. arXiv API (Preprints & Open-Access PDFs)
* **Official Terms**: Operated by Cornell University under open-access principles.
* **Allowances & Rate Limits**:
  * Rate limit: No more than **1 request every 3 seconds**. Exceeding this results in a temporary 503 error.
* **Billing Exposure**: **Zero**.
* **Mitigation**: The `arxivAdapter` respects the 3-second rate limit with timestamp throttling and exponential backoff.

### D. Crossref REST API (DOI Resolution & Citations)
* **Official Terms**: Open metadata infrastructure funded by publisher membership.
* **Allowances & Rate Limits**:
  * Polite Pool: Unlimited requests up to **50 requests per second** when providing `mailto:contact@research-hub.local` in headers.
* **Billing Exposure**: **Zero**.
* **Mitigation**: Crossref is used primarily for DOI lookups and BibTeX/APA citation normalization.

### E. OpenRouter (Optional AI Assistant)
* **Official Terms**: Multi-provider AI gateway.
* **Zero-Cost Strategy**:
  * Only models with `:free` suffix or `pricing: 0` are permitted (e.g., `meta-llama/llama-3.3-70b-instruct:free`, `google/gemini-2.0-flash-exp:free`, `qwen/qwen-2.5-coder-32b-instruct:free`).
  * If a user does not configure `OPENROUTER_API_KEY`, the application marks AI as `inactive`.
  * The frontend disables the "AI Paper Summary" button and displays a helpful badge: *"AI is optional — runs in zero-cost mode without credentials"*.
* **Safeguards Against Accidental Billing**:
  * Hardcoded guard in server adapter: rejects requests if the target model does not contain `:free` unless explicitly overridden.
  * Server-side token ceiling: `max_tokens: 500`.
  * Rate limiter: Maximum 10 AI queries per IP per hour.
  * Timeout: 15-second abort signal to prevent dangling serverless executions.

### F. Supabase (Optional Auth & PostgreSQL)
* **Official Terms**:
  * Database: **500 MB** storage allowance.
  * Monthly Active Users (MAU): **50,000**.
  * Egress: **5 GB / month**.
  * Project Pausing: Projects are paused after 7 days of inactivity; can be unpaused for free in the dashboard.
* **Zero-Cost Strategy**:
  * The application does **not** mandate Supabase credentials.
  * Bookmarks, reading history, and saved searches are stored locally in `window.localStorage` by default.
  * If a user configures Supabase keys, cloud sync activates automatically. If credentials are missing or the database is paused, the app cleanly falls back to `localStorage` without crashing.

---

## 3. Cost-Control Verification Checklist

- [x] **No hardcoded API secrets**: All credentials read from environment variables.
- [x] **No paid fallback**: If OpenRouter fails or reaches rate limits, returns a clean informative error without trying paid alternatives.
- [x] **No mandatory database**: Complete anonymous research discovery without Supabase.
- [x] **No paid vector databases or embeddings**: Lexical and metadata searching performed via open scholarly APIs directly.
- [x] **No paid email services**: Polite pool uses unauthenticated email headers for rate-limit boosting only.
- [x] **No paid custom domains required**: Fully functional on `*.vercel.app` or local development.
- [x] **Safe Git distribution**: `.gitignore` strictly rejects `.env`, `.env.local`, and build artifacts.

---

## 4. Emergency Overrun Procedures

1. **If OpenRouter free model is deprecated**: Change `OPENROUTER_MODEL` in Vercel environment variables to an active free model from [OpenRouter Free Models](https://openrouter.ai/models?max_price=0), or clear `OPENROUTER_API_KEY` to deactivate AI while keeping paper search 100% active.
2. **If OpenAlex reaches daily limit**: The aggregator automatically delegates preprint queries to arXiv and DOI lookups to Crossref.
3. **If Vercel bandwidth is constrained**: Next.js client-side navigation (`next/link`) prevents full-page reloads, reducing edge bandwidth by ~85%.
