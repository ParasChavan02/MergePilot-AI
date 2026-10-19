import { beforeEach, describe, expect, it } from "vitest";

import { GET, POST } from "@/app/api/webhooks/marketplace/route";
import {
  deliveryDeduplicator,
  generateMarketplaceWebhookSignature,
  processMarketplaceEvent,
  verifyMarketplaceWebhookSignature
} from "@/server/marketplace/webhook";

const TEST_SECRET = "test_marketplace_webhook_secret_key_12345";

describe("GitHub Marketplace Webhook - Signature Verification", () => {
  it("rejects when signature header is missing or empty", () => {
    expect(
      verifyMarketplaceWebhookSignature({
        rawBody: '{"action":"purchased"}',
        signatureHeader: null,
        secret: TEST_SECRET
      })
    ).toBe(false);

    expect(
      verifyMarketplaceWebhookSignature({
        rawBody: '{"action":"purchased"}',
        signatureHeader: "",
        secret: TEST_SECRET
      })
    ).toBe(false);
  });

  it("rejects when secret is missing or empty", () => {
    const rawBody = '{"action":"purchased"}';
    const signature = generateMarketplaceWebhookSignature(rawBody, TEST_SECRET);

    expect(
      verifyMarketplaceWebhookSignature({
        rawBody,
        signatureHeader: signature,
        secret: ""
      })
    ).toBe(false);
  });

  it("rejects when signature does not start with sha256=", () => {
    expect(
      verifyMarketplaceWebhookSignature({
        rawBody: '{"action":"purchased"}',
        signatureHeader: "invalid_prefix_without_sha256",
        secret: TEST_SECRET
      })
    ).toBe(false);
  });

  it("rejects when signature length is invalid", () => {
    expect(
      verifyMarketplaceWebhookSignature({
        rawBody: '{"action":"purchased"}',
        signatureHeader: "sha256=12345",
        secret: TEST_SECRET
      })
    ).toBe(false);
  });

  it("rejects tampered body or incorrect secret", () => {
    const validBody = '{"action":"purchased"}';
    const tamperedBody = '{"action":"purchased","extra":"tampered"}';
    const signature = generateMarketplaceWebhookSignature(validBody, TEST_SECRET);

    // Tampered body
    expect(
      verifyMarketplaceWebhookSignature({
        rawBody: tamperedBody,
        signatureHeader: signature,
        secret: TEST_SECRET
      })
    ).toBe(false);

    // Different secret
    expect(
      verifyMarketplaceWebhookSignature({
        rawBody: validBody,
        signatureHeader: signature,
        secret: "wrong_secret_key"
      })
    ).toBe(false);
  });

  it("successfully verifies valid HMAC-SHA256 signature", () => {
    const rawBody = JSON.stringify({ action: "purchased", id: 100 });
    const signature = generateMarketplaceWebhookSignature(rawBody, TEST_SECRET);

    expect(
      verifyMarketplaceWebhookSignature({
        rawBody,
        signatureHeader: signature,
        secret: TEST_SECRET
      })
    ).toBe(true);
  });
});

describe("GitHub Marketplace Webhook - Duplicate Delivery Cache", () => {
  beforeEach(() => {
    deliveryDeduplicator.clear();
  });

  it("identifies new delivery ID as non-duplicate and repeated delivery ID as duplicate", () => {
    const deliveryId = "72d3162e-cc78-11e3-81ab-4c9367dc0958";

    expect(deliveryDeduplicator.isDuplicate(deliveryId)).toBe(false);

    deliveryDeduplicator.markProcessed(deliveryId);

    expect(deliveryDeduplicator.isDuplicate(deliveryId)).toBe(true);
    expect(deliveryDeduplicator.isDuplicate("different-delivery-uuid")).toBe(false);
  });

  it("clears cached deliveries properly", () => {
    const deliveryId = "delivery-test-123";
    deliveryDeduplicator.markProcessed(deliveryId);
    expect(deliveryDeduplicator.isDuplicate(deliveryId)).toBe(true);

    deliveryDeduplicator.clear();
    expect(deliveryDeduplicator.isDuplicate(deliveryId)).toBe(false);
  });
});

describe("GitHub Marketplace Webhook - Event Processing", () => {
  it("handles ping event and returns acknowledged status", async () => {
    const pingPayload = {
      zen: "Approachable is better than simple.",
      hook_id: 99887766
    };

    const result = await processMarketplaceEvent({
      event: "ping",
      payload: pingPayload,
      deliveryId: "ping-delivery-id"
    });

    expect(result.ok).toBe(true);
    expect(result.event).toBe("ping");
    expect(result.status).toBe("acknowledged");
  });

  it("handles marketplace_purchase event with 'purchased' action", async () => {
    const payload = {
      action: "purchased",
      effective_date: "2026-10-19T00:00:00Z",
      sender: {
        login: "octocat",
        id: 1,
        type: "User"
      },
      marketplace_purchase: {
        account: {
          type: "User",
          id: 1,
          login: "octocat",
          organization_billing_email: "billing@example.com"
        },
        billing_cycle: "monthly",
        unit_count: 1,
        on_free_trial: false,
        next_billing_date: "2026-11-19T00:00:00Z",
        plan: {
          id: 101,
          name: "Pro Plan",
          description: "Pull request intelligence pro tier",
          monthly_price_in_cents: 2900,
          yearly_price_in_cents: 29000
        }
      }
    };

    const result = await processMarketplaceEvent({
      event: "marketplace_purchase",
      payload,
      deliveryId: "delivery-purchase-1"
    });

    expect(result.ok).toBe(true);
    expect(result.event).toBe("marketplace_purchase");
    expect(result.action).toBe("purchased");
    expect(result.status).toBe("processed");
    expect(result.account?.login).toBe("octocat");
    expect(result.plan?.name).toBe("Pro Plan");
  });

  it("handles marketplace_purchase event with 'changed' action", async () => {
    const payload = {
      action: "changed",
      effective_date: "2026-10-19T00:00:00Z",
      marketplace_purchase: {
        account: {
          type: "Organization",
          id: 42,
          login: "acme-corp"
        },
        billing_cycle: "yearly",
        unit_count: 5,
        on_free_trial: false,
        plan: {
          id: 202,
          name: "Enterprise Plan",
          monthly_price_in_cents: 9900,
          yearly_price_in_cents: 99000
        }
      },
      previous_marketplace_purchase: {
        account: {
          type: "Organization",
          id: 42,
          login: "acme-corp"
        },
        billing_cycle: "monthly",
        unit_count: 1,
        on_free_trial: false,
        plan: {
          id: 101,
          name: "Pro Plan",
          monthly_price_in_cents: 2900,
          yearly_price_in_cents: 29000
        }
      }
    };

    const result = await processMarketplaceEvent({
      event: "marketplace_purchase",
      payload,
      deliveryId: "delivery-changed-1"
    });

    expect(result.ok).toBe(true);
    expect(result.action).toBe("changed");
    expect(result.plan?.name).toBe("Enterprise Plan");
  });

  it("handles marketplace_purchase event with 'cancelled' action", async () => {
    const payload = {
      action: "cancelled",
      effective_date: "2026-10-31T23:59:59Z",
      marketplace_purchase: {
        account: {
          type: "User",
          id: 10,
          login: "johndoe"
        },
        billing_cycle: "monthly",
        unit_count: 1,
        on_free_trial: false,
        plan: {
          id: 101,
          name: "Pro Plan",
          monthly_price_in_cents: 2900
        }
      }
    };

    const result = await processMarketplaceEvent({
      event: "marketplace_purchase",
      payload,
      deliveryId: "delivery-cancelled-1"
    });

    expect(result.ok).toBe(true);
    expect(result.action).toBe("cancelled");
    expect(result.status).toBe("processed");
  });

  it("rejects invalid marketplace_purchase payload structure", async () => {
    const invalidPayload = {
      action: "unknown_action_type",
      marketplace_purchase: {}
    };

    await expect(
      processMarketplaceEvent({
        event: "marketplace_purchase",
        payload: invalidPayload,
        deliveryId: "delivery-invalid-1"
      })
    ).rejects.toThrow("Invalid marketplace_purchase payload structure");
  });

  it("handles unsupported events safely without throwing", async () => {
    const result = await processMarketplaceEvent({
      event: "issues",
      payload: { action: "opened" },
      deliveryId: "delivery-issues-1"
    });

    expect(result.ok).toBe(true);
    expect(result.event).toBe("issues");
    expect(result.status).toBe("ignored");
  });
});

describe("POST /api/webhooks/marketplace Route Handler", () => {
  beforeEach(() => {
    process.env.GITHUB_MARKETPLACE_WEBHOOK_SECRET = TEST_SECRET;
    deliveryDeduplicator.clear();
  });

  it("returns 400 when X-Hub-Signature-256 header is missing", async () => {
    const req = new Request("http://localhost:3000/api/webhooks/marketplace", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-github-event": "ping"
      },
      body: JSON.stringify({ zen: "Test ping" })
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.code).toBe("MISSING_SIGNATURE");
  });

  it("returns 401 when X-Hub-Signature-256 header is invalid", async () => {
    const req = new Request("http://localhost:3000/api/webhooks/marketplace", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-github-event": "ping",
        "x-hub-signature-256":
          "sha256=0000000000000000000000000000000000000000000000000000000000000000"
      },
      body: JSON.stringify({ zen: "Test ping" })
    });

    const res = await POST(req);
    expect(res.status).toBe(401);

    const data = await res.json();
    expect(data.code).toBe("INVALID_SIGNATURE");
  });

  it("returns 200 for a valid ping webhook request", async () => {
    const rawBody = JSON.stringify({ zen: "Responsive is better than fast." });
    const signature = generateMarketplaceWebhookSignature(rawBody, TEST_SECRET);

    const req = new Request("http://localhost:3000/api/webhooks/marketplace", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-github-event": "ping",
        "x-hub-signature-256": signature,
        "x-github-delivery": "delivery-ping-test"
      },
      body: rawBody
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.event).toBe("ping");
    expect(data.status).toBe("acknowledged");
  });

  it("returns 200 for a valid marketplace_purchase event", async () => {
    const rawBody = JSON.stringify({
      action: "purchased",
      effective_date: "2026-10-19T00:00:00Z",
      sender: {
        login: "octocat",
        id: 1
      },
      marketplace_purchase: {
        account: {
          type: "User",
          id: 1,
          login: "octocat"
        },
        billing_cycle: "monthly",
        unit_count: 1,
        on_free_trial: false,
        plan: {
          id: 500,
          name: "Standard Plan",
          monthly_price_in_cents: 1500
        }
      }
    });
    const signature = generateMarketplaceWebhookSignature(rawBody, TEST_SECRET);

    const req = new Request("http://localhost:3000/api/webhooks/marketplace", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-github-event": "marketplace_purchase",
        "x-hub-signature-256": signature,
        "x-github-delivery": "delivery-purchase-unique-123"
      },
      body: rawBody
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.action).toBe("purchased");
    expect(data.account.login).toBe("octocat");
    expect(data.plan.name).toBe("Standard Plan");
  });

  it("detects and safely handles duplicate deliveries with status 200", async () => {
    const deliveryId = "duplicate-delivery-check-456";
    const rawBody = JSON.stringify({ zen: "Test ping" });
    const signature = generateMarketplaceWebhookSignature(rawBody, TEST_SECRET);

    const createRequest = () =>
      new Request("http://localhost:3000/api/webhooks/marketplace", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-github-event": "ping",
          "x-hub-signature-256": signature,
          "x-github-delivery": deliveryId
        },
        body: rawBody
      });

    // First delivery -> processed
    const res1 = await POST(createRequest());
    expect(res1.status).toBe(200);
    const data1 = await res1.json();
    expect(data1.status).toBe("acknowledged");

    // Second delivery with identical X-GitHub-Delivery -> duplicate handled safely
    const res2 = await POST(createRequest());
    expect(res2.status).toBe(200);
    const data2 = await res2.json();
    expect(data2.ok).toBe(true);
    expect(data2.duplicate).toBe(true);
    expect(data2.status).toBe("duplicate");
  });

  it("returns 400 when body is invalid JSON", async () => {
    const rawBody = "not valid json {{{{";
    const signature = generateMarketplaceWebhookSignature(rawBody, TEST_SECRET);

    const req = new Request("http://localhost:3000/api/webhooks/marketplace", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-github-event": "ping",
        "x-hub-signature-256": signature
      },
      body: rawBody
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.code).toBe("BAD_REQUEST");
  });

  it("returns 405 Method Not Allowed for GET requests", async () => {
    const res = await GET();
    expect(res.status).toBe(405);

    const data = await res.json();
    expect(data.code).toBe("METHOD_NOT_ALLOWED");
  });
});
