#!/usr/bin/env node
// build.js — Injects env vars from .env into index.template.html → dist/index.html
// Run: node build.js
// Used by: npm run build, Netlify/Vercel build command

const fs = require('fs');
const path = require('path');

// Load .env file if present (local dev); in CI/CD these come from platform env
const envFile = path.join(__dirname, '.env');
if (fs.existsSync(envFile)) {
  const lines = fs.readFileSync(envFile, 'utf8').split('\n');
  for (const line of lines) {
    const [key, ...rest] = line.split('=');
    const val = rest.join('=').trim().replace(/^['"]|['"]$/g, '');
    if (key && key.trim() && !key.startsWith('#')) {
      process.env[key.trim()] = val;
    }
  }
}

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    '⚠  SUPABASE_URL or SUPABASE_ANON_KEY not set — ' +
    'the site will build but fall back to localStorage.'
  );
}

const template = fs.readFileSync(
  path.join(__dirname, 'index.template.html'),
  'utf8'
);

const output = template
  .replace("'YOUR_SUPABASE_URL'", JSON.stringify(SUPABASE_URL))
  .replace("'YOUR_SUPABASE_ANON_KEY'", JSON.stringify(SUPABASE_ANON_KEY));

const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir);

fs.writeFileSync(path.join(distDir, 'index.html'), output);
console.log('✅  Built → dist/index.html');
if (SUPABASE_URL) console.log('✅  Supabase URL injected');
