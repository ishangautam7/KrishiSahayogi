"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, MapPin, MessageCircle, User as UserIcon, Search, Filter, Sprout } from "lucide-react";
import apiClient from "@/lib/axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import ChatWindow from "@/components/Chat/ChatWindow";
import { useLanguage } from "@/context/LanguageContext";

interface Farmer {
    _id: string;
    name: string;
    farmerType: string;
    location: string;
    primaryCrops?: string[] | string;
}

export default function FarmerNetwork() {
    const [farmers, setFarmers] = useState<Farmer[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeChat, setActiveChat] = useState<Farmer | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [locationQuery, setLocationQuery] = useState("");
    const [selectedType, setSelectedType] = useState("All");

    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const { t } = useLanguage();

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

    const filteredFarmers = farmers.filter(farmer => {
        const matchesSearch = farmer.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLocation = farmer.location.toLowerCase().includes(locationQuery.toLowerCase());
        const matchesType = selectedType === "All" || farmer.farmerType.toLowerCase() === selectedType.toLowerCase();
        return matchesSearch && matchesLocation && matchesType;
    });

    return (
        <div className="pt-24 pb-12 min-h-screen bg-slate-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-500 to-green-600 rounded-[3rem] p-8 md:p-16 text-white shadow-2xl mb-12 border border-white/20">
                    <div className="relative z-10 max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-2xl text-sm font-black uppercase tracking-widest mb-8 border border-white/20"
                        >
                            <Users className="w-4 h-4" />
                            {t("network_header_badge")}
                        </motion.div>
                        <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tight">
                            {t("network_header_title")}
                        </h1>
                        <p className="text-emerald-50/90 text-lg md:text-xl font-medium leading-relaxed max-w-xl">
                            {t("network_header_subtitle")}
                        </p>
                    </div>
                    {/* Decorative Blobs */}
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-400/20 rounded-full blur-2xl"></div>
                </div>

                {/* Discovery Section */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                    {/* Filters Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="glass rounded-[2.5rem] p-8 sticky top-28 shadow-2xl border border-white/20 space-y-8">
                            <div>
                                <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                                    <Filter className="w-6 h-6 text-emerald-500" />
                                    {t("network_discovery_title")}
                                </h2>

                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-2">{t("network_search_label")}</label>
                                        <div className="relative group">
                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 w-5 h-5 transition-colors" />
                                            <input
                                                type="text"
                                                placeholder={t("network_search_placeholder")}
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border border-transparent focus:border-emerald-500 rounded-[1.25rem] text-sm font-medium transition-all shadow-inner focus:ring-4 focus:ring-emerald-500/10"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-2">Filter by Location</label>
                                        <div className="relative group">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 w-5 h-5 transition-colors" />
                                            <input
                                                type="text"
                                                placeholder="Enter location..."
                                                value={locationQuery}
                                                onChange={(e) => setLocationQuery(e.target.value)}
                                                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border border-transparent focus:border-emerald-500 rounded-[1.25rem] text-sm font-medium transition-all shadow-inner focus:ring-4 focus:ring-emerald-500/10"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-2">{t("network_category_label")}</label>
                                        <div className="grid grid-cols-1 gap-2">
                                            {["All", "Subsistence", "Commercial", "Hobbyist", "Student"].map((type) => (
                                                <button
                                                    key={type}
                                                    onClick={() => setSelectedType(type)}
                                                    className={`px-4 py-3 rounded-xl text-sm font-bold transition-all text-left flex items-center justify-between group ${selectedType === type ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-gray-600 dark:text-gray-400"}`}
                                                >
                                                    {t(`cat_${type.toLowerCase()}` as any)}
                                                    <div className={`w-1.5 h-1.5 rounded-full bg-white transition-opacity ${selectedType === type ? "opacity-100" : "opacity-0 group-hover:opacity-30"}`}></div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Farmer Cards Grid */}
                    <div className="lg:col-span-3 space-y-8">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-32 glass rounded-[3rem]">
                                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="text-gray-500 font-black uppercase tracking-widest text-xs">{t("network_syncing")}</p>
                            </div>
                        ) : filteredFarmers.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {filteredFarmers.map((farmer) => (
                                    <motion.div
                                        key={farmer._id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        whileHover={{ y: -8 }}
                                        className="glass rounded-[3rem] p-8 shadow-xl border border-white/20 group hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
                                    >
                                        {/* Background accent */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-colors"></div>

                                        <div className="flex items-center gap-6 mb-8 relative z-10">
                                            <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-green-50 dark:from-emerald-900/40 dark:to-gray-800 rounded-[1.5rem] flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                                                <UserIcon className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="text-xl font-black text-gray-900 dark:text-white">
                                                        {farmer.name}
                                                    </h3>
                                                    {isAuthenticated && <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>}
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                                                    <MapPin className="w-3 h-3 text-emerald-500" />
                                                    {farmer.location}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6 relative z-10">
                                            <div className="flex flex-wrap gap-2">
                                                <span className="px-4 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-wider">
                                                    {t(`cat_${farmer.farmerType.toLowerCase()}` as any)}
                                                </span>
                                                {farmer.primaryCrops && (Array.isArray(farmer.primaryCrops) ? farmer.primaryCrops : [farmer.primaryCrops]).slice(0, 3).map((crop, i) => (
                                                    <span key={i} className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl text-[10px] font-bold">
                                                        {crop}
                                                    </span>
                                                ))}
                                            </div>

                                            <button
                                                onClick={() => setActiveChat(farmer)}
                                                className="w-full py-4 bg-gradient-to-r from-gray-900 to-black dark:from-white dark:to-emerald-50 text-white dark:text-black font-black rounded-[1.25rem] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group/btn"
                                            >
                                                <MessageCircle className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                                                {t("network_start_conversation")}
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-32 glass rounded-[4rem] border border-dashed border-gray-200 dark:border-gray-800">
                                <Users className="w-24 h-24 text-gray-200 dark:text-gray-800 mx-auto mb-8" />
                                <h3 className="text-3xl font-black text-gray-400 mb-4 tracking-tight">{t("network_no_farmers")}</h3>
                                <p className="text-gray-500 font-medium text-lg">{t("network_no_farmers_subtitle")}</p>
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
