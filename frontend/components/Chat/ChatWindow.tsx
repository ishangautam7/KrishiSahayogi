"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { fetchConversation, sendMessage as sendMessageAction } from "@/store/slices/messageSlice";
import { X, Send, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatWindowProps {
    otherUser: {
        _id: string;
        name: string;
    };
    onClose: () => void;
}

export default function ChatWindow({ otherUser, onClose }: ChatWindowProps) {
    const [text, setText] = useState("");
    const dispatch = useDispatch<AppDispatch>();
    const messages = useSelector((state: RootState) => state.messages.conversations[otherUser._id] || []);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        dispatch(fetchConversation(otherUser._id));
    }, [dispatch, otherUser._id]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;
        dispatch(sendMessageAction({ receiver: otherUser._id, text }));
        setText("");
    };

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-4 right-4 w-80 md:w-96 h-[500px] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-emerald-500/20 flex flex-col z-[60] overflow-hidden"
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                        <User className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold leading-none">{otherUser.name}</h3>
                        <span className="text-[10px] opacity-80 uppercase tracking-widest font-bold">Online</span>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
                {messages.map((msg, i) => (
                    <div
                        key={msg._id || i}
                        className={`flex ${msg.sender === otherUser._id ? "justify-start" : "justify-end"}`}
                    >
                        <div
                            className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === otherUser._id
                                    ? "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                                    : "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                                }`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
                <div ref={scrollRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 flex gap-2">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
                <button
                    type="submit"
                    disabled={!text.trim()}
                    className="p-2.5 bg-emerald-500 text-white rounded-xl shadow-lg hover:bg-emerald-600 disabled:opacity-50 disabled:hover:bg-emerald-500 transition-all"
                >
                    <Send className="w-5 h-5" />
                </button>
            </form>
        </motion.div>
    );
}
