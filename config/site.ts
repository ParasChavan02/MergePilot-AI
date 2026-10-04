export const siteConfig = {
  name: "MergePilot AI",
  tagline: "Understand Pull Requests before you merge them.",
  description:
    "AI-powered pull request intelligence for teams that want faster context, lower risk, and cleaner releases.",
  links: {
    github: "https://github.com/",
    docs: "/#how-it-works"
  }
} as const;

export function getAppUrl(path: string = "/login"): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return baseUrl ? `${baseUrl.replace(/\/$/, "")}${cleanPath}` : cleanPath;
}
