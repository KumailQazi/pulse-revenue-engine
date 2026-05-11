import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { User } from "@db/schema";
import { authenticateRequest } from "./oauth/auth";
import { env } from "./lib/env";

export type TrpcContext = {
  req: Request;
  resHeaders: Headers;
  user?: User;
};

export async function createContext(
  opts: FetchCreateContextFnOptions,
): Promise<TrpcContext> {
  const ctx: TrpcContext = { req: opts.req, resHeaders: opts.resHeaders };
  try {
    ctx.user = await authenticateRequest(opts.req.headers);
  } catch {
    // In Demo Mode, if auth fails, we provide a mock user
    if (env.isDemoMode) {
      ctx.user = {
        id: 0,
        unionId: "demo-user",
        name: "Demo Operator",
        email: "demo@pulse.engine",
        avatar: "",
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignInAt: new Date(),
      };
    }
  }
  return ctx;
}
