import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";
import {
  findOffersByUser,
  findActiveOffersByUser,
  createOffer,
  updateOffer,
  deleteOffer,
  getOfferStats,
} from "./queries/offers";

export const offerRouter = createRouter({
  list: authedQuery.query(({ ctx }) => findOffersByUser(ctx.user.id)),

  listActive: authedQuery.query(({ ctx }) => findActiveOffersByUser(ctx.user.id)),

  create: authedQuery
    .input(
      z.object({
        name: z.string().min(1),
        price: z.string().regex(/^\d+(\.\d{1,2})?$/),
        description: z.string().optional(),
        tier: z.enum(["tripwire", "core", "profit", "max"]),
        stackOrder: z.number().min(1).default(1),
      }),
    )
    .mutation(({ ctx, input }) => createOffer({ ...input, userId: ctx.user.id })),

  update: authedQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        price: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
        description: z.string().optional(),
        tier: z.enum(["tripwire", "core", "profit", "max"]).optional(),
        stackOrder: z.number().min(1).optional(),
        isActive: z.number().min(0).max(1).optional(),
        conversionRate: z.string().optional(),
      }),
    )
    .mutation(({ input }) => {
      const { id, ...data } = input;
      return updateOffer(id, data);
    }),

  delete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteOffer(input.id)),

  stats: authedQuery.query(({ ctx }) => getOfferStats(ctx.user.id)),
});
