import "dotenv/config";
import path from "node:path";

import { defineConfig } from "vitest/config";

process.env.DATABASE_URL = process.env.DATABASE_URL || "postgres://test:test@localhost:5432/test";
process.env.AUTH_SECRET = process.env.AUTH_SECRET || "mock-secret-for-test-suite-minimum-32-chars";
process.env.GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || "mock_github_client_id";
process.env.GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || "mock_github_client_secret";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    include: ["tests/**/*.test.ts"]
  },
  resolve: {
    alias: {
      "next/server": path.resolve(
        __dirname,
        "./node_modules/.pnpm/next@15.5.22_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/server.js"
      ),
      "@/actions": path.resolve(__dirname, "./actions"),
      "@/app": path.resolve(__dirname, "./apps/web/app"),
      "@/components": path.resolve(__dirname, "./components"),
      "@/config": path.resolve(__dirname, "./config"),
      "@/db": path.resolve(__dirname, "./db"),
      "@/features": path.resolve(__dirname, "./features"),
      "@/hooks": path.resolve(__dirname, "./hooks"),
      "@/lib": path.resolve(__dirname, "./lib"),
      "@/server": path.resolve(__dirname, "./server"),
      "@/types": path.resolve(__dirname, "./types")
    }
  }
});
