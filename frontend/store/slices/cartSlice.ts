import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
    _id: string;
    title: string;
    price: number;
    image: string;
    quantity: number;
    category: string;
}

interface CartState {
    items: CartItem[];
    totalAmount: number;
    totalQuantity: number;
}

const initialState: CartState = {
    items: [],
    totalAmount: 0,
    totalQuantity: 0,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
            const newItem = action.payload;
            const existingItem = state.items.find(item => item._id === newItem._id);
            state.totalQuantity++;
            if (!existingItem) {
                state.items.push({ ...newItem, quantity: 1 });
            } else {
                existingItem.quantity++;
            }
            state.totalAmount += newItem.price;
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            const id = action.payload;
            const existingItem = state.items.find(item => item._id === id);
            if (existingItem) {
                state.totalQuantity--;
                state.totalAmount -= existingItem.price;
                if (existingItem.quantity === 1) {
                    state.items = state.items.filter(item => item._id !== id);
                } else {
                    existingItem.quantity--;
                }
            }
        },
        clearCart: (state) => {
            state.items = [];
            state.totalAmount = 0;
            state.totalQuantity = 0;
        },
    },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
