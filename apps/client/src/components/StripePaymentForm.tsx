"use client";

import { loadStripe } from "@stripe/stripe-js";
import { CheckoutProvider } from "@stripe/react-stripe-js";
import { CartItemsType, ShippingFormInputs } from "@e-commerce-ui/types";
import CheckoutForm from "./CheckoutForm";
import useCartStore from "@/stores/cartStore";

const stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const fetchClientSecret = async (cart: CartItemsType): Promise<string> => {
  const response = await fetch("/api/payments/create-checkout-session", {
    method: "POST",
    body: JSON.stringify({ cart }),
    headers: { "Content-Type": "application/json" },
  });

  const json = await response.json().catch(() => null);
  const clientSecret =
    json && typeof json === "object"
      ? (json as { checkoutSessionClientSecret?: unknown })
          .checkoutSessionClientSecret
      : undefined;

  if (!response.ok || typeof clientSecret !== "string" || !clientSecret) {
    const errObj =
      json && typeof json === "object"
        ? (json as { error?: string; detail?: string })
        : {};
    const detail = errObj.detail ?? errObj.error ?? "";
    console.error("[fetchClientSecret] failed", response.status, json);
    throw new Error(
      `Failed to create checkout session (${response.status})${detail ? `: ${detail}` : ""}.`
    );
  }

  return clientSecret;
};

const StripePaymentForm = ({
  shippingForm,
}: {
  shippingForm: ShippingFormInputs;
}) => {
  const { cart } = useCartStore();

  return (
    <CheckoutProvider
      stripe={stripe}
      options={{ fetchClientSecret: () => fetchClientSecret(cart) }}
    >
      <CheckoutForm shippingForm={shippingForm} />
    </CheckoutProvider>
  );
};

export default StripePaymentForm;