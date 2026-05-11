import { getDb } from "./connection";
import { intents } from "@db/schema";
import { eq, desc, sql, and, gte } from "drizzle-orm";

export async function findIntentsByUser(userId: number) {
  return getDb().query.intents.findMany({
    where: eq(intents.userId, userId),
    orderBy: desc(intents.createdAt),
  });
}

export async function findIntentsByUserAndDate(userId: number, days: number) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return getDb()
    .select()
    .from(intents)
    .where(and(eq(intents.userId, userId), gte(intents.createdAt, since)))
    .orderBy(desc(intents.createdAt));
}

export async function createIntent(data: {
  userId: number;
  visitorId?: string;
  signalType: "search" | "click" | "scroll" | "exit" | "purchase" | "hover" | "form";
  category?: string;
  keyword?: string;
  pageUrl?: string;
  score: number;
  metadata?: Record<string, unknown>;
}) {
  const [{ id }] = await getDb().insert(intents).values(data).$returningId();
  return getDb().query.intents.findFirst({ where: eq(intents.id, id) });
}

export async function getIntentSummary(userId: number) {
  const db = getDb();
  const result = await db
    .select({
      signalType: intents.signalType,
      count: sql<number>`count(*)`,
      avgScore: sql<number>`avg(${intents.score})`,
    })
    .from(intents)
    .where(eq(intents.userId, userId))
    .groupBy(intents.signalType);
  return result;
}

export async function getTopKeywords(userId: number, limit = 10) {
  const db = getDb();
  return db
    .select({
      keyword: intents.keyword,
      count: sql<number>`count(*)`,
    })
    .from(intents)
    .where(and(eq(intents.userId, userId), sql`${intents.keyword} is not null`))
    .groupBy(intents.keyword)
    .orderBy(desc(sql`count(*)`))
    .limit(limit);
}

export async function getIntentHeatmap(userId: number) {
  const db = getDb();
  return db
    .select({
      category: intents.category,
      count: sql<number>`count(*)`,
      totalScore: sql<number>`sum(${intents.score})`,
    })
    .from(intents)
    .where(eq(intents.userId, userId))
    .groupBy(intents.category)
    .orderBy(desc(sql`count(*)`));
}
