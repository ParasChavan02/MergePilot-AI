import crypto from "node:crypto";

import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { accounts } from "@/db/schema";
import { db } from "@/server/db";

/**
 * Constant-time verification of GitHub webhook HMAC-SHA256 signature.
 * Prevents timing attacks and ensures payload authenticity.
 */
export function verifyMarketplaceWebhookSignature({
  rawBody,
  signatureHeader,
  secret
}: {
  rawBody: string | Buffer;
  signatureHeader: string | null | undefined;
  secret: string;
}): boolean {
  if (!signatureHeader || !secret) {
    return false;
  }

  const prefix = "sha256=";
  if (!signatureHeader.startsWith(prefix)) {
    return false;
  }

  const providedHex = signatureHeader.slice(prefix.length).trim();
  if (providedHex.length !== 64) {
    return false;
  }

  const expectedHex = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");

  const providedBuffer = Buffer.from(providedHex, "utf8");
  const expectedBuffer = Buffer.from(expectedHex, "utf8");

  if (providedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(providedBuffer, expectedBuffer);
}

/**
 * Helper to generate a valid GitHub HMAC-SHA256 header for tests and internal verification.
 */
export function generateMarketplaceWebhookSignature(
  rawBody: string | Buffer,
  secret: string
): string {
  const digest = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return `sha256=${digest}`;
}

/**
 * In-memory bounded cache for duplicate webhook delivery prevention.
 * Uses X-GitHub-Delivery GUID with TTL expiration to safely drop retries.
 */
export class DeliveryDeduplicator {
  private seenDeliveries = new Map<string, number>();
  private readonly maxEntries: number;
  private readonly ttlMs: number;

  constructor({
    maxEntries = 10_000,
    ttlMs = 24 * 60 * 60 * 1000 // 24 hours
  }: { maxEntries?: number; ttlMs?: number } = {}) {
    this.maxEntries = maxEntries;
    this.ttlMs = ttlMs;
  }

  isDuplicate(deliveryId: string): boolean {
    if (!deliveryId) return false;
    const timestamp = this.seenDeliveries.get(deliveryId);
    if (!timestamp) return false;

    if (Date.now() - timestamp > this.ttlMs) {
      this.seenDeliveries.delete(deliveryId);
      return false;
    }

    return true;
  }

  markProcessed(deliveryId: string): void {
    if (!deliveryId) return;
    this.pruneIfNeeded();
    this.seenDeliveries.set(deliveryId, Date.now());
  }

  private pruneIfNeeded(): void {
    const now = Date.now();
    if (this.seenDeliveries.size >= this.maxEntries) {
      for (const [id, timestamp] of this.seenDeliveries.entries()) {
        if (now - timestamp > this.ttlMs) {
          this.seenDeliveries.delete(id);
        }
      }
    }

    while (this.seenDeliveries.size >= this.maxEntries) {
      const oldestKey = this.seenDeliveries.keys().next().value;
      if (oldestKey) {
        this.seenDeliveries.delete(oldestKey);
      } else {
        break;
      }
    }
  }

  clear(): void {
    this.seenDeliveries.clear();
  }
}

export const deliveryDeduplicator = new DeliveryDeduplicator();

// ---------------------------------------------------------------------------
// GitHub Marketplace Payload Schemas
// ---------------------------------------------------------------------------

export const MarketplaceAccountSchema = z.object({
  type: z.enum(["User", "Organization"]).or(z.string()),
  id: z.number(),
  login: z.string(),
  organization_billing_email: z.string().optional().nullable()
});

export const MarketplacePlanSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional().nullable(),
  monthly_price_in_cents: z.number().nonnegative(),
  yearly_price_in_cents: z.number().nonnegative().optional().nullable(),
  price_model: z.string().optional().nullable(),
  unit_name: z.string().optional().nullable(),
  bullets: z.array(z.string()).optional().default([])
});

export const MarketplacePurchaseSchema = z.object({
  account: MarketplaceAccountSchema,
  billing_cycle: z.string(),
  unit_count: z.number().nonnegative().default(1),
  on_free_trial: z.boolean().default(false),
  free_trial_ends_on: z.string().optional().nullable(),
  next_billing_date: z.string().optional().nullable(),
  plan: MarketplacePlanSchema
});

export const MarketplacePurchaseActionEnum = z.enum([
  "purchased",
  "cancelled",
  "changed",
  "pending_change",
  "pending_change_cancelled"
]);

export type MarketplacePurchaseAction = z.infer<typeof MarketplacePurchaseActionEnum>;

export const MarketplacePurchaseEventPayloadSchema = z.object({
  action: MarketplacePurchaseActionEnum,
  effective_date: z.string().optional().nullable(),
  sender: z
    .object({
      login: z.string(),
      id: z.number(),
      type: z.string().optional(),
      avatar_url: z.string().optional()
    })
    .optional()
    .nullable(),
  marketplace_purchase: MarketplacePurchaseSchema,
  previous_marketplace_purchase: MarketplacePurchaseSchema.optional().nullable()
});

export type MarketplacePurchaseEventPayload = z.infer<typeof MarketplacePurchaseEventPayloadSchema>;

export const PingPayloadSchema = z.object({
  zen: z.string().optional(),
  hook_id: z.number().optional(),
  hook: z.record(z.string(), z.unknown()).optional()
});

export interface ProcessMarketplaceResult {
  ok: boolean;
  event: string;
  action?: MarketplacePurchaseAction | string;
  status: "processed" | "ignored" | "duplicate" | "acknowledged";
  message: string;
  account?: {
    login: string;
    id: number;
    type: string;
  };
  plan?: {
    id: number;
    name: string;
    billingCycle?: string;
  };
  matchedUserId?: string | null;
}

/**
 * Dispatches and safely handles verified GitHub Marketplace events.
 * Adheres to privacy standards by omitting sensitive credentials or emails from logs.
 */
export async function processMarketplaceEvent({
  event,
  payload,
  deliveryId
}: {
  event: string;
  payload: unknown;
  deliveryId?: string | null;
}): Promise<ProcessMarketplaceResult> {
  const normalizedEvent = (event || "").trim().toLowerCase();

  // 1. Handle GitHub Ping / Verification event
  if (normalizedEvent === "ping") {
    PingPayloadSchema.safeParse(payload);
    console.log(
      `[marketplace-webhook] Event: ping | Delivery: ${deliveryId || "n/a"} | Verified successfully`
    );

    return {
      ok: true,
      event: "ping",
      status: "acknowledged",
      message: "Webhook endpoint active and signature verified"
    };
  }

  // 2. Handle GitHub Marketplace Purchase event
  if (normalizedEvent === "marketplace_purchase") {
    const parseResult = MarketplacePurchaseEventPayloadSchema.safeParse(payload);

    if (!parseResult.success) {
      const errorDetails = parseResult.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ");

      console.warn(
        `[marketplace-webhook] Event: marketplace_purchase | Delivery: ${deliveryId || "n/a"} | Invalid payload: ${errorDetails}`
      );

      throw new Error(`Invalid marketplace_purchase payload structure: ${errorDetails}`);
    }

    const { action, effective_date, marketplace_purchase, previous_marketplace_purchase } =
      parseResult.data;
    const { account, plan, billing_cycle } = marketplace_purchase;

    // Check if the GitHub account maps to any existing registered user in our database
    let matchedUserId: string | null = null;
    try {
      const [accountRecord] = await db
        .select({ userId: accounts.userId })
        .from(accounts)
        .where(
          and(eq(accounts.provider, "github"), eq(accounts.providerAccountId, String(account.id)))
        )
        .limit(1);

      if (accountRecord?.userId) {
        matchedUserId = accountRecord.userId;
      }
    } catch {
      // Gracefully continue if the database is offline or during isolated testing
    }

    // Safe, non-sensitive audit logging
    const previousPlanInfo = previous_marketplace_purchase
      ? ` (previous plan: ${previous_marketplace_purchase.plan.name})`
      : "";

    console.log(
      `[marketplace-webhook] Event: marketplace_purchase | Action: ${action} | Delivery: ${deliveryId || "n/a"} | Account: ${account.login} (ID: ${account.id}, Type: ${account.type}) | Plan: ${plan.name} (ID: ${plan.id}, Cycle: ${billing_cycle})${previousPlanInfo} | Effective: ${effective_date || "immediate"} | Matched User: ${matchedUserId || "none"}`
    );

    let actionMessage: string;
    switch (action) {
      case "purchased":
        actionMessage = `Marketplace plan '${plan.name}' purchased for ${account.login}.`;
        break;
      case "changed":
        actionMessage = `Marketplace plan changed to '${plan.name}' for ${account.login}${previousPlanInfo}.`;
        break;
      case "cancelled":
        actionMessage = `Marketplace plan '${plan.name}' cancelled for ${account.login}.`;
        break;
      case "pending_change":
        actionMessage = `Marketplace pending plan change to '${plan.name}' recorded for ${account.login}.`;
        break;
      case "pending_change_cancelled":
        actionMessage = `Marketplace pending plan change cancelled for ${account.login}.`;
        break;
      default:
        actionMessage = `Marketplace event '${action}' processed.`;
    }

    return {
      ok: true,
      event: "marketplace_purchase",
      action,
      status: "processed",
      message: actionMessage,
      account: {
        login: account.login,
        id: account.id,
        type: account.type
      },
      plan: {
        id: plan.id,
        name: plan.name,
        billingCycle: billing_cycle
      },
      matchedUserId
    };
  }

  // 3. Handle any other unsupported webhook events safely
  console.log(
    `[marketplace-webhook] Event: ${normalizedEvent} | Delivery: ${deliveryId || "n/a"} | Status: Ignored unsupported event`
  );

  return {
    ok: true,
    event: normalizedEvent,
    status: "ignored",
    message: `Event '${normalizedEvent}' received and acknowledged, but is not handled by this marketplace endpoint.`
  };
}
