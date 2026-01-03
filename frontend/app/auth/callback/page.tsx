"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { loadUser } from "@/store/slices/authSlice";
import { AppDispatch } from "@/store/store";

export default function AuthCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const handleCallback = async () => {
            // Check if there's an error from OAuth
            const error = searchParams?.get("error");

            if (error) {
                // OAuth failed, redirect to login with error
                router.push(`/login?error=${error}`);
                return;
            }

            // OAuth successful - cookies are already set by backend
            // Load user data to update Redux store
            try {
                await dispatch(loadUser()).unwrap();
                // Redirect to home page
                router.push("/");
            } catch (err) {
                // If loading user fails, redirect to login
                router.push("/login?error=auth_failed");
            }
        };

        handleCallback();
    }, [dispatch, router, searchParams]);

    return (
        <main className="min-h-screen flex items-center justify-center px-4 py-20">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Completing sign in...</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Please wait while we authenticate you</p>
            </div>
        </main>
    );
}
