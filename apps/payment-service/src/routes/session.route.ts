import { Hono } from "hono";
import stripe from "../utils/stripe";
import { shouldBeUser } from "../middleware/authMiddleware";

const sessionRoute = new Hono();

sessionRoute.post("/create-checkout-session", shouldBeUser, async (c) => {
  const {
    cart,
    returnUrl,
  }: {
    cart: { id: string | number; quantity: number }[];
    returnUrl?: string;
  } = await c.req.json();
  const userId = c.get("userId");

  const fallbackReturnUrl =
    process.env.CLIENT_URL
      ? `${process.env.CLIENT_URL}/return?session_id={CHECKOUT_SESSION_ID}`
      : "http://localhost:3000/return?session_id={CHECKOUT_SESSION_ID}";

  try {
    // Fetch authoritative prices from Stripe catalog — never trust the client price
    const lineItems = await Promise.all(
      cart.map(async (item) => {
        const prices = await stripe.prices.list({
          product: item.id.toString(),
          active: true,
          limit: 1,
        });
        const priceId = prices.data[0]?.id;
        if (!priceId) {
          throw new Error(`No active Stripe price found for product ${item.id}`);
        }
        return {
          price: priceId,
          quantity: item.quantity,
        };
      })
    );

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      client_reference_id: userId,
      mode: "payment",
      ui_mode: "elements",
      return_url: returnUrl ?? fallbackReturnUrl,
    });

    if (!session.client_secret) {
      return c.json(
        { error: "Stripe checkout session did not include a client secret." },
        500
      );
    }

    return c.json({ checkoutSessionClientSecret: session.client_secret });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[create-checkout-session] error:", message, error);
    return c.json({ error: "Failed to create checkout session.", detail: message }, 500);
  }
});

sessionRoute.get("/:session_id", async (c) => {
  const { session_id } = c.req.param();

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items"],
    });

    return c.json({
      status: session.status,
      paymentStatus: session.payment_status,
      userId: session.client_reference_id,
      mode: session.mode,
      amountTotal: session.amount_total,
      currency: session.currency,
      customerEmail: session.customer_details?.email,
      lineItems: session.line_items?.data.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        amountTotal: item.amount_total,
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[session-status] error:", message, error);
    return c.json({ error: "Failed to retrieve session.", detail: message }, 500);
  }
});

export default sessionRoute;