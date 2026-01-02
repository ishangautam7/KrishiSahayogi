"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "@/store/slices/authSlice";
import { AppDispatch, RootState } from "@/store/store";
import { connectSocket, disconnectSocket, socket } from "@/lib/socket";
import { addLocalMessage } from "@/store/slices/messageSlice";

export default function AuthLoader({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch<AppDispatch>();
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        dispatch(loadUser());
    }, [dispatch]);

    useEffect(() => {
        if (isAuthenticated && user) {
            connectSocket(user.id);

            socket.on("newMessage", (message) => {
                dispatch(addLocalMessage(message));
            });

            return () => {
                socket.off("newMessage");
            };
        } else {
            disconnectSocket();
        }
    }, [isAuthenticated, user, dispatch]);

    return <>{children}</>;
}
