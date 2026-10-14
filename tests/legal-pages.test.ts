import { describe, it, expect } from "vitest";

import { getAppUrl, siteConfig } from "@/config/site";

describe("Legal Pages & Navigation Integrity", () => {
  it("defines public privacy and terms routes in siteConfig", () => {
    expect(siteConfig.links.privacy).toBe("/privacy");
    expect(siteConfig.links.terms).toBe("/terms");
    expect(siteConfig.links.github).toContain("github.com/ParasChavan02/MergePilot-AI");
  });

  it("resolves legal paths correctly via getAppUrl", () => {
    expect(getAppUrl("/privacy")).toBe("/privacy");
    expect(getAppUrl("/terms")).toBe("/terms");
  });
});
