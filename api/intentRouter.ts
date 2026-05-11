import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";
import {
  findIntentsByUser,
  findIntentsByUserAndDate,
  createIntent,
  getIntentSummary,
  getTopKeywords,
  getIntentHeatmap,
} from "./queries/intents";

export const intentRouter = createRouter({
  list: authedQuery.query(({ ctx }) => findIntentsByUser(ctx.user.id)),

  listByDate: authedQuery
    .input(z.object({ days: z.number().min(1).max(365).default(30) }))
    .query(({ ctx, input }) => findIntentsByUserAndDate(ctx.user.id, input.days)),

  create: authedQuery
    .input(
      z.object({
        visitorId: z.string().optional(),
        signalType: z.enum(["search", "click", "scroll", "exit", "purchase", "hover", "form"]),
        category: z.string().optional(),
        keyword: z.string().optional(),
        pageUrl: z.string().optional(),
        score: z.number().min(0).max(100).default(10),
        metadata: z.record(z.string(), z.unknown()).optional(),
      }),
    )
    .mutation(({ ctx, input }) =>
      createIntent({ ...input, userId: ctx.user.id }),
    ),

  summary: authedQuery.query(({ ctx }) => getIntentSummary(ctx.user.id)),

  topKeywords: authedQuery
    .input(z.object({ limit: z.number().min(1).max(50) }))
    .query(({ ctx, input }) => getTopKeywords(ctx.user.id, input.limit)),

  heatmap: authedQuery.query(({ ctx }) => getIntentHeatmap(ctx.user.id)),
});
