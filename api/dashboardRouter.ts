import { createRouter, authedQuery } from "./middleware";
import { getTotalRevenue } from "./queries/conversions";
import { getCampaignStats } from "./queries/campaigns";
import { getIntentSummary, getTopKeywords } from "./queries/intents";
import { getOfferStats } from "./queries/offers";

export const dashboardRouter = createRouter({
  overview: authedQuery.query(async ({ ctx }) => {
    const userId = ctx.user.id;
    const [totalRevenue, campaignStats, intentSummary, topKeywords, offerStats] = await Promise.all([
      getTotalRevenue(userId),
      getCampaignStats(userId),
      getIntentSummary(userId),
      getTopKeywords(userId, 5),
      getOfferStats(userId),
    ]);

    const totalReach = campaignStats.reduce((sum, c) => sum + (c.totalReach ?? 0), 0);
    const totalClicks = campaignStats.reduce((sum, c) => sum + (c.totalClicks ?? 0), 0);
    const totalCampaignRevenue = campaignStats.reduce(
      (sum, c) => sum + Number(c.totalRevenue ?? 0),
      0
    );
    const ctr = totalReach > 0 ? (totalClicks / totalReach) * 100 : 0;

    return {
      totalRevenue,
      totalReach,
      totalClicks,
      totalCampaignRevenue,
      ctr: Number(ctr.toFixed(2)),
      campaignStats,
      intentSummary,
      topKeywords,
      offerStats,
    };
  }),

  funnel: authedQuery.query(async ({ ctx }) => {
    const userId = ctx.user.id;
    const [campaignStats, totalRevenue, intentSummary] = await Promise.all([
      getCampaignStats(userId),
      getTotalRevenue(userId),
      getIntentSummary(userId),
    ]);

    const reach = campaignStats.reduce((s, c) => s + (c.totalReach ?? 0), 0);
    const clicks = campaignStats.reduce((s, c) => s + (c.totalClicks ?? 0), 0);
    const conv = campaignStats.reduce((s, c) => s + (c.totalConversions ?? 0), 0);

    return {
      reach,
      clicks,
      conversions: conv,
      revenue: totalRevenue,
      clickRate: reach > 0 ? Number(((clicks / reach) * 100).toFixed(2)) : 0,
      convRate: clicks > 0 ? Number(((conv / clicks) * 100).toFixed(2)) : 0,
      intentSignals: intentSummary.reduce((s, i) => s + (i.count ?? 0), 0),
    };
  }),

  milestones: authedQuery.query(async ({ ctx }) => {
    const userId = ctx.user.id;
    const totalRevenue = await getTotalRevenue(userId);

    const milestones = [
      { label: "First $1K", target: 1000, reached: totalRevenue >= 1000 },
      { label: "$2.5K", target: 2500, reached: totalRevenue >= 2500 },
      { label: "$5K", target: 5000, reached: totalRevenue >= 5000 },
      { label: "$8.4K", target: 8400, reached: totalRevenue >= 8400 },
      { label: "$10K", target: 10000, reached: totalRevenue >= 10000 },
    ];

    const nextMilestone = milestones.find((m) => !m.reached);
    const progress = nextMilestone
      ? Math.min(100, Number(((totalRevenue / nextMilestone.target) * 100).toFixed(1)))
      : 100;

    return {
      totalRevenue,
      milestones,
      nextMilestone: nextMilestone?.label ?? null,
      progress,
    };
  }),
});
