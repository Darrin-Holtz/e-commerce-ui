import { Hono } from "hono";
import Stripe from "stripe";
import stripe from "../utils/stripe.js";
import { producer } from "../utils/kafka.js";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
const webhookRoute = new Hono();

webhookRoute.get("/", (c) => {
  return c.json({
    status: "ok webhook",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});


webhookRoute.post("/stripe", handleStripeWebhook);
webhookRoute.post("/stripe/", handleStripeWebhook);

async function handleStripeWebhook(c: any) {
  const body = await c.req.text();
  const sig = c.req.header("stripe-signature");

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig!, webhookSecret);
  } catch (error) {
    console.log("Webhook verification failed!");
    return c.json({ error: "Webhook verification failed!" }, 400);
  }

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;

      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id
      );
      // TODO: CREATE ORDER
      await producer.send("payment.successful", {
        value: {
          userId: session.client_reference_id ?? "",
          email: session.customer_details?.email ?? "",
          amount: session.amount_total ?? 0,
          status: session.payment_status === "paid" ? "success" : "failed",
          products: lineItems.data.map((item) => ({
            name: item.description ?? "Unknown item",
            quantity: item.quantity ?? 1,
            price: item.price?.unit_amount ?? 0,
          })),
        },
      });

      break;

    default:
      break;
  }
  return c.json({ received: true });
}

export default webhookRoute;