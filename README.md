# ÉCLAT — Optimize Your Reels

ÉCLAT is a lightweight, high-performance web application designed for content creators to score, optimize, and schedule their short-form content (Reels/Shorts/TikToks) before posting. It features a deterministic 7-point optimization checklist (HookScore), auto-generated captions, daily popular keyword trends, and a content history diary.

Built using Next.js 15, React, Tailwind CSS, and Supabase Postgres.

---

## Features

- **Upload Guidance (HookScore)**: Input video metrics (length, audio type, overlays) to get a 7-point optimization review graded A-F.
- **Auto-Generated Captions**: Instantly copy customized caption templates with popular creator hashtags.
- **Trending Topics**: Stay up to date with a curated list of daily trending keywords and popular video formats fetched directly via YouTube.
- **Content Diary**: A personal log of all your scored videos to trace engagement and topic popularity patterns over time.
- **Aesthetic Dark/Light Theme**: A minimalist, high-contrast, professional design with sleek accents and micro-animations.

---

## Setup Instructions

### 1. Database Setup (Supabase)

1. Create a free project at [Supabase](https://supabase.com).
2. Open the **SQL Editor** in your Supabase Dashboard.
3. Click **New Query** and copy the contents of the `supabase/migration.sql` file.
4. Click **Run** to set up the `creators`, `posts`, and `trends` tables along with Row Level Security (RLS) policies.
5. In your Supabase Dashboard, navigate to **Project Settings → API** to get your **Project URL** and **Anon Key**.

### 2. YouTube Data API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com).
2. Create a project and enable the **YouTube Data API v3**.
3. Create an **API Key** credentials page.

### 3. Environment Variables Configuration

Create or update your `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
YOUTUBE_API_KEY=your-youtube-api-key
CRON_SECRET=your-cron-secret-for-trends
```

### 4. Install Dependencies & Run

To start the local development server:

```bash
# Install dependencies
npm install

# Start Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view and test the application!

---

## Project Structure

- `src/app/` — Application pages and layout routes (next.js app router)
- `src/components/` — Sleek, modular visual components
- `src/lib/` — Checklist scoring engine and database helpers
- `supabase/` — Database migration schema script
