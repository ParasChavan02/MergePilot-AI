import Link from "next/link";

import { GitHubLoginButton } from "@/components/auth/github-login-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { siteConfig } from "@/config/site";

type LoginPageProps = {
  searchParams: Promise<{
    callbackUrl?: string;
  }>;
};

export default async function LoginPage({
  searchParams
}: Readonly<LoginPageProps>) {
  const { callbackUrl } = await searchParams;
  const redirectUrl = callbackUrl ?? "/dashboard";

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <Card className="w-full max-w-md border-border/60 bg-card/95 shadow-soft backdrop-blur">
        <CardHeader className="space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
            Authentication
          </p>

          <CardTitle className="text-2xl">
            {siteConfig.name}
          </CardTitle>

          <CardDescription>
            {siteConfig.tagline}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <GitHubLoginButton callbackUrl={redirectUrl} />

          <p className="text-center text-sm text-muted-foreground">
            By continuing, you agree to our future terms and privacy policy.
          </p>

          <div className="text-center">
            <Link
              href="/"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Return to home
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}