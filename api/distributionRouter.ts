import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";
import {
  findCampaignsByUser,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getCampaignStats,
  getCampaignPerformance,
} from "./queries/campaigns";

export const distributionRouter = createRouter({
  list: authedQuery.query(({ ctx }) => findCampaignsByUser(ctx.user.id)),

  create: authedQuery
    .input(
      z.object({
        name: z.string().min(1),
        channel: z.enum(["email", "social", "seo", "ads", "affiliate", "content"]),
        content: z.string().optional(),
        status: z.enum(["draft", "scheduled", "running", "paused", "completed"]).default("draft"),
        scheduledAt: z.string().datetime().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const scheduledAt = input.scheduledAt ? new Date(input.scheduledAt) : undefined;
      return createCampaign({ ...input, userId: ctx.user.id, scheduledAt });
    }),

  update: authedQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        channel: z.enum(["email", "social", "seo", "ads", "affiliate", "content"]).optional(),
        content: z.string().optional(),
        status: z.enum(["draft", "scheduled", "running", "paused", "completed"]).optional(),
        reach: z.number().min(0).optional(),
        clicks: z.number().min(0).optional(),
        conversions: z.number().min(0).optional(),
        revenue: z.string().optional(),
        scheduledAt: z.string().datetime().optional(),
      }),
    )
    .mutation(({ input }) => {
      const { id, scheduledAt, ...data } = input;
      return updateCampaign(id, { ...data, scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined });
    }),

  delete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteCampaign(input.id)),

  stats: authedQuery.query(({ ctx }) => getCampaignStats(ctx.user.id)),

  performance: authedQuery
    .input(z.object({ days: z.number().min(1).max(365).default(30) }))
    .query(({ ctx, input }) => getCampaignPerformance(ctx.user.id, input.days)),
});
