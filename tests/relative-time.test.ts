import { describe, expect, it } from "vitest";

import { formatRelativeTime } from "@/lib/utils";

describe("Relative Time Formatting Utility", () => {
  it("formats recent timestamps properly", () => {
    const now = new Date();
    expect(formatRelativeTime(now)).toBe("just now");

    const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000);
    expect(formatRelativeTime(tenMinsAgo)).toBe("10m ago");

    const threeHoursAgo = new Date(Date.now() - 3 * 3600 * 1000);
    expect(formatRelativeTime(threeHoursAgo)).toBe("3h ago");

    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 3600 * 1000);
    expect(formatRelativeTime(twoDaysAgo)).toBe("2d ago");

    expect(formatRelativeTime(null)).toBe("recently");
    expect(formatRelativeTime(undefined)).toBe("recently");
  });
});
