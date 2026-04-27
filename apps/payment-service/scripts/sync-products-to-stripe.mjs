/**
 * One-time script to sync all products from product-service into Stripe,
 * using the DB product ID as the custom Stripe product ID.
 *
 * Usage (from repo root):
 *   node apps/payment-service/scripts/sync-products-to-stripe.mjs
 *
 * Requires STRIPE_SECRET_KEY to be set in apps/payment-service/.env
 * Requires product-service to be running on http://localhost:8000
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load STRIPE_SECRET_KEY from payment-service .env
const envPath = resolve(__dirname, "../.env");
const envContents = readFileSync(envPath, "utf8");
const match = envContents.match(/^STRIPE_SECRET_KEY=(.+)$/m);
if (!match) {
  console.error("STRIPE_SECRET_KEY not found in payment-service/.env");
  process.exit(1);
}
const STRIPE_SECRET_KEY = match[1].trim();

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL ?? "http://localhost:8000";

// --- Fetch products from the product service ---
console.log(`Fetching products from ${PRODUCT_SERVICE_URL}/products ...`);
let products;
try {
  const res = await fetch(`${PRODUCT_SERVICE_URL}/products`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  products = await res.json();
} catch (err) {
  console.error("Failed to fetch products. Is product-service running?", err.message);
  process.exit(1);
}

console.log(`Found ${products.length} products in DB.\n`);

// --- Sync each product to Stripe ---
for (const product of products) {
  const stripeId = product.id.toString();
  const unitAmount = Math.round(Number(product.price) * 100);

  // Check if product already exists in Stripe
  let exists = false;
  try {
    const checkRes = await fetch(`https://api.stripe.com/v1/products/${stripeId}`, {
      headers: { Authorization: `Bearer ${STRIPE_SECRET_KEY}` },
    });
    if (checkRes.ok) {
      const existing = await checkRes.json();
      if (!existing.deleted) {
        console.log(`✓ Product ${stripeId} ("${product.name}") already in Stripe — skipping.`);
        exists = true;
      }
    }
  } catch {
    // 404 means not found — proceed to create
  }

  if (exists) continue;

  // Create product with numeric ID as the custom Stripe product ID
  const productBody = new URLSearchParams({
    id: stripeId,
    name: product.name,
    "default_price_data[currency]": "usd",
    "default_price_data[unit_amount]": unitAmount.toString(),
  });

  const createRes = await fetch("https://api.stripe.com/v1/products", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: productBody,
  });

  const created = await createRes.json();
  if (created.error) {
    console.error(`✗ Failed to create product ${stripeId} ("${product.name}"): ${created.error.message}`);
  } else {
    console.log(`+ Created product ${stripeId} ("${product.name}") in Stripe with price $${(unitAmount / 100).toFixed(2)}`);
  }
}

console.log("\nDone.");
