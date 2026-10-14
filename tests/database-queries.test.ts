import { sql } from "drizzle-orm";
import { describe, it, expect, beforeAll } from "vitest";

import { db } from "@/server/db";
import {
  getDashboardStats,
  getUserAnalysesList,
  getUserReleaseNotesList
} from "@/server/services/analysis-storage";

describe("Database Storage Integration", () => {
  let dbAvailable = false;

  beforeAll(async () => {
    try {
      await db.execute(sql`SELECT 1`);
      dbAvailable = true;
    } catch {
      dbAvailable = false;
      console.warn("PostgreSQL not reachable locally. Skipping database integration tests.");
    }
  });

  it("queries dashboard stats without error", async (ctx) => {
    if (!dbAvailable) return ctx.skip();
    const stats = await getDashboardStats();
    expect(stats).toBeDefined();
    expect(typeof stats.repositoriesCount).toBe("number");
    expect(typeof stats.openPrsCount).toBe("number");
    expect(typeof stats.analyzedPrsCount).toBe("number");
    expect(typeof stats.highRiskCount).toBe("number");
  });

  it("queries user analyses list without error", async (ctx) => {
    if (!dbAvailable) return ctx.skip();
    const list = await getUserAnalysesList(10);
    expect(Array.isArray(list)).toBe(true);
  });

  it("queries user release notes list without error", async (ctx) => {
    if (!dbAvailable) return ctx.skip();
    const notes = await getUserReleaseNotesList(10);
    expect(Array.isArray(notes)).toBe(true);
  });

  it("returns isolated 0 stats and empty lists for a new user", async (ctx) => {
    if (!dbAvailable) return ctx.skip();
    const newUserId = "brand-new-user-id-99999";
    const stats = await getDashboardStats(newUserId);
    expect(stats.repositoriesCount).toBe(0);
    expect(stats.openPrsCount).toBe(0);
    expect(stats.analyzedPrsCount).toBe(0);
    expect(stats.highRiskCount).toBe(0);

    const analyses = await getUserAnalysesList(newUserId, 10);
    expect(analyses).toEqual([]);

    const releaseNotes = await getUserReleaseNotesList(newUserId, 10);
    expect(releaseNotes).toEqual([]);
  });
});
