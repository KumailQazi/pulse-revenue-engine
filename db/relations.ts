import { relations } from "drizzle-orm";
import { users, intents, microOffers, conversions, distributionCampaigns, revenueGoals } from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
  intents: many(intents),
  microOffers: many(microOffers),
  conversions: many(conversions),
  campaigns: many(distributionCampaigns),
  revenueGoals: many(revenueGoals),
}));

export const intentsRelations = relations(intents, ({ one }) => ({
  user: one(users, { fields: [intents.userId], references: [users.id] }),
}));

export const microOffersRelations = relations(microOffers, ({ one, many }) => ({
  user: one(users, { fields: [microOffers.userId], references: [users.id] }),
  conversions: many(conversions),
}));

export const conversionsRelations = relations(conversions, ({ one }) => ({
  user: one(users, { fields: [conversions.userId], references: [users.id] }),
  offer: one(microOffers, { fields: [conversions.offerId], references: [microOffers.id] }),
}));

export const distributionCampaignsRelations = relations(distributionCampaigns, ({ one }) => ({
  user: one(users, { fields: [distributionCampaigns.userId], references: [users.id] }),
}));

export const revenueGoalsRelations = relations(revenueGoals, ({ one }) => ({
  user: one(users, { fields: [revenueGoals.userId], references: [users.id] }),
}));
