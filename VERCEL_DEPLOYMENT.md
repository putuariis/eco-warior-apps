# Vercel Deployment

## GitHub
```bash
git init
git add .
git commit -m "Initial ECO-WARRIOR game"
git branch -M main
git remote add origin YOUR_REPOSITORY_URL
git push -u origin main
```

## Vercel
Import the GitHub repository. The project uses `npm run build`.

Environment variables:
- `NEXT_PUBLIC_SITE_URL=https://putuprofile.me`
- `NEXT_PUBLIC_DEMO_MODE=false` for persistent production
- `DATABASE_URL=...`

For database-backed deployment, run schema migrations/updates as part of your release process. Prisma's Vercel documentation shows `prisma generate` and `prisma migrate deploy` as a production build pattern.

## Domain
Add `putuprofile.me` in Vercel → Project → Settings → Domains. Follow Vercel's displayed DNS instructions at your domain provider.
