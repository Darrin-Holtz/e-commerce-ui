import { ProductType } from "./commerce.js";
import z from "zod";

export type CartItemType = ProductType & {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
};

export type CartItemsType = CartItemType[];

export const shippingFormSchema = z.object({
  name: z.string().min(1, "Name is required!"),
  email: z
    .string()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format")
    .min(1, "Email is required!"),
  phone: z
    .string()
    .min(7, "Phone number must be between 7 and 10 digits!")
    .max(10, "Phone number must be between 7 and 10 digits!")
    .regex(/^\d+$/, "Phone number must contain only numbers!"),
  address: z.string().min(1, "Address is required!"),
  city: z.string().min(1, "City is required!"),
  state: z.string().optional(),
  postalCode: z.string().min(1, "Postal code is required!"),
});

export type ShippingFormInputs = z.infer<typeof shippingFormSchema>;

export const paymentFormSchema = z.object({
  cardHolder: z.string().min(1, "Card holder name is required!"),
  cardNumber: z
    .string()
    .min(12, "Card number must be 12 digits!")
    .max(12, "Card number must be 12 digits!")
    .regex(/^\d+$/, "Card number must contain only numbers!"),
  expirationDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Invalid expiration date format (MM/YY)!"),
  cvv: z
    .string()
    .min(3, "CVV must be 3 digits!")
    .max(3, "CVV must be 3 digits!")
    .regex(/^\d+$/, "CVV must contain only numbers!"),
});

export type PaymentFormInputs = z.infer<typeof paymentFormSchema>;

export type CartStoreStateType = {
  cart: CartItemsType;
  hasHydrated: boolean;
  shippingForm: ShippingFormInputs | null;
};

export type CartStoreActionsType = {
  addToCart: (product: CartItemType) => void;
  removeFromCart: (product: CartItemType) => void;
  clearCart: () => void;
  setShippingForm: (data: ShippingFormInputs) => void;
};