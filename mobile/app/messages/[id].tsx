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
import { useLocalSearchParams, router } from 'expo-router';
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

        // Poll for new messages every 3 seconds (simple implementation)
        const interval = setInterval(loadMessages, 3000);
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
            setMessages(res.data);
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
        setMessages(prev => [...prev, tempMsg]);
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
        const isMe = item.sender._id === user?._id;

        return (
            <View style={[
                styles.messageContainer,
                isMe ? styles.myMessageContainer : styles.theirMessageContainer
            ]}>
                {!isMe && (
                    <View style={styles.avatar}>
                        <Ionicons name="person" size={12} color="#fff" />
                    </View>
                )}
                <View style={[
                    styles.messageBubble,
                    isMe ? styles.myMessage : styles.theirMessage
                ]}>
                    <Text style={[
                        styles.messageText,
                        isMe ? styles.myMessageText : styles.theirMessageText
                    ]}>{item.text}</Text>
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
                    <TextInput
                        style={styles.input}
                        placeholder="Type a message..."
                        value={newMessage}
                        onChangeText={setNewMessage}
                        multiline
                    />
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
        gap: 16,
    },
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 8,
        marginBottom: 4,
    },
    myMessageContainer: {
        flexDirection: 'row-reverse',
    },
    theirMessageContainer: {
        flexDirection: 'row',
    },
    avatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#d1d5db',
        justifyContent: 'center',
        alignItems: 'center',
    },
    messageBubble: {
        maxWidth: '75%',
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
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    myTimestamp: {
        color: 'rgba(255,255,255,0.7)',
    },
    theirTimestamp: {
        color: '#9ca3af',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        gap: 12,
    },
    input: {
        flex: 1,
        backgroundColor: '#f3f4f6',
        borderRadius: 24,
        paddingHorizontal: 20,
        paddingVertical: 12,
        maxHeight: 100,
        fontSize: 16,
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
