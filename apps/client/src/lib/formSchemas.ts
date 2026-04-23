import { z } from "zod";

export const shippingFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phone: z
    .string()
    .min(7, "Phone number must be at least 7 characters")
    .max(10, "Phone number must be at most 10 characters")
    .regex(/^\d+$/, "Phone number must contain only digits"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal code is required"),
});

export type ShippingFormInputs = z.infer<typeof shippingFormSchema>;

export const paymentFormSchema = z.object({
  cardHolder: z.string().min(1, "Card holder name is required"),
  cardNumber: z
    .string()
    .min(16, "Card number must be at least 16 characters")
    .max(19, "Card number must be at most 19 characters")
    .regex(/^\d+$/, "Card number must contain only digits"),
  expirationDate: z
    .string()
    .min(5, "Expiration date must be in MM/YY format")
    .max(5, "Expiration date must be in MM/YY format")
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiration date must be in MM/YY format"),
  cvv: z
    .string()
    .min(3, "CVV must be at least 3 characters")
    .max(4, "CVV must be at most 4 characters")
    .regex(/^\d+$/, "CVV must contain only digits"),
});

export type PaymentFormInputs = z.infer<typeof paymentFormSchema>;