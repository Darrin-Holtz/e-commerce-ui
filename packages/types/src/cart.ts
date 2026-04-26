import { z } from "zod";

export const shippingFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal code is required"),
});

export type ShippingFormInputs = z.infer<typeof shippingFormSchema>;

export const paymentFormSchema = z.object({
  cardHolder: z.string().min(1, "Card holder is required"),
  cardNumber: z.string().min(1, "Card number is required"),
  expirationDate: z.string().min(1, "Expiration date is required"),
  cvv: z.string().min(1, "CVV is required"),
});

export type PaymentFormInputs = z.infer<typeof paymentFormSchema>;