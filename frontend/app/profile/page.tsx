"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { User, Phone, MapPin, Sprout, Briefcase, Save, AlertCircle, CheckCircle2 } from "lucide-react";
import { RootState } from "@/store/store";
import apiClient from "@/lib/axios";
import { setUser } from "@/store/slices/authSlice";

export default function ProfilePage() {
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        location: "",
        farmerType: "subsistence",
        primaryCrops: "",
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                phone: user.phone || "",
                location: user.location || "",
                farmerType: user.farmerType || "subsistence",
                primaryCrops: user.primaryCrops || "",
            });
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await apiClient.put("/user/profile", formData);
            if (response.data.success) {
                dispatch(setUser(response.data.user));
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="pt-32 flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600 font-bold uppercase tracking-widest text-xs">Loading Profile...</p>
            </div>
        );
    }

    return (
        <main className="pt-28 pb-20 bg-slate-50 dark:bg-gray-950 min-h-screen">
            <div className="max-w-4xl mx-auto px-4">
                <header className="mb-12 text-center lg:text-left">
                    <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-4">
                        My <span className="gradient-text">Profile</span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">Manage your farm identity and personal details.</p>
                </header>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Side: Photo/Quick Stats */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="glass rounded-[2.5rem] p-8 text-center shadow-xl border border-white/20">
                            <div className="relative inline-block mb-6">
                                <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white text-5xl font-black shadow-lg">
                                    {user.name.charAt(0)}
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-md border border-emerald-100 dark:border-emerald-900/50">
                                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white truncate">{user.name}</h2>
                            <p className="text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-widest mb-6">Verified Farmer</p>

                            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 space-y-4 text-left">
                                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                    <Briefcase className="w-4 h-4 text-emerald-500" />
                                    <span className="capitalize font-medium">{user.farmerType} Farmer</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                    <MapPin className="w-4 h-4 text-emerald-500" />
                                    <span className="font-medium">{user.location}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Edit Form */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass rounded-[2.5rem] p-8 sm:p-10 shadow-xl border border-white/20"
                        >
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-2">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 w-5 h-5" />
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full pl-12 pr-4 py-4 bg-gray-50/50 dark:bg-gray-900/50 border border-transparent focus:border-emerald-500 rounded-2xl text-sm transition-all focus:ring-4 focus:ring-emerald-500/10"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-2">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 w-5 h-5" />
                                            <input
                                                type="text"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full pl-12 pr-4 py-4 bg-gray-50/50 dark:bg-gray-900/50 border border-transparent focus:border-emerald-500 rounded-2xl text-sm transition-all focus:ring-4 focus:ring-emerald-500/10"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-2">Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 w-5 h-5" />
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50/50 dark:bg-gray-900/50 border border-transparent focus:border-emerald-500 rounded-2xl text-sm transition-all focus:ring-4 focus:ring-emerald-500/10"
                                        />
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-2">Farmer Type</label>
                                        <select
                                            value={formData.farmerType}
                                            onChange={(e) => setFormData({ ...formData, farmerType: e.target.value })}
                                            className="w-full px-4 py-4 bg-gray-50/50 dark:bg-gray-900/50 border border-transparent focus:border-emerald-500 rounded-2xl text-sm transition-all focus:ring-4 focus:ring-emerald-500/10"
                                        >
                                            <option value="subsistence">Subsistence</option>
                                            <option value="commercial">Commercial</option>
                                            <option value="hobbyist">Hobbyist</option>
                                            <option value="student">Student</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-2">Primary Crops</label>
                                        <div className="relative">
                                            <Sprout className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 w-5 h-5" />
                                            <input
                                                type="text"
                                                value={formData.primaryCrops}
                                                onChange={(e) => setFormData({ ...formData, primaryCrops: e.target.value })}
                                                placeholder="e.g. Rice, Wheat, Veggies"
                                                className="w-full pl-12 pr-4 py-4 bg-gray-50/50 dark:bg-gray-900/50 border border-transparent focus:border-emerald-500 rounded-2xl text-sm transition-all focus:ring-4 focus:ring-emerald-500/10"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                        ) : (
                                            <Save className="w-5 h-5" />
                                        )}
                                        {loading ? "Saving Changes..." : "Update Profile"}
                                    </button>

                                    {success && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="flex items-center gap-2 text-emerald-600 font-bold text-sm"
                                        >
                                            <CheckCircle2 className="w-5 h-5" />
                                            Profile updated successfully!
                                        </motion.div>
                                    )}

                                    {error && (
                                        <div className="flex items-center gap-2 text-red-500 font-bold text-sm">
                                            <AlertCircle className="w-5 h-5" />
                                            {error}
                                        </div>
                                    )}
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>
        </main>
    );
}
