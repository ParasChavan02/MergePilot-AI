import { ensureIndexes, getDb } from "./server/db";

async function main() {
  console.log("Connecting to MongoDB and ensuring collection indexes...");
  const db = await getDb();
  await ensureIndexes(db);
  console.log("MongoDB collection indexes initialized successfully!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Failed to initialize MongoDB indexes:", err);
  process.exit(1);
});
