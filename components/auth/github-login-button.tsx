"use client";

import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";

type GitHubLoginButtonProps = {
  callbackUrl?: string;
};

export function GitHubLoginButton({
  callbackUrl = "/dashboard"
}: GitHubLoginButtonProps) {
  return (
    <Button
      type="button"
      className="w-full"
      onClick={() => {
        signIn("github", {
          callbackUrl
        });
      }}
    >
      Continue with GitHub
    </Button>
  );
}