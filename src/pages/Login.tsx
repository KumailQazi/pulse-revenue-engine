import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

function getOAuthUrl() {
  const oauthServerUrl = import.meta.env.VITE_OAUTH_SERVER_URL;
  const appID = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${oauthServerUrl}/api/oauth/authorize`);
  url.searchParams.set("client_id", appID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "profile");
  url.searchParams.set("state", state);

  return url.toString();
}

export default function Login() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Card className="w-full max-w-sm bg-zinc-950 border-zinc-800">
        <CardHeader className="text-center">
          <CardTitle className="text-zinc-100">Welcome to Pulse</CardTitle>
          <p className="text-sm text-zinc-500 mt-1">Sign in to access your revenue engine</p>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-semibold"
            size="lg"
            onClick={() => {
              window.location.href = getOAuthUrl();
            }}
          >
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
