# Live Habit Tracker

A minimal, production-minded habit tracker built **live on stream** as a coding tutorial.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind 4 · Prisma · Postgres · NextAuth · Vercel

## What it does

- Sign up / sign in with email + password
- Create, edit, delete habits (daily / weekly cadence)
- Mark habits done for today, progress persists
- Deployed as a Vercel preview on every PR

## Local dev

```bash
npm install
cp .env.example .env        # fill in DATABASE_URL + NEXTAUTH_SECRET
npx prisma migrate dev
npm run dev
```

Open http://localhost:3000.

## Scripts

| Command         | What                               |
| --------------- | ---------------------------------- |
| `npm run dev`   | Start Next.js dev server           |
| `npm run build` | Production build                   |
| `npm run lint`  | ESLint                             |

## Deploy

Pushes to `main` auto-deploy to Vercel. Postgres is provisioned as a Vercel Postgres addon — `DATABASE_URL` and `NEXTAUTH_SECRET` live in Vercel project env.

## Built with

- Rigby (Personal Assistant) — project management, script, checkpoints
- Claude Code — scaffold + commits + deploy wiring

---

Live-coded in one session. Watch the build: (video link TBD)
