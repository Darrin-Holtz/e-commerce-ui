import type { Product, Category } from "@e-commerce-ui/product-db"

export type StripeProductType = {
    id: string;
    name: string;
    price: number;
};

export type CategoryType = Category;