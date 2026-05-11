import { getDb } from "./connection";
import { distributionCampaigns } from "@db/schema";
import { eq, desc, sql, and, gte } from "drizzle-orm";

export async function findCampaignsByUser(userId: number) {
  return getDb().query.distributionCampaigns.findMany({
    where: eq(distributionCampaigns.userId, userId),
    orderBy: desc(distributionCampaigns.createdAt),
  });
}

export async function createCampaign(data: {
  userId: number;
  name: string;
  channel: "email" | "social" | "seo" | "ads" | "affiliate" | "content";
  content?: string;
  status?: "draft" | "scheduled" | "running" | "paused" | "completed";
  scheduledAt?: Date;
}) {
  const [{ id }] = await getDb().insert(distributionCampaigns).values(data).$returningId();
  return getDb().query.distributionCampaigns.findFirst({
    where: eq(distributionCampaigns.id, id),
  });
}

export async function updateCampaign(
  id: number,
  data: Partial<{
    name: string;
    channel: "email" | "social" | "seo" | "ads" | "affiliate" | "content";
    content: string;
    status: "draft" | "scheduled" | "running" | "paused" | "completed";
    reach: number;
    clicks: number;
    conversions: number;
    revenue: string;
    scheduledAt: Date;
  }>
) {
  await getDb().update(distributionCampaigns).set(data).where(eq(distributionCampaigns.id, id));
  return getDb().query.distributionCampaigns.findFirst({
    where: eq(distributionCampaigns.id, id),
  });
}

export async function deleteCampaign(id: number) {
  await getDb().delete(distributionCampaigns).where(eq(distributionCampaigns.id, id));
}

export async function getCampaignStats(userId: number) {
  const db = getDb();
  return db
    .select({
      channel: distributionCampaigns.channel,
      totalCampaigns: sql<number>`count(*)`,
      totalReach: sql<number>`sum(${distributionCampaigns.reach})`,
      totalClicks: sql<number>`sum(${distributionCampaigns.clicks})`,
      totalConversions: sql<number>`sum(${distributionCampaigns.conversions})`,
      totalRevenue: sql<number>`sum(${distributionCampaigns.revenue})`,
    })
    .from(distributionCampaigns)
    .where(eq(distributionCampaigns.userId, userId))
    .groupBy(distributionCampaigns.channel);
}

export async function getCampaignPerformance(userId: number, days: number) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const db = getDb();
  return db
    .select({
      date: sql<string>`date(${distributionCampaigns.createdAt})`,
      reach: sql<number>`sum(${distributionCampaigns.reach})`,
      clicks: sql<number>`sum(${distributionCampaigns.clicks})`,
      conversions: sql<number>`sum(${distributionCampaigns.conversions})`,
      revenue: sql<number>`sum(${distributionCampaigns.revenue})`,
    })
    .from(distributionCampaigns)
    .where(and(eq(distributionCampaigns.userId, userId), gte(distributionCampaigns.createdAt, since)))
    .groupBy(sql`date(${distributionCampaigns.createdAt})`)
    .orderBy(sql`date(${distributionCampaigns.createdAt})`);
}
