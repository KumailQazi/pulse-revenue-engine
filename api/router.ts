import { authRouter } from "./auth-router";
import { intentRouter } from "./intentRouter";
import { offerRouter } from "./offerRouter";
import { conversionRouter } from "./conversionRouter";
import { distributionRouter } from "./distributionRouter";
import { dashboardRouter } from "./dashboardRouter";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  intent: intentRouter,
  offer: offerRouter,
  conversion: conversionRouter,
  distribution: distributionRouter,
  dashboard: dashboardRouter,
});

export type AppRouter = typeof appRouter;
