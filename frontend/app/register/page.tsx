"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { User, Mail, Lock, Phone, MapPin, Sprout, Briefcase, ArrowRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "@/store/slices/authSlice";
import { RootState, AppDispatch } from "@/store/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        location: "",
        farmerType: "subsistence",
        primaryCrops: "",
    });

    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { isLoading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            router.push("/");
        }
    }, [isAuthenticated, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(registerUser(formData));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <main className="min-h-screen pt-32 pb-20 px-4 relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-200/10 dark:bg-emerald-900/10 rounded-full blur-[120px] -z-10 animate-pulse-soft"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-green-200/10 dark:bg-green-900/10 rounded-full blur-[100px] -z-10"></div>

            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass p-8 sm:p-12 rounded-[3rem] shadow-2xl"
                >
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">Join the Future of Farming</h1>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">Create your profile and connect with a community of modern farmers.</p>
                    </div>

                    {error && (
                        <div className="mb-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-bold animate-shake text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
                        {/* Left Column: Basic Info */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                                <User className="w-5 h-5" /> Basic Information
                            </h2>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl py-4 pl-12 pr-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium"
                                        placeholder="Enter your name"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl py-4 pl-12 pr-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium"
                                        placeholder="farmer@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl py-4 pl-12 pr-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium"
                                        placeholder="Create a secure password"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Phone Number</label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl py-4 pl-12 pr-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium"
                                        placeholder="+977-9800000000"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Farming Details */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                                <Sprout className="w-5 h-5" /> Farming Profile
                            </h2>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Location (District/Municipality)</label>
                                <div className="relative group">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl py-4 pl-12 pr-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium"
                                        placeholder="e.g. Kathmandu, Kirtipur"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Farmer Type</label>
                                <div className="relative group">
                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                    <select
                                        name="farmerType"
                                        value={formData.farmerType}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl py-4 pl-12 pr-10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium appearance-none"
                                        required
                                    >
                                        <option value="subsistence">Subsistence Farmer</option>
                                        <option value="commercial">Commercial Farmer</option>
                                        <option value="hobbyist">Hobbyist/Home Gardener</option>
                                        <option value="student">Agricultural Student</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Primary Crops & Products</label>
                                <div className="relative group">
                                    <Sprout className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                    <input
                                        type="text"
                                        name="primaryCrops"
                                        value={formData.primaryCrops}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl py-4 pl-12 pr-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium"
                                        placeholder="e.g. Rice, Maize, Vegetables"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-2xl shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
                                >
                                    {isLoading ? "Creating Account..." : "Create Account"}
                                    {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                                </button>
                            </div>
                        </div>
                    </form>

                    <div className="mt-12 text-center">
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Already have an account?{" "}
                            <Link href="/login" className="font-bold text-emerald-600 hover:text-emerald-500 transition-colors ml-1">
                                Sign In here
                            </Link>
                        </p>
                    </div>
                </motion.div>

                {/* Legal Stuff */}
                <p className="mt-8 text-center text-xs text-gray-500 dark:text-gray-500 px-6 leading-relaxed">
                    By creating an account, you agree to Krishi Sahayogi&apos;s <Link href="#" className="underline">Terms of Service</Link> and <Link href="#" className="underline">Privacy Policy</Link>. We will use your location to provide personalized agricultural recommendations.
                </p>
            </div>
        </main>

    );
}
