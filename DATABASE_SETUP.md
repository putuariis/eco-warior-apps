# Database Setup

1. Create a PostgreSQL database.
2. Set `DATABASE_URL`.
3. Run `npx prisma db push` for a first deployment, or use migrations for controlled production schema changes.
4. Run `npm run db:seed` to create demo users, rewards and actions.

For Vercel serverless deployments, use a pooled PostgreSQL connection. Prisma Postgres includes built-in connection pooling. Keep production and preview databases separate when applying schema migrations.
