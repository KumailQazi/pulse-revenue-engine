import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  bigint,
  int,
  decimal,
  json,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ── Intent Tracking ─────────────────────────────────────────────

export const intents = mysqlTable("intents", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  visitorId: varchar("visitorId", { length: 64 }),
  signalType: mysqlEnum("signalType", ["search", "click", "scroll", "exit", "purchase", "hover", "form"]).notNull(),
  category: varchar("category", { length: 100 }),
  keyword: varchar("keyword", { length: 255 }),
  pageUrl: varchar("pageUrl", { length: 500 }),
  score: int("score").default(0).notNull(),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Intent = typeof intents.$inferSelect;
export type InsertIntent = typeof intents.$inferInsert;

// ── Micro Offers ────────────────────────────────────────────────

export const microOffers = mysqlTable("microOffers", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  tier: mysqlEnum("tier", ["tripwire", "core", "profit", "max"]).notNull(),
  stackOrder: int("stackOrder").default(1).notNull(),
  conversionRate: decimal("conversionRate", { precision: 5, scale: 2 }).default("0.00"),
  isActive: int("isActive", { unsigned: true }).default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MicroOffer = typeof microOffers.$inferSelect;
export type InsertMicroOffer = typeof microOffers.$inferInsert;

// ── Conversions ─────────────────────────────────────────────────

export const conversions = mysqlTable("conversions", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  offerId: bigint("offerId", { mode: "number", unsigned: true }).notNull(),
  revenue: decimal("revenue", { precision: 10, scale: 2 }).notNull(),
  source: varchar("source", { length: 100 }),
  distributionChannel: varchar("distributionChannel", { length: 100 }),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Conversion = typeof conversions.$inferSelect;
export type InsertConversion = typeof conversions.$inferInsert;

// ── Distribution Campaigns ────────────────────────────────────

export const distributionCampaigns = mysqlTable("distributionCampaigns", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  channel: mysqlEnum("channel", ["email", "social", "seo", "ads", "affiliate", "content"]).notNull(),
  content: text("content"),
  status: mysqlEnum("status", ["draft", "scheduled", "running", "paused", "completed"]).default("draft").notNull(),
  reach: int("reach").default(0),
  clicks: int("clicks").default(0),
  conversions: int("conversions").default(0),
  revenue: decimal("revenue", { precision: 10, scale: 2 }).default("0.00"),
  scheduledAt: timestamp("scheduledAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DistributionCampaign = typeof distributionCampaigns.$inferSelect;
export type InsertDistributionCampaign = typeof distributionCampaigns.$inferInsert;

// ── Revenue Goals ───────────────────────────────────────────────

export const revenueGoals = mysqlTable("revenueGoals", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  targetAmount: decimal("targetAmount", { precision: 10, scale: 2 }).notNull(),
  currentAmount: decimal("currentAmount", { precision: 10, scale: 2 }).default("0.00").notNull(),
  milestone: varchar("milestone", { length: 50 }).notNull(),
  reachedAt: timestamp("reachedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type RevenueGoal = typeof revenueGoals.$inferSelect;
export type InsertRevenueGoal = typeof revenueGoals.$inferInsert;
