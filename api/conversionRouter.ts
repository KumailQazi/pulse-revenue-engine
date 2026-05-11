import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";
import {
  findConversionsByUser,
  findConversionsByUserAndDate,
  createConversion,
  getRevenueByPeriod,
  getRevenueBySource,
  getTotalRevenue,
  getTopConvertingOffers,
} from "./queries/conversions";

export const conversionRouter = createRouter({
  list: authedQuery.query(({ ctx }) => findConversionsByUser(ctx.user.id)),

  listByDate: authedQuery
    .input(z.object({ days: z.number().min(1).max(365).default(30) }))
    .query(({ ctx, input }) => findConversionsByUserAndDate(ctx.user.id, input.days)),

  create: authedQuery
    .input(
      z.object({
        offerId: z.number(),
        revenue: z.string().regex(/^\d+(\.\d{1,2})?$/),
        source: z.string().optional(),
        distributionChannel: z.string().optional(),
        metadata: z.record(z.string(), z.unknown()).optional(),
      }),
    )
    .mutation(({ ctx, input }) => createConversion({ ...input, userId: ctx.user.id })),

  revenueByPeriod: authedQuery
    .input(z.object({ days: z.number().min(1).max(365).default(30) }))
    .query(({ ctx, input }) => getRevenueByPeriod(ctx.user.id, input.days)),

  revenueBySource: authedQuery.query(({ ctx }) => getRevenueBySource(ctx.user.id)),

  totalRevenue: authedQuery.query(({ ctx }) => getTotalRevenue(ctx.user.id)),

  topOffers: authedQuery
    .input(z.object({ limit: z.number().min(1).max(20) }))
    .query(({ ctx, input }) => getTopConvertingOffers(ctx.user.id, input.limit)),
});
