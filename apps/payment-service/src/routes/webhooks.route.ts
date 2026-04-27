import { Hono } from "hono";
import stripe from "../utils/stripe";
import Stripe from "stripe";

const webhooksRoute = new Hono();

webhooksRoute.post("/stripe", async (c) => {
  const sig = c.req.header("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return c.json({ error: "Missing stripe signature or webhook secret" }, 400);
  }

  // Stripe requires the raw request body (not parsed) to verify the signature
  const rawBody = await c.req.raw.arrayBuffer();
  const buf = Buffer.from(rawBody);

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[webhook] Signature verification failed:", message);
    return c.json({ error: `Webhook signature verification failed: ${message}` }, 400);
  }

  console.log(`[webhook] Received event: ${event.type}`);

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      // Expand line items and product details (not included in the webhook payload by default)
      const expanded = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ["line_items", "line_items.data.price.product"],
      });

      console.log("[webhook] checkout.session.completed", {
        sessionId: expanded.id,
        userId: expanded.client_reference_id,
        paymentStatus: expanded.payment_status,
        amountTotal: expanded.amount_total,
        currency: expanded.currency,
        customerDetails: expanded.customer_details,
        shippingDetails: expanded.collected_information?.shipping_details,
        lineItems: expanded.line_items?.data.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          amountTotal: item.amount_total,
          product:
            typeof item.price?.product === "object" && item.price?.product !== null
              ? {
                  id: (item.price.product as Stripe.Product).id,
                  name: (item.price.product as Stripe.Product).name,
                }
              : item.price?.product,
        })),
      });
      // TODO: create order in order-service
      break;
    }

    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("[webhook] async_payment_succeeded", session.id);
      // TODO: fulfil order
      break;
    }

    case "checkout.session.async_payment_failed": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("[webhook] async_payment_failed", session.id);
      // TODO: notify user / cancel order
      break;
    }

    default:
      console.log(`[webhook] Unhandled event type: ${event.type}`);
  }

  return c.json({ received: true });
});

export default webhooksRoute;
