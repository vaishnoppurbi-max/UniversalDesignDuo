# Deploying to Vercel

This project is a Next.js app. The public site works out of the box; the admin
panel (`/admin`) needs Supabase in production because Vercel's filesystem is
read-only (it can't write `data/site-content.json` or `public/uploads/`).

## 1. Set up Supabase

1. Create a project at https://supabase.com (or reuse an existing one).
2. Open the SQL editor and run [`SUPABASE_SETUP.sql`](./SUPABASE_SETUP.sql).
   This creates the `site_content` table and the public `uploads` storage bucket.
3. Go to **Settings → API** and copy:
   - **Project URL** → `SUPABASE_URL`
   - **service_role** secret key → `SUPABASE_SERVICE_ROLE_KEY`

## 2. Push to GitHub

Already wired to `github.com/vaishnoppurbi-max/UniversalDesignDuo`. Push `main`.

## 3. Import into Vercel

1. Go to https://vercel.com/new and import the GitHub repo.
2. Framework preset: **Next.js** (auto-detected). No build settings to change.
3. Add **Environment Variables** (Settings → Environment Variables), all
   environments:

   | Name | Value |
   |------|-------|
   | `ADMIN_PASSWORD` | your chosen admin password |
   | `SESSION_SECRET` | 64-char hex (see `.env.example`) |
   | `SUPABASE_URL` | from Supabase |
   | `SUPABASE_SERVICE_ROLE_KEY` | from Supabase |

4. Click **Deploy**. Every push to `main` auto-deploys.

## Notes

- On first load the app seeds Supabase with the content from
  `data/site-content.json`, then reads/writes Supabase from then on.
- Locally, leave `SUPABASE_URL` blank to keep using the filesystem — the code
  auto-detects and falls back.
- Never commit `.env.local` (it's gitignored). Secrets live in Vercel only.
