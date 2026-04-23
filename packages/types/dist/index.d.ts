export type ProductType = {
    id: string | number;
    name: string;
    shortDescription: string;
    description: string;
    price: number;
    sizes: string[];
    colors: string[];
    images: {
        [color: string]: string;
    };
};
export type ProductsType = ProductType[];
export type CartItemType = ProductType & {
    quantity: number;
    selectedSize: string;
    selectedColor: string;
};
export type CartItemsType = CartItemType[];
export type CartStoreStateType = {
    cart: CartItemsType;
    hasHydrated: boolean;
};
export type CartStoreActionsType = {
    addToCart: (product: CartItemType) => void;
    removeFromCart: (product: CartItemType) => void;
    clearCart: () => void;
};
//# sourceMappingURL=index.d.ts.map