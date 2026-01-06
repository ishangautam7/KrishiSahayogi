import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Image,
    StatusBar,
} from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { api } from '@/lib/api';
import { useAppSelector } from '@/store/hooks';

interface Message {
    _id: string;
    sender: { _id: string; name: string; avatar?: string };
    text: string;
    createdAt: string;
}

export default function ChatScreen() {
    const { id } = useLocalSearchParams(); // Receiver ID
    const { user } = useAppSelector(state => state.auth);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const flatListRef = useRef<FlatList>(null);
    const [receiverName, setReceiverName] = useState('Chat');

    useEffect(() => {
        loadMessages();
        loadReceiverInfo();

        // Poll for new messages every 15 seconds (reduced from 3s to avoid excessive API calls)
        const interval = setInterval(loadMessages, 5000);
        return () => clearInterval(interval);
    }, [id]);

    const loadReceiverInfo = async () => {
        try {
            const res = await api.getUserProfile(id as string);
            if (res.data.success) {
                setReceiverName(res.data.data.name);
            }
        } catch (error) {
            console.log("Failed to load user info");
        }
    };

    const loadMessages = async () => {
        try {
            const res = await api.getMessages(id as string);
            // Fix: API returns { success: true, count: number, messages: Message[] }
            if (res.data.success && Array.isArray(res.data.messages)) {
                setMessages(res.data.messages);
            } else if (Array.isArray(res.data)) {
                // Fallback if API structure changes
                setMessages(res.data);
            } else {
                console.log("Unexpected response format:", res.data);
                setMessages([]);
            }
            setLoading(false);
        } catch (error) {
            console.log("Failed to load messages");
            setLoading(false);
        }
    };

    const handleSend = async () => {
        if (!newMessage.trim()) return;

        const tempMsg: Message = {
            _id: Date.now().toString(),
            sender: { _id: user?._id || '', name: user?.name || '' },
            text: newMessage,
            createdAt: new Date().toISOString(),
        };

        // Optimistic update
        // Use functional state update with array check
        setMessages(prev => {
            const currentMessages = Array.isArray(prev) ? prev : [];
            return [...currentMessages, tempMsg];
        });
        setNewMessage('');
        setSending(true);

        try {
            await api.sendMessage({
                receiver: id as string,
                text: tempMsg.text
            });
            loadMessages(); // Refresh to get real ID
        } catch (error) {
            console.error(error);
            // Revert on failure (simplified)
        } finally {
            setSending(false);
        }
    };

    const renderMessage = ({ item }: { item: Message }) => {
        // Ensure robust check for sender ID
        // Handles if sender is populated object or just ID string (fallback)
        const senderId = typeof item.sender === 'object' ? item.sender._id : item.sender;
        const isMe = senderId === user?._id;
        const senderName = typeof item.sender === 'object' && item.sender?.name ? item.sender.name : 'Unknown';

        return (
            <View style={[
                styles.messageRow,
                isMe ? styles.myMessageRow : styles.theirMessageRow
            ]}>
                {!isMe && (
                    <View style={styles.avatar}>
                        <Ionicons name="person" size={12} color="#fff" />
                    </View>
                )}
                <View style={styles.messageContent}>
                    {!isMe && (
                        <Text style={styles.senderName}>{senderName}</Text>
                    )}
                    <View style={[
                        styles.messageBubble,
                        isMe ? styles.myMessage : styles.theirMessage
                    ]}>
                        <Text style={[
                            styles.messageText,
                            isMe ? styles.myMessageText : styles.theirMessageText
                        ]}>{item.text}</Text>
                    </View>
                    <Text style={[
                        styles.timestamp,
                        isMe ? styles.myTimestamp : styles.theirTimestamp
                    ]}>
                        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1f2937" />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <Text style={styles.headerTitle}>{receiverName}</Text>
                    <View style={styles.statusIndicator}>
                        <View style={styles.onlineDot} />
                        <Text style={styles.statusText}>Online</Text>
                    </View>
                </View>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#10b981" />
                </View>
            ) : (
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={item => item._id}
                    contentContainerStyle={styles.messageList}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
                />
            )}

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="Type a message..."
                            placeholderTextColor="#9ca3af"
                            value={newMessage}
                            onChangeText={setNewMessage}
                            multiline
                            maxLength={500}
                        />
                        {newMessage.length > 0 && (
                            <Text style={styles.charCount}>{newMessage.length}/500</Text>
                        )}
                    </View>
                    <TouchableOpacity
                        style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
                        onPress={handleSend}
                        disabled={!newMessage.trim()}
                    >
                        <Ionicons name="send" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f4f6',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 16,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    backButton: {
        padding: 8,
        marginRight: 12,
    },
    headerInfo: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    statusIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    onlineDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#10b981',
    },
    statusText: {
        fontSize: 12,
        color: '#6b7280',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    messageList: {
        padding: 16,
    },
    messageRow: {
        flexDirection: 'row',
        marginBottom: 12,
        paddingHorizontal: 4,
    },
    myMessageRow: {
        justifyContent: 'flex-end',
    },
    theirMessageRow: {
        justifyContent: 'flex-start',
    },
    avatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#d1d5db',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    messageContent: {
        maxWidth: '75%',
    },
    senderName: {
        fontSize: 11,
        fontWeight: '600',
        color: '#6b7280',
        marginLeft: 4,
        marginBottom: 2,
    },
    messageBubble: {
        padding: 12,
        borderRadius: 20,
        elevation: 1,
    },
    myMessage: {
        backgroundColor: '#10b981',
        borderBottomRightRadius: 4,
    },
    theirMessage: {
        backgroundColor: '#fff',
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
    },
    myMessageText: {
        color: '#fff',
    },
    theirMessageText: {
        color: '#1f2937',
    },
    timestamp: {
        fontSize: 10,
        marginTop: 2,
        paddingHorizontal: 4,
    },
    myTimestamp: {
        color: '#6b7280',
        textAlign: 'right',
    },
    theirTimestamp: {
        color: '#9ca3af',
        textAlign: 'left',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        gap: 12,
    },
    inputWrapper: {
        flex: 1,
        position: 'relative',
    },
    input: {
        flex: 1,
        backgroundColor: '#f3f4f6',
        borderRadius: 24,
        paddingHorizontal: 20,
        paddingVertical: 12,
        maxHeight: 100,
        fontSize: 16,
        color: '#1f2937',
    },
    charCount: {
        position: 'absolute',
        right: 12,
        bottom: 8,
        fontSize: 10,
        color: '#9ca3af',
        backgroundColor: '#f3f4f6',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    sendButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#10b981',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#d1d5db',
    },
});
