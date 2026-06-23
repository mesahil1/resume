# Mohamod Sahil Ansari — Portfolio

## Project structure

```
.
├── index.template.html   ← source of truth (commit this)
├── build.js              ← injects env vars → dist/index.html
├── package.json
├── netlify.toml          ← Netlify config
├── vercel.json           ← Vercel config (alternative)
├── .env.example          ← template — copy to .env and fill in
├── .env                  ← your real secrets — NEVER commit
└── dist/
    └── index.html        ← built output (git-ignored)
```

## Local development

```bash
cp .env.example .env
# Edit .env — add your real SUPABASE_URL and SUPABASE_ANON_KEY

npm run build       # produces dist/index.html
npm run dev         # build + serve locally on http://localhost:3000
```

## Deploy to Netlify (recommended)

1. Push the repo to GitHub (`.env` is git-ignored, `dist/` too).
2. Connect the repo in Netlify → **New site from Git**.
3. Netlify auto-detects `netlify.toml` (build command: `node build.js`, publish: `dist`).
4. Go to **Site Settings → Environment Variables** and add:
   - `SUPABASE_URL`  
   - `SUPABASE_ANON_KEY`
5. Trigger a deploy — Netlify runs `build.js`, which reads the env vars and writes `dist/index.html`.
6. Point your custom domain `mohamodsahilansari.com.np` in **Domain Management**.

## Deploy to Vercel (alternative)

Same idea — set env vars in the Vercel dashboard, `vercel.json` handles the rest.

## Why this approach?

A static HTML file has no server runtime, so it can't read `.env` at request time.  
The build script runs **at deploy time** on the CI/CD platform, which does have access to env vars — it bakes the values into the HTML and produces the final file.  
Your secrets never touch the repository.

## Reports & Papers (PDF uploads)

The site includes a "Reports & Papers" section (alongside the blog) for uploading your thesis, research papers, and other PDF reports — stored in Supabase.

### One-time Supabase setup

1. Open your Supabase project → **SQL Editor** → New query.
2. Paste in the contents of `supabase_reports_setup.sql` (included in this repo) and run it.
   This creates:
   - A `reports` table (title, category, description, file_url, file_size, created_at)
   - A public `reports` Storage bucket for the actual PDF files
   - RLS policies so the table/bucket are readable and writable by the anon key (same pattern your blog already uses)
3. That's it — no extra env vars needed beyond the `SUPABASE_URL` / `SUPABASE_ANON_KEY` you already configured.

### Using it

- Click **+ Upload PDF** in the Reports section.
- Fill in title, category (Thesis / Research Paper / Whitepaper / Case Study / Report / Other), an optional description, and select a PDF (max 25MB).
- The file uploads to Supabase Storage, and a row is added to the `reports` table with a public URL.
- Visitors can click **View / Download** to open the PDF in a new tab.
- Edit/delete buttons work the same way as blog posts — delete also removes the underlying file from Storage.

### Security note

Both the `reports` table and the `blog_posts` table use **open write policies** keyed off the anon key — meaning anyone who has your site's anon key (which is, by design, visible in the page source) could technically insert/delete rows via the API directly, not just through your UI.

This is an acceptable tradeoff for a personal portfolio you're the only one actively using, but if you want it locked down:
- Add Supabase Auth and gate the insert/update/delete policies to `auth.uid() = 'your-user-id'` instead of `true`.
- Or keep write operations behind a serverless function with a service-role key instead of doing it client-side.

Let me know if you'd like help wiring up either approach.
