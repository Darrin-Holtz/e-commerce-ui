"use client";

import { ShippingFormInputs } from "@e-commerce-ui/types";
import { PaymentElement, useCheckout } from "@stripe/react-stripe-js";
import { useState } from "react";

const CheckoutForm = ({
  shippingForm,
}: {
  shippingForm: ShippingFormInputs;
}) => {
  const checkout = useCheckout();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    try {
      await checkout.updateEmail(shippingForm.email);
      await checkout.updateShippingAddress({
        name: shippingForm.name,
        address: {
          line1: shippingForm.address,
          city: shippingForm.city,
          state: shippingForm.state,
          postal_code: shippingForm.postalCode,
          country: "US",
        },
      });

      const res = await checkout.confirm();
      if (res.type === "error") {
        setError(res.error.message ?? "Payment failed. Please try again.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form>
      <PaymentElement options={{ layout: "accordion" }} />
      <button disabled={loading} onClick={handleClick}>
        {loading ? "Loading..." : "Pay"}
      </button>
      {error && <div className="text-sm text-red-500 mt-2">{error}</div>}
    </form>
  );
};

export default CheckoutForm;