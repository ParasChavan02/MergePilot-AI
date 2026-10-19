import { NextResponse } from "next/server";

import { env } from "@/config/env";
import {
  deliveryDeduplicator,
  processMarketplaceEvent,
  verifyMarketplaceWebhookSignature
} from "@/server/marketplace/webhook";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const signatureHeader = request.headers.get("x-hub-signature-256");
    const githubEvent = request.headers.get("x-github-event") || "";
    const deliveryId = request.headers.get("x-github-delivery");

    const webhookSecret =
      process.env.GITHUB_MARKETPLACE_WEBHOOK_SECRET || env.GITHUB_MARKETPLACE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error(
        "[marketplace-webhook] Configuration Error: GITHUB_MARKETPLACE_WEBHOOK_SECRET is not configured on the server."
      );
      return NextResponse.json(
        {
          error: "Marketplace webhook secret is not configured on the server",
          code: "CONFIGURATION_ERROR"
        },
        { status: 500 }
      );
    }

    // 1. Read raw request body for HMAC-SHA256 signature verification
    const rawBody = await request.text();

    // 2. Reject requests missing the signature header
    if (!signatureHeader) {
      return NextResponse.json(
        {
          error: "Missing X-Hub-Signature-256 header",
          code: "MISSING_SIGNATURE"
        },
        { status: 400 }
      );
    }

    // 3. Verify HMAC-SHA256 signature using constant-time comparison
    const isValidSignature = verifyMarketplaceWebhookSignature({
      rawBody,
      signatureHeader,
      secret: webhookSecret
    });

    if (!isValidSignature) {
      console.warn(
        `[marketplace-webhook] Signature verification failed for delivery: ${deliveryId || "unknown"}`
      );
      return NextResponse.json(
        {
          error: "Invalid webhook signature",
          code: "INVALID_SIGNATURE"
        },
        { status: 401 }
      );
    }

    // 4. Check for duplicate delivery (at-least-once delivery retry safety)
    if (deliveryId && deliveryDeduplicator.isDuplicate(deliveryId)) {
      console.log(
        `[marketplace-webhook] Duplicate delivery detected: ${deliveryId}. Returning 200 OK.`
      );
      return NextResponse.json(
        {
          ok: true,
          duplicate: true,
          status: "duplicate",
          message: "Webhook delivery already processed"
        },
        { status: 200 }
      );
    }

    // 5. Parse JSON payload safely
    let payload: unknown;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        {
          error: "Invalid JSON payload",
          code: "BAD_REQUEST"
        },
        { status: 400 }
      );
    }

    // 6. Process the marketplace event
    const result = await processMarketplaceEvent({
      event: githubEvent,
      payload,
      deliveryId
    });

    // 7. Mark delivery as processed in our deduplication cache
    if (deliveryId) {
      deliveryDeduplicator.markProcessed(deliveryId);
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("[marketplace-webhook] Error processing webhook:", message);

    return NextResponse.json(
      {
        error: message,
        code: "PROCESSING_ERROR"
      },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      error:
        "Method Not Allowed. GitHub Marketplace webhooks must be delivered via POST with X-Hub-Signature-256.",
      code: "METHOD_NOT_ALLOWED"
    },
    { status: 405 }
  );
}
