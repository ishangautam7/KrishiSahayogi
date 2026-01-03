"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "@/store/slices/authSlice";
import { AppDispatch, RootState } from "@/store/store";
import { connectSocket, disconnectSocket, socket } from "@/lib/socket";
import { addLocalMessage } from "@/store/slices/messageSlice";

export default function AuthLoader({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch<AppDispatch>();
    const { user, isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        dispatch(loadUser());
    }, [dispatch]);

    useEffect(() => {
        if (isAuthenticated && user) {
            connectSocket(user._id);

            socket.on("newMessage", (message) => {
                console.log("New message received via socket:", message);
                dispatch(addLocalMessage({ message, currentUserId: user._id }));
            });

            return () => {
                socket.off("newMessage");
            };
        } else {
            disconnectSocket();
        }
    }, [isAuthenticated, user, dispatch]);

    if (isLoading && !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-bold animate-pulse">Krishi Sahayogi...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
