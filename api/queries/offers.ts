import { getDb } from "./connection";
import { microOffers } from "@db/schema";
import { eq, desc, sql, and } from "drizzle-orm";

export async function findOffersByUser(userId: number) {
  return getDb().query.microOffers.findMany({
    where: eq(microOffers.userId, userId),
    orderBy: [microOffers.stackOrder, desc(microOffers.createdAt)],
  });
}

export async function findActiveOffersByUser(userId: number) {
  return getDb()
    .select()
    .from(microOffers)
    .where(and(eq(microOffers.userId, userId), eq(microOffers.isActive, 1)))
    .orderBy(microOffers.stackOrder);
}

export async function createOffer(data: {
  userId: number;
  name: string;
  price: string;
  description?: string;
  tier: "tripwire" | "core" | "profit" | "max";
  stackOrder: number;
}) {
  const [{ id }] = await getDb().insert(microOffers).values(data).$returningId();
  return getDb().query.microOffers.findFirst({ where: eq(microOffers.id, id) });
}

export async function updateOffer(
  id: number,
  data: Partial<{
    name: string;
    price: string;
    description: string;
    tier: "tripwire" | "core" | "profit" | "max";
    stackOrder: number;
    isActive: number;
    conversionRate: string;
  }>
) {
  await getDb().update(microOffers).set(data).where(eq(microOffers.id, id));
  return getDb().query.microOffers.findFirst({ where: eq(microOffers.id, id) });
}

export async function deleteOffer(id: number) {
  await getDb().delete(microOffers).where(eq(microOffers.id, id));
}

export async function getOfferStats(userId: number) {
  const db = getDb();
  return db
    .select({
      tier: microOffers.tier,
      totalOffers: sql<number>`count(*)`,
      avgPrice: sql<number>`avg(${microOffers.price})`,
    })
    .from(microOffers)
    .where(eq(microOffers.userId, userId))
    .groupBy(microOffers.tier);
}
