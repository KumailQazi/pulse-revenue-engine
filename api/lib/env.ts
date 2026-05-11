import "dotenv/config";

function getEnv(name: string, defaultValue: string = ""): string {
  const value = process.env[name];
  return value ?? defaultValue;
}

export const env = {
  appId: getEnv("APP_ID", "pulse-demo-id"),
  appSecret: getEnv("APP_SECRET", "pulse-demo-secret"),
  isProduction: process.env.NODE_ENV === "production",
  databaseUrl: getEnv("DATABASE_URL", ""),
  oauthServerUrl: getEnv("OAUTH_SERVER_URL", ""),
  oauthApiUrl: getEnv("OAUTH_API_URL", ""),
  ownerUnionId: getEnv("OWNER_UNION_ID", "admin"),
  isDemoMode: !process.env.APP_ID || !process.env.DATABASE_URL,
};
