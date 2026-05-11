import { getDb } from "./connection";
import { conversions, microOffers } from "@db/schema";
import { eq, desc, sql, and, gte } from "drizzle-orm";

export async function findConversionsByUser(userId: number) {
  return getDb().query.conversions.findMany({
    where: eq(conversions.userId, userId),
    with: { offer: true },
    orderBy: desc(conversions.createdAt),
  });
}

export async function findConversionsByUserAndDate(userId: number, days: number) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return getDb()
    .select()
    .from(conversions)
    .where(and(eq(conversions.userId, userId), gte(conversions.createdAt, since)))
    .orderBy(desc(conversions.createdAt));
}

export async function createConversion(data: {
  userId: number;
  offerId: number;
  revenue: string;
  source?: string;
  distributionChannel?: string;
  metadata?: Record<string, unknown>;
}) {
  const [{ id }] = await getDb().insert(conversions).values(data).$returningId();
  return getDb().query.conversions.findFirst({
    where: eq(conversions.id, id),
    with: { offer: true },
  });
}

export async function getRevenueByPeriod(userId: number, days: number) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const db = getDb();
  return db
    .select({
      date: sql<string>`date(${conversions.createdAt})`,
      revenue: sql<number>`sum(${conversions.revenue})`,
      count: sql<number>`count(*)`,
    })
    .from(conversions)
    .where(and(eq(conversions.userId, userId), gte(conversions.createdAt, since)))
    .groupBy(sql`date(${conversions.createdAt})`)
    .orderBy(sql`date(${conversions.createdAt})`);
}

export async function getRevenueBySource(userId: number) {
  const db = getDb();
  return db
    .select({
      source: conversions.source,
      revenue: sql<number>`sum(${conversions.revenue})`,
      count: sql<number>`count(*)`,
    })
    .from(conversions)
    .where(eq(conversions.userId, userId))
    .groupBy(conversions.source)
    .orderBy(desc(sql`sum(${conversions.revenue})`));
}

export async function getTotalRevenue(userId: number) {
  const db = getDb();
  const [result] = await db
    .select({ total: sql<number>`coalesce(sum(${conversions.revenue}), 0)` })
    .from(conversions)
    .where(eq(conversions.userId, userId));
  return result?.total ?? 0;
}

export async function getTopConvertingOffers(userId: number, limit = 5) {
  const db = getDb();
  return db
    .select({
      offerId: conversions.offerId,
      offerName: microOffers.name,
      revenue: sql<number>`sum(${conversions.revenue})`,
      count: sql<number>`count(*)`,
    })
    .from(conversions)
    .innerJoin(microOffers, eq(conversions.offerId, microOffers.id))
    .where(eq(conversions.userId, userId))
    .groupBy(conversions.offerId, microOffers.name)
    .orderBy(desc(sql`sum(${conversions.revenue})`))
    .limit(limit);
}
