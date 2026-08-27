import { Pool } from "pg"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

const statements = [
  // Better Auth: user table (with eco-warrior game stats)
  `CREATE TABLE IF NOT EXISTS "user" (
    "id" text PRIMARY KEY,
    "name" text NOT NULL,
    "email" text NOT NULL UNIQUE,
    "emailVerified" boolean NOT NULL DEFAULT false,
    "image" text,
    "createdAt" timestamp NOT NULL DEFAULT now(),
    "updatedAt" timestamp NOT NULL DEFAULT now(),
    "xp" integer NOT NULL DEFAULT 0,
    "reputation" integer NOT NULL DEFAULT 100,
    "ecoTokens" integer NOT NULL DEFAULT 0,
    "co2Reduced" real NOT NULL DEFAULT 0,
    "wasteDiverted" real NOT NULL DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS "session" (
    "id" text PRIMARY KEY,
    "expiresAt" timestamp NOT NULL,
    "token" text NOT NULL UNIQUE,
    "createdAt" timestamp NOT NULL DEFAULT now(),
    "updatedAt" timestamp NOT NULL DEFAULT now(),
    "ipAddress" text,
    "userAgent" text,
    "userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS "account" (
    "id" text PRIMARY KEY,
    "accountId" text NOT NULL,
    "providerId" text NOT NULL,
    "userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
    "accessToken" text,
    "refreshToken" text,
    "idToken" text,
    "accessTokenExpiresAt" timestamp,
    "refreshTokenExpiresAt" timestamp,
    "scope" text,
    "password" text,
    "createdAt" timestamp NOT NULL DEFAULT now(),
    "updatedAt" timestamp NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS "verification" (
    "id" text PRIMARY KEY,
    "identifier" text NOT NULL,
    "value" text NOT NULL,
    "expiresAt" timestamp NOT NULL,
    "createdAt" timestamp DEFAULT now(),
    "updatedAt" timestamp DEFAULT now()
  )`,
  // App tables
  `CREATE TABLE IF NOT EXISTS "actions" (
    "id" serial PRIMARY KEY,
    "userId" text NOT NULL,
    "category" text NOT NULL,
    "title" text NOT NULL,
    "description" text NOT NULL,
    "quantity" real NOT NULL,
    "unit" text NOT NULL,
    "co2Reduced" real NOT NULL DEFAULT 0,
    "wasteDiverted" real NOT NULL DEFAULT 0,
    "xpReward" integer NOT NULL DEFAULT 0,
    "tokenReward" integer NOT NULL DEFAULT 0,
    "status" text NOT NULL DEFAULT 'PENDING',
    "photoUrl" text,
    "videoUrl" text,
    "youtubeUrl" text,
    "location" text,
    "likes" integer NOT NULL DEFAULT 0,
    "dislikes" integer NOT NULL DEFAULT 0,
    "reports" integer NOT NULL DEFAULT 0,
    "createdAt" timestamp NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS "votes" (
    "id" serial PRIMARY KEY,
    "actionId" integer NOT NULL,
    "userId" text NOT NULL,
    "type" text NOT NULL,
    "createdAt" timestamp NOT NULL DEFAULT now(),
    CONSTRAINT "votes_action_user_unique" UNIQUE ("actionId", "userId")
  )`,
  `CREATE TABLE IF NOT EXISTS "rewards" (
    "id" serial PRIMARY KEY,
    "name" text NOT NULL,
    "sponsor" text NOT NULL,
    "description" text NOT NULL,
    "cost" integer NOT NULL,
    "stock" integer NOT NULL,
    "initialStock" integer NOT NULL,
    "image" text,
    "expiresAt" timestamp
  )`,
  `CREATE TABLE IF NOT EXISTS "reward_claims" (
    "id" serial PRIMARY KEY,
    "rewardId" integer NOT NULL,
    "userId" text NOT NULL,
    "tokenCost" integer NOT NULL,
    "createdAt" timestamp NOT NULL DEFAULT now(),
    CONSTRAINT "reward_claims_reward_user_unique" UNIQUE ("rewardId", "userId")
  )`,
]

const seedRewards = `INSERT INTO "rewards" ("name","sponsor","description","cost","stock","initialStock","image")
  SELECT * FROM (VALUES
    ('Reusable Bottle Kit','GreenLife Co.','Insulated steel bottle + cleaning kit made from recycled materials.',120,50,50,NULL),
    ('Tree Planting Certificate','ReForest Now','We plant 10 trees in your name in a reforestation project.',200,100,100,NULL),
    ('Solar Power Bank','SunCharge','10,000mAh solar-powered charger for your devices.',350,25,25,NULL),
    ('Zero-Waste Grocery Voucher','EcoMart','$25 voucher for package-free grocery shopping.',180,40,40,NULL),
    ('Bamboo Utensil Set','PurePlanet','Portable bamboo cutlery set to cut single-use plastics.',90,80,80,NULL)
  ) AS v
  WHERE NOT EXISTS (SELECT 1 FROM "rewards")`

async function main() {
  for (const sql of statements) {
    await pool.query(sql)
    console.log("[v0] executed:", sql.split("\n")[0])
  }
  await pool.query(seedRewards)
  console.log("[v0] seeded rewards (if empty)")
  await pool.end()
  console.log("[v0] done")
}

main().catch((e) => {
  console.error("[v0] setup failed:", e)
  process.exit(1)
})
