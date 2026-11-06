import dns from "node:dns";

import { Collection, Db, MongoClient } from "mongodb";

import { env } from "@/config/env";
import type {
  AccountDoc,
  AnalysisDoc,
  PullRequestDoc,
  ReleaseNoteDoc,
  RepositoryDoc,
  SessionDoc,
  UserDoc,
  VerificationTokenDoc
} from "@/db/models";

// Fallback to public DNS servers if local DNS resolver has issues resolving SRV records
try {
  dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
} catch {
  // Non-fatal if runtime disallows changing DNS servers
}

const uri = env.DATABASE_URL;

interface MongoGlobalCache {
  _mongoClientPromise?: Promise<MongoClient>;
  _mongoDbPromise?: Promise<Db>;
  _indexesCreated?: boolean;
}

const globalWithMongo = globalThis as typeof globalThis & MongoGlobalCache;

let clientPromise: Promise<MongoClient>;

if (!globalWithMongo._mongoClientPromise) {
  const client = new MongoClient(uri, {
    maxPoolSize: 10,
    minPoolSize: 1,
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 15000
  });

  globalWithMongo._mongoClientPromise = client.connect().then(async (c) => {
    // Ensure core indexes in background
    if (!globalWithMongo._indexesCreated) {
      globalWithMongo._indexesCreated = true;
      ensureIndexes(c.db()).catch((err) => {
        console.warn("MongoDB index initialization warning:", err?.message || err);
      });
    }
    return c;
  });
}

clientPromise = globalWithMongo._mongoClientPromise;

export { clientPromise };

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db();
}

export async function ensureIndexes(dbInstance?: Db): Promise<void> {
  const database = dbInstance || (await getDb());

  try {
    await Promise.all([
      database.collection("users").createIndex({ email: 1 }, { unique: true, sparse: true }),
      database
        .collection("accounts")
        .createIndex({ provider: 1, providerAccountId: 1 }, { unique: true, sparse: true }),
      database.collection("accounts").createIndex({ userId: 1 }),
      database.collection("sessions").createIndex({ sessionToken: 1 }, { unique: true }),
      database.collection("sessions").createIndex({ userId: 1 }),
      database
        .collection("verification_tokens")
        .createIndex({ identifier: 1, token: 1 }, { unique: true }),
      database.collection("repositories").createIndex({ id: 1 }, { unique: true }),
      database.collection("repositories").createIndex({ fullName: 1 }, { unique: true }),
      database.collection("repositories").createIndex({ githubId: 1 }, { unique: true }),
      database.collection("repositories").createIndex({ ownerId: 1 }),
      database.collection("pull_requests").createIndex({ id: 1 }, { unique: true }),
      database
        .collection("pull_requests")
        .createIndex({ repositoryId: 1, number: 1 }, { unique: true }),
      database.collection("pull_requests").createIndex({ githubId: 1 }),
      database.collection("analyses").createIndex({ id: 1 }, { unique: true }),
      database.collection("analyses").createIndex({ pullRequestId: 1 }),
      database.collection("analyses").createIndex({ userId: 1 }),
      database.collection("analyses").createIndex({ repositoryId: 1 }),
      database.collection("analyses").createIndex({ createdAt: -1 }),
      database.collection("release_notes").createIndex({ id: 1 }, { unique: true }),
      database.collection("release_notes").createIndex({ analysisId: 1 }),
      database.collection("release_notes").createIndex({ repositoryId: 1 }),
      database.collection("release_notes").createIndex({ createdAt: -1 })
    ]);
  } catch (error) {
    console.warn("Notice: Index setup finished with:", error);
  }
}

export async function getUsersCollection(): Promise<Collection<UserDoc>> {
  const database = await getDb();
  return database.collection<UserDoc>("users");
}

export async function getAccountsCollection(): Promise<Collection<AccountDoc>> {
  const database = await getDb();
  return database.collection<AccountDoc>("accounts");
}

export async function getSessionsCollection(): Promise<Collection<SessionDoc>> {
  const database = await getDb();
  return database.collection<SessionDoc>("sessions");
}

export async function getVerificationTokensCollection(): Promise<Collection<VerificationTokenDoc>> {
  const database = await getDb();
  return database.collection<VerificationTokenDoc>("verification_tokens");
}

export async function getRepositoriesCollection(): Promise<Collection<RepositoryDoc>> {
  const database = await getDb();
  return database.collection<RepositoryDoc>("repositories");
}

export async function getPullRequestsCollection(): Promise<Collection<PullRequestDoc>> {
  const database = await getDb();
  return database.collection<PullRequestDoc>("pull_requests");
}

export async function getAnalysesCollection(): Promise<Collection<AnalysisDoc>> {
  const database = await getDb();
  return database.collection<AnalysisDoc>("analyses");
}

export async function getReleaseNotesCollection(): Promise<Collection<ReleaseNoteDoc>> {
  const database = await getDb();
  return database.collection<ReleaseNoteDoc>("release_notes");
}
