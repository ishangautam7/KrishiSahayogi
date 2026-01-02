"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, ShoppingBag, MapPin, Tag, Filter, CheckCircle2, ChevronRight, X } from "lucide-react";
import { useState, useEffect } from "react";
import apiClient from "@/lib/axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import ProductListingForm from "@/components/Marketplace/ProductListingForm";

interface Product {
    _id: string;
    title: string;
    description: string;
    price: number;
    location: string;
    category: string;
    image: string;
    owner: {
        _id: string;
        name: string;
        location: string;
    };
}

export default function Marketplace() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showListingForm, setShowListingForm] = useState(false);
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get("/product");
            setProducts(response.data.products);
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className="pt-24 pb-12 min-h-screen bg-slate-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-green-700 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl mb-12">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="max-w-xl">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl text-sm font-bold mb-6"
                            >
                                <ShoppingBag className="w-4 h-4" />
                                Direct from Farm
                            </motion.div>
                            <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                                Krishi Marketplace
                            </h1>
                            <p className="text-emerald-50 text-lg opacity-90 leading-relaxed italic border-l-4 border-emerald-300 pl-6 mb-8">
                                &quot;Direct connection between farmers and buyers. No middlemen, just fresh produce.&quot;
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <button
                                    onClick={() => setShowListingForm(true)}
                                    className="px-8 py-4 bg-white text-emerald-600 font-black rounded-2xl shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                                >
                                    <Plus className="w-5 h-5" />
                                    List Your Produce
                                </button>
                            </div>
                        </div>
                        <div className="relative group perspective-1000 hidden lg:block">
                            <div className="w-64 h-64 bg-white/10 backdrop-blur-xl rounded-[3rem] border border-white/30 flex items-center justify-center rotate-12 group-hover:rotate-0 transition-all duration-700">
                                <ShoppingBag className="w-32 h-32 opacity-20" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Discovery & Search */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1 space-y-6">
                        <div className="glass rounded-[2rem] p-6 sticky top-24 shadow-xl border border-white/20">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Filter className="w-5 h-5 text-emerald-500" />
                                Filters
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-2 mb-2 block">Search</label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder="Search produce..."
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-emerald-500 rounded-2xl text-sm transition-all shadow-inner"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-2 mb-2 block">Categories</label>
                                    <div className="space-y-2">
                                        {["All", "Vegetables", "Fruits", "Grains", "Seeds", "Tools"].map(cat => (
                                            <button key={cat} className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-sm font-medium transition-colors flex items-center justify-between group">
                                                {cat}
                                                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 glass rounded-[3rem]">
                                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Fetching Fresh Harvest...</p>
                            </div>
                        ) : products.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <motion.div
                                        key={product._id}
                                        layout
                                        whileHover={{ y: -8 }}
                                        className="glass rounded-[2.5rem] overflow-hidden shadow-xl border border-white/20 group cursor-pointer"
                                    >
                                        <div className="h-56 relative overflow-hidden bg-gray-200">
                                            <img
                                                src={product.image}
                                                alt={product.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute top-4 right-4 px-4 py-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl shadow-lg">
                                                <span className="text-lg font-black text-emerald-600">रू{product.price}</span>
                                                <span className="text-[10px] text-gray-400 ml-1 font-bold uppercase">/unit</span>
                                            </div>
                                            <div className="absolute top-4 left-4">
                                                <div className="px-3 py-1 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-tighter shadow-lg">
                                                    {product.category}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                                    <MapPin className="w-4 h-4 text-emerald-600" />
                                                </div>
                                                <span className="text-xs font-bold text-gray-500">{product.location}</span>
                                            </div>

                                            <h3 className="text-xl font-black mb-2 text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                                                {product.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-6 leading-relaxed">
                                                {product.description}
                                            </p>

                                            <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                                        <Plus className="w-5 h-5 text-gray-400" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-0.5">Seller</span>
                                                        <span className="text-sm font-black text-gray-700 dark:text-gray-200">{product.owner?.name}</span>
                                                    </div>
                                                </div>
                                                <button className="p-3 bg-emerald-500 text-white rounded-2xl shadow-lg hover:scale-110 transition-all">
                                                    <ShoppingBag className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 glass rounded-[3rem]">
                                <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                                <h3 className="text-2xl font-black text-gray-400">No produce listed yet</h3>
                                <p className="text-gray-500 mb-8 max-w-sm mx-auto">Be the first to list your fresh harvest on the Krishi Marketplace!</p>
                                <button
                                    onClick={() => setShowListingForm(true)}
                                    className="px-10 py-4 bg-emerald-500 text-white font-black rounded-2xl shadow-xl hover:scale-105 transition-all"
                                >
                                    Start Selling Now
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showListingForm && (
                    <ProductListingForm
                        onClose={() => setShowListingForm(false)}
                        onSuccess={() => {
                            fetchProducts();
                            // Add a toast or notification here if needed
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
