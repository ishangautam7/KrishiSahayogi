import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import messageReducer from "./slices/messageSlice";
import cartReducer from "./slices/cartSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        messages: messageReducer,
        cart: cartReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
