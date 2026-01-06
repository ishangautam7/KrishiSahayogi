import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Send, X, MoreVertical, Phone, Star } from 'lucide-react';
import { AppDispatch, RootState } from '@/store/store';
import { fetchConversation, sendMessage } from '@/store/slices/messageSlice';

interface ChatWindowProps {
    recipientId: string;
    recipientName: string;
    recipientAvatar?: string;
    onClose: () => void;
    currentUserId: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ recipientId, recipientName, recipientAvatar, onClose, currentUserId }) => {
    const dispatch = useDispatch<AppDispatch>();
    const messages = useSelector((state: RootState) => state.messages.conversations[recipientId] || []);
    const { isLoading } = useSelector((state: RootState) => state.messages);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        dispatch(fetchConversation(recipientId));
    }, [dispatch, recipientId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await dispatch(sendMessage({ receiver: recipientId, text: newMessage })).unwrap();
            // Optimistic update handled by socket or slice if needed, but slice handles fulfilled.
            setNewMessage('');
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white z-10">
                <div className="flex items-center gap-3">
                    <img
                        src={recipientAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(recipientName)}&background=random`}
                        alt={recipientName}
                        className="w-10 h-10 rounded-full border border-gray-200"
                    />
                    <div>
                        <h3 className="font-bold text-gray-800">{recipientName}</h3>
                        <span className="text-xs text-green-600 flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                            Online
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                        <Phone size={20} />
                    </button>
                    <button onClick={onClose} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full text-gray-500 transition-colors">
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                {isLoading && messages.length === 0 ? (
                    <div className="flex justify-center items-center h-full text-gray-400">Loading conversation...</div>
                ) : (
                    messages.map((msg, index) => {
                        const senderId = typeof msg.sender === 'object' ? (msg.sender as any)._id : msg.sender;
                        const isMe = senderId === currentUserId;
                        const messageDate = new Date(msg.createdAt || Date.now());
                        const showDateSeparator = index === 0 ||
                            new Date(messages[index - 1].createdAt).toDateString() !== messageDate.toDateString();

                        return (
                            <React.Fragment key={msg._id || index}>
                                {showDateSeparator && (
                                    <div className="flex justify-center my-4">
                                        <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            {messageDate.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                )}
                                <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <div
                                        className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm ${isMe
                                            ? 'bg-green-600 text-white rounded-br-none'
                                            : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                                            }`}
                                    >
                                        <p className="text-sm leading-relaxed">{msg.text}</p>
                                        <span className={`text-[10px] mt-1 block font-medium opacity-80 ${isMe ? 'text-green-100 text-right' : 'text-gray-400'}`}>
                                            {messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            </React.Fragment>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-100 bg-white">
                <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-full border border-gray-200 focus-within:ring-2 focus-within:ring-green-500/20 focus-within:border-green-500 transition-all">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-transparent px-4 py-2 focus:outline-none text-sm text-gray-700 placeholder-gray-400"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatWindow;
