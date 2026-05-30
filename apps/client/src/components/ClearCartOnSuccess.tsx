"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useCartStore from "@/stores/cartStore";

const ClearCartOnSuccess = () => {
  const clearCart = useCartStore((state) => state.clearCart);
  const router = useRouter();

  useEffect(() => {
    clearCart();
    const timer = setTimeout(() => {
      router.push("/orders");
    }, 3000);
    return () => clearTimeout(timer);
  }, [clearCart, router]);

  return null;
};

export default ClearCartOnSuccess;
