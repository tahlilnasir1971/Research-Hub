# Research Hub — Zero-Cost Deployment Guide

This guide walks you through deploying **Research Hub** on **Vercel's Free Hobby Plan** connected to **GitHub**, with $0.00 required spend.

---

## Prerequisites

1. A **GitHub** account (Free tier).
2. A **Vercel** account (Free Hobby tier) registered at [vercel.com](https://vercel.com).
3. *(Optional)* An **OpenRouter** account for free AI summaries: [openrouter.ai](https://openrouter.ai).
4. *(Optional)* A **Supabase** account for cloud library sync: [supabase.com](https://supabase.com).

---

## Step 1: Create and Push to GitHub

1. Initialize git in the project root (if not already done):
   ```bash
   git init
   git add .
   git commit -m "feat: initial Research Hub zero-cost MVP"
   ```

2. Create a new repository on GitHub (Public or Private):
   ```bash
   git remote add origin https://github.com/<your-username>/research-hub.git
   git branch -M main
   git push -u origin main
   ```

---

## Step 2: Import Project into Vercel

1. Log into your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** -> **Project**.
3. Select your GitHub account and find the **`research-hub`** repository.
4. Click **Import**.

---

## Step 3: Configure Build & Environment Settings

In the Vercel project configuration screen:

* **Framework Preset**: `Next.js` (automatically detected)
* **Root Directory**: `./` (leave default)
* **Build Command**: `npm run build`
* **Output Directory**: `.next`
* **Install Command**: `npm install`

### Environment Variables (All Optional for Initial Deploy)

| Variable Name | Required? | Recommended Zero-Cost Value | Description |
| :--- | :--- | :--- | :--- |
| `POLITE_POOL_EMAIL` | Optional | `your-email@domain.com` | Boosts OpenAlex and Crossref rate limits to polite pool ($0). |
| `OPENROUTER_API_KEY` | Optional | `sk-or-v1-...` | Only if you want AI paper explanations. Leave empty to run in zero-cost mode without AI. |
| `OPENROUTER_MODEL` | Optional | `meta-llama/llama-3.3-70b-instruct:free` | Any free model on OpenRouter ending in `:free`. |
| `NEXT_PUBLIC_SUPABASE_URL` | Optional | `https://xxxx.supabase.co` | Only if you want cloud auth/DB. Browser localStorage is used if omitted. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional | `eyJhbGci...` | Supabase public anonymous key. |

> **IMPORTANT**: You do **NOT** need to configure any of these to have a fully functional research discovery platform! Core search, papers, authors, topics, and PDF links work immediately.

---

## Step 4: Deploy and Verify

1. Click **Deploy**.
2. Wait for the build to finish (typically 1-2 minutes).
3. Vercel will assign a free production URL (e.g., `https://research-hub-<your-team>.vercel.app`).
4. Click through to verify:
   * **Homepage** loads with featured disciplines and search bar.
   * **Search page** (`/search?q=quantum+computing`) returns live papers from OpenAlex and arXiv with open-access badges.
   * **Paper detail page** (`/paper/<id>`) displays full abstract, citation counts, BibTeX export, and PDF links.
   * **Topic browsing** (`/topics`) displays disciplines and live subfield works.
   * **Author pages** (`/author/<id>`) display researcher metrics and publications.
   * **Library page** (`/library`) allows bookmarking papers into browser localStorage.
   * **System status** (`/status`) reports all API integrations and confirms zero-cost compliance.

---

## Step 5: Ongoing Zero-Cost Maintenance

* Automatic preview deployments are created for every pull request on GitHub.
* Merging into `main` automatically deploys to production.
* If you ever want to change the AI free model, simply update `OPENROUTER_MODEL` in the Vercel Project Settings > Environment Variables without modifying any code.
