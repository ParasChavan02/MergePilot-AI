import { describe, it, expect } from "vitest";

import {
  getDashboardStats,
  getUserAnalysesList,
  getUserReleaseNotesList
} from "@/server/services/analysis-storage";

describe("Database Storage Integration", () => {
  it("queries dashboard stats without error", async () => {
    const stats = await getDashboardStats();
    expect(stats).toBeDefined();
    expect(typeof stats.repositoriesCount).toBe("number");
    expect(typeof stats.openPrsCount).toBe("number");
    expect(typeof stats.analyzedPrsCount).toBe("number");
    expect(typeof stats.highRiskCount).toBe("number");
  });

  it("queries user analyses list without error", async () => {
    const list = await getUserAnalysesList(10);
    expect(Array.isArray(list)).toBe(true);
  });

  it("queries user release notes list without error", async () => {
    const notes = await getUserReleaseNotesList(10);
    expect(Array.isArray(notes)).toBe(true);
  });
});
