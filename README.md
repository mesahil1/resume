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
