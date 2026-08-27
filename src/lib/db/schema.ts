import { pgTable, text, timestamp, boolean, integer, real, serial, unique } from "drizzle-orm/pg-core";

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.
// Game-profile fields (xp, reputation, ecoTokens, co2Reduced, wasteDiverted)
// are added as additional columns on the user table via Better Auth's
// `user.additionalFields` config in lib/auth.ts — they must exist here too.

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  // Eco-Warrior profile / game stats
  xp: integer("xp").notNull().default(0),
  reputation: integer("reputation").notNull().default(100),
  ecoTokens: integer("ecoTokens").notNull().default(0),
  co2Reduced: real("co2Reduced").notNull().default(0),
  wasteDiverted: real("wasteDiverted").notNull().default(0),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// --- App tables --------------------------------------------------------------
// Plain `userId` columns (no FK) are used for scoping per Neon/Drizzle stack
// conventions — the security model is the explicit `eq(table.userId, userId)`
// filter in every query, not a foreign key constraint.

export const actions = pgTable("actions", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  category: text("category").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  quantity: real("quantity").notNull(),
  unit: text("unit").notNull(),
  co2Reduced: real("co2Reduced").notNull().default(0),
  wasteDiverted: real("wasteDiverted").notNull().default(0),
  xpReward: integer("xpReward").notNull().default(0),
  tokenReward: integer("tokenReward").notNull().default(0),
  status: text("status").notNull().default("PENDING"), // PENDING | VERIFIED | INVALID
  // Evidence: a photo is optional, but a video (uploaded file OR a YouTube
  // link) is required for every logged action.
  photoUrl: text("photoUrl"),
  videoUrl: text("videoUrl"),
  youtubeUrl: text("youtubeUrl"),
  location: text("location"),
  likes: integer("likes").notNull().default(0),
  dislikes: integer("dislikes").notNull().default(0),
  reports: integer("reports").notNull().default(0),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const votes = pgTable(
  "votes",
  {
    id: serial("id").primaryKey(),
    actionId: integer("actionId").notNull(),
    userId: text("userId").notNull(),
    type: text("type").notNull(), // LIKE | DISLIKE | REPORT
    createdAt: timestamp("createdAt").notNull().defaultNow(),
  },
  (t) => [unique("votes_action_user_unique").on(t.actionId, t.userId)],
);

export const rewards = pgTable("rewards", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  sponsor: text("sponsor").notNull(),
  description: text("description").notNull(),
  cost: integer("cost").notNull(),
  stock: integer("stock").notNull(),
  initialStock: integer("initialStock").notNull(),
  image: text("image"),
  expiresAt: timestamp("expiresAt"),
});

export const rewardClaims = pgTable(
  "reward_claims",
  {
    id: serial("id").primaryKey(),
    rewardId: integer("rewardId").notNull(),
    userId: text("userId").notNull(),
    tokenCost: integer("tokenCost").notNull(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
  },
  (t) => [unique("reward_claims_reward_user_unique").on(t.rewardId, t.userId)],
);
