import { Hono } from "hono";
import { shouldBeAdmin } from "../middleware/authMiddleware.js";
import {
  createStripeProduct,
  deleteStripeProduct,
} from "../utils/stripeProduct.js";

const productRoute = new Hono();

// Called by product-service (via Kafka event or direct HTTP) when a product is created
productRoute.post("/", shouldBeAdmin, async (c) => {
  const { id, name, price } = await c.req.json<{
    id: number;
    name: string;
    price: number;
  }>();

  if (!id || !name || price == null) {
    return c.json({ error: "id, name, and price are required" }, 400);
  }

  const result = await createStripeProduct({ id: id.toString(), name, price });

  if (result instanceof Error) {
    return c.json({ error: "Failed to create Stripe product" }, 500);
  }

  return c.json({ success: true, stripeProductId: id.toString() }, 201);
});

// Called when a product is deleted
productRoute.delete("/:id", shouldBeAdmin, async (c) => {
  const id = Number(c.req.param("id"));
  const result = await deleteStripeProduct(id);

  if (result instanceof Error) {
    return c.json({ error: "Failed to delete Stripe product" }, 500);
  }

  return c.json({ success: true });
});

export default productRoute;
