"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, MapPin, MessageCircle, User as UserIcon, Search, Filter, Sprout } from "lucide-react";
import apiClient from "@/lib/axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import ChatWindow from "@/components/Chat/ChatWindow";

interface Farmer {
    _id: string;
    name: string;
    farmerType: string;
    location: string;
    primaryCrops?: string[];
}

export default function FarmerNetwork() {
    const [farmers, setFarmers] = useState<Farmer[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeChat, setActiveChat] = useState<Farmer | null>(null);
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        const fetchFarmers = async () => {
            try {
                const endpoint = isAuthenticated ? "/user/nearby" : "/user";
                const response = await apiClient.get(endpoint);
                setFarmers(response.data.farmers);
            } catch (error) {
                console.error("Failed to fetch farmers", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFarmers();
    }, [isAuthenticated]);

    return (
        <div className="pt-24 pb-12 min-h-screen bg-slate-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-green-700 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl mb-12">
                    <div className="relative z-10 max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl text-sm font-bold mb-6"
                        >
                            <Users className="w-4 h-4" />
                            Community Network
                        </motion.div>
                        <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                            Connect with {isAuthenticated ? "Nearby" : "Expert"} Farmers
                        </h1>
                        <p className="text-emerald-50 text-lg md:text-xl opacity-90 leading-relaxed">
                            Grow together by sharing experiences, trading insights, and building a stronger local agricultural community.
                        </p>
                    </div>
                    <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block opacity-20">
                        <Users className="w-full h-full p-12" />
                    </div>
                </div>

                {/* Discovery Section */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Filters Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="glass rounded-[2rem] p-6 sticky top-24 shadow-xl border border-white/20">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Filter className="w-5 h-5 text-emerald-500" />
                                Find Farmers
                            </h2>
                            <div className="space-y-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Search by name..."
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2">Farmer Type</label>
                                    <select className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
                                        <option>All Types</option>
                                        <option>Organic</option>
                                        <option>Livestock</option>
                                        <option>Commercial</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Farmer Cards Grid */}
                    <div className="lg:col-span-3">
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : farmers.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {farmers.map((farmer) => (
                                    <motion.div
                                        key={farmer._id}
                                        layout
                                        whileHover={{ y: -5 }}
                                        className="glass rounded-[2rem] p-6 shadow-xl border border-white/20 group hover:shadow-2xl transition-all duration-300"
                                    >
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center group-hover:bg-emerald-500 transition-colors duration-300">
                                                <UserIcon className="w-7 h-7 text-emerald-600 group-hover:text-white" />
                                            </div>
                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/40 rounded-full text-[10px] font-black uppercase tracking-tighter text-emerald-600">
                                                <MapPin className="w-3 h-3" />
                                                {farmer.location}
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-bold mb-2 group-hover:text-emerald-600 transition-colors">
                                            {farmer.name}
                                        </h3>

                                        <div className="flex flex-wrap gap-2 mb-6 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                                <Sprout className="w-3 h-3 text-emerald-500" />
                                                {farmer.farmerType}
                                            </span>
                                        </div>

                                        <button
                                            onClick={() => setActiveChat(farmer)}
                                            className="w-full py-4 bg-gray-50 dark:bg-gray-800 hover:bg-emerald-500 hover:text-white text-gray-700 dark:text-gray-200 font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                                        >
                                            <MessageCircle className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                                            Chat Now
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 glass rounded-[3rem]">
                                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-gray-400">No Farmers Found</h3>
                                <p className="text-gray-500">Be the first to connect in this area!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Chat Integration */}
            <AnimatePresence>
                {activeChat && (
                    <ChatWindow
                        otherUser={{ _id: activeChat._id, name: activeChat.name }}
                        onClose={() => setActiveChat(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
