# ECO-WARRIOR: ZERO WASTE CLIMATE WAR

Production-ready Next.js + TypeScript climate-impact game prototype designed for Vercel.

## Features
- Responsive Climate Scientist × Eco Warrior × Balinese Futurism UI
- Demo Mode with live dashboard, feed, leaderboard and limited rewards
- Action Logger with server-side impact calculation
- Community validation API (like/dislike/report)
- PostgreSQL + Prisma schema for production persistence
- Transaction-safe reward claim logic
- Sponsor and impact analytics UI
- Critical Stock Alert for 1–2 remaining units
- Accessibility-friendly semantic controls and reduced-motion-compatible CSS foundation

## Local
Requires Node 20+ for this project. Install dependencies with `npm ci`, then `npm run dev`.

Demo mode works without a database:

```env
NEXT_PUBLIC_DEMO_MODE=true
```

## Production database
Set `DATABASE_URL` to a PostgreSQL connection string. Then:

```bash
npx prisma db push
npm run db:seed
npm run build
npm start
```

The Prisma schema is intentionally portable to PostgreSQL providers such as Supabase, Neon and Prisma Postgres. Prisma's current Vercel guidance recommends connection pooling for serverless workloads and documents Prisma Postgres as a managed option with pooling. See the official docs linked below.

## Vercel
1. Push this folder to GitHub.
2. Import the repository into Vercel.
3. Add `DATABASE_URL` for production if using persistence.
4. Add `NEXT_PUBLIC_SITE_URL=https://putuprofile.me`.
5. Keep `NEXT_PUBLIC_DEMO_MODE=true` if you want a no-database demo; set it to false for production persistence.
6. Deploy.
7. In Vercel, configure `putuprofile.me` under Domains and follow the DNS records Vercel provides.

## Environment variables
Copy `.env.example` to `.env.local`.

## Emission factors
Edit `src/lib/impact.ts`. The engine is intentionally modular so verified project-specific emission factors can later be moved into the database with versioning, source metadata and region/unit normalization.

## Architecture
UI → API routes → business logic → Prisma/PostgreSQL. Demo mode short-circuits database writes so the application remains playable without external services.

## Important production hardening
Before launching real monetary/sponsor rewards, add verified identity, evidence storage (e.g. object storage), moderation workflows, rate limiting, audit logs, fraud scoring, sponsor KYC/compliance and legally reviewed reward terms. Estimated CO2 values are not a substitute for an independently verified carbon accounting methodology.

## Official deployment references
- https://vercel.com/docs
- https://docs.prisma.io/docs/orm/prisma-client/deployment/serverless/deploy-to-vercel
- https://www.prisma.io/docs/guides/postgres/vercel
