import { CartStoreActionsType, CartStoreStateType } from '@e-commerce-ui/types'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const useCartStore = create<CartStoreStateType & CartStoreActionsType>()(
    persist(
        (set) => ({
            cart: [],
            hasHydrated: false,
            shippingForm: null,
            addToCart: (product) => set((state) => {
                const existingProductIndex = state.cart.findIndex(p => 
                    p.id === product.id && 
                    p.selectedSize === product.selectedSize && 
                    p.selectedColor === product.selectedColor
                );
                
                if (existingProductIndex !== -1) {
                    return {
                        cart: state.cart.map((item, index) =>
                            index === existingProductIndex
                                ? { ...item, quantity: item.quantity + (product.quantity || 1) }
                                : item
                        ),
                    };
                } else {
                    return { cart: [...state.cart, { ...product, quantity: product.quantity || 1, selectedSize: product.selectedSize, selectedColor: product.selectedColor }] };
                }

            }),
            removeFromCart: (product) => 
                set((state) => ({ 
                    cart: state.cart.filter(
                        (p) => 
                            !(
                                p.id === product.id && 
                                p.selectedSize === product.selectedSize && 
                                p.selectedColor === product.selectedColor
                            )
                        ) 
                    })),
            clearCart: () => set({ cart: [] }),
            setShippingForm: (data) => set({ shippingForm: data }),
        }),
        {
            name: "cart",
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.hasHydrated = true;
                }
            },
        }
    )
)

export default useCartStore