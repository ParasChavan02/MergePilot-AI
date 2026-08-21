"use server";

import { signIn, signOut } from "@/server/auth";

export async function loginWithGitHub(callbackUrl = "/dashboard") {
  await signIn("github", { redirectTo: callbackUrl });
}

export async function logout() {
  await signOut({ redirectTo: "/" });
}
