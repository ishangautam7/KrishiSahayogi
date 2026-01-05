'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import apiClient from '@/lib/axios';
import { Calendar, ExternalLink, FileText, Bell } from 'lucide-react';
import Link from 'next/link';

interface Notice {
    type: string;
    title: string;
    link: string;
    date: string;
    is_subsidy: boolean;
    source?: string;
}

const NoticesPage = () => {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'all' | 'notice' | 'subsidy'>('all');

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const response = await apiClient.get('/notices');
                setNotices(response.data);
            } catch (error) {
                console.error("Failed to fetch notices:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotices();
    }, []);

    const filteredNotices = notices.filter(notice => {
        if (activeTab === 'all') return true;
        if (activeTab === 'notice') return !notice.is_subsidy;
        if (activeTab === 'subsidy') return notice.is_subsidy;
        return true;
    });



    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-green-800 dark:text-green-100 mb-4"
                    >
                        सूचना तथा अनुदान पाटी
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-green-700 dark:text-green-300 max-w-2xl mx-auto"
                    >
                        यहाँ कृषि सम्बन्धी नवीनतम सूचनाहरू र अनुदानका कार्यक्रमहरूको जानकारी पाउनुहोस्।
                    </motion.p>
                </header>

                <div className="flex justify-center mb-8">
                    <div className="bg-white dark:bg-green-800/50 p-1.5 rounded-full shadow-md flex space-x-2">
                        {[
                            { id: 'all', label: 'All', icon: Bell },
                            { id: 'notice', label: 'Notices', icon: FileText },
                            { id: 'subsidy', label: 'Subsidies', icon: Calendar }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`
                                    flex items-center space-x-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300
                                    ${activeTab === tab.id
                                        ? 'bg-green-600 text-white shadow-lg scale-105'
                                        : 'text-green-700 dark:text-green-200 hover:bg-green-100 dark:hover:bg-green-700/50'}
                                `}
                            >
                                <tab.icon size={16} />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white dark:bg-green-800/30 rounded-2xl p-6 h-48 animate-pulse border border-green-100 dark:border-green-700/50" />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filteredNotices.map((notice, index) => (
                            <motion.div
                                key={`${notice.title}-${index}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                className={`
                                    flex flex-col relative p-6 rounded-2xl border backdrop-blur-sm transition-colors duration-300 group h-full
                                    ${notice.is_subsidy
                                        ? 'bg-amber-50/80 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/50 hover:border-amber-400 dark:hover:border-amber-600'
                                        : 'bg-white/80 dark:bg-green-900/10 border-green-200 dark:border-green-800/50 hover:border-green-400 dark:hover:border-green-600'}
                                `}
                            >
                                <div className="absolute top-4 right-4">
                                    <span className={`
                                        px-3 py-1 rounded-full text-xs font-semibold
                                        ${notice.is_subsidy
                                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
                                            : 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'}
                                    `}>
                                        {notice.is_subsidy ? 'अनुदान' : 'सूचना'}
                                    </span>
                                </div>

                                <div className="mb-4 mt-2 flex-grow">
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 leading-tight">
                                        {notice.title}
                                    </h3>
                                </div>

                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4 space-x-4">
                                    <div className="flex items-center space-x-1.5">
                                        <Calendar size={14} />
                                        <span>{notice.date}</span>
                                    </div>
                                    {notice.source && (
                                        <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800">
                                            <span className="text-xs font-medium">{notice.source}</span>
                                        </div>
                                    )}
                                </div>

                                <Link
                                    href={notice.link}
                                    target="_blank"
                                    className={`
                                        inline-flex items-center space-x-2 text-sm font-semibold transition-colors mt-auto
                                        ${notice.is_subsidy
                                            ? 'text-amber-600 dark:text-amber-400 group-hover:text-amber-700 dark:group-hover:text-amber-300'
                                            : 'text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300'}
                                    `}
                                >
                                    <span>पूरा विवरण हेर्नुहोस्</span>
                                    <ExternalLink size={14} />
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default NoticesPage;
