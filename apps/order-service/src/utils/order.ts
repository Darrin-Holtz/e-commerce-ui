import { Order } from "@e-commerce-ui/order-db";
import { OrderType } from "@e-commerce-ui/types";
import { producer } from "./kafka.js";

export const createOrder = async (order: OrderType) => {
  const newOrder = new Order(order);

  try {
    const savedOrder = await newOrder.save();
    console.log("[order-service] Order saved:", savedOrder._id);
    await producer.send("order.created", {
      value: {
        email: savedOrder.email,
        amount: savedOrder.amount,
        status: savedOrder.status,
      },
    });
} catch (error) {
    console.error("[order-service] Failed to save order:", error);
    throw error;
  }
};