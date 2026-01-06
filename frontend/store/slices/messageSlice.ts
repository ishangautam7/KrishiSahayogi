import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiClient from '@/lib/axios';

interface Message {
    _id: string;
    sender: string | { _id: string; name: string; avatar?: string };
    receiver: string | { _id: string; name: string; avatar?: string };
    text: string;
    createdAt: string;
}

interface MessageState {
    conversations: { [userId: string]: Message[] };
    isLoading: boolean;
    error: string | null;
}

const initialState: MessageState = {
    conversations: {},
    isLoading: false,
    error: null,
};

export const fetchConversation = createAsyncThunk(
    'messages/fetchConversation',
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(`/message/${userId}`);
            return { userId, messages: response.data.messages };
        } catch (error: any) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch conversation');
        }
    }
);

export const sendMessage = createAsyncThunk(
    'messages/sendMessage',
    async ({ receiver, text }: { receiver: string; text: string }, { rejectWithValue }) => {
        try {
            const response = await apiClient.post('/message', { receiver, text });
            return response.data.data;
        } catch (error: any) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return rejectWithValue(error.response?.data?.message || 'Failed to send message');
        }
    }
);

const messageSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        clearMessageError: (state) => {
            state.error = null;
        },
        addLocalMessage: (state, action: PayloadAction<any>) => {
            let message: Message | null = null;
            let currentUserId: string | null = null;

            if (action.payload?.message && action.payload?.currentUserId) {
                // New format: { message, currentUserId }
                message = action.payload.message;
                currentUserId = action.payload.currentUserId;
            } else if (action.payload?.sender && action.payload?.receiver) {
                // Old format: direct message object
                message = action.payload;
                // Try to infer currentUserId if possible, or we might need to skip this part
                // but if it's the old format, we don't have currentUserId easily accessible here.
            }

            if (!message) {
                console.error("addLocalMessage: Could not extract message from payload", action.payload);
                return;
            }

            const sender = typeof message.sender === 'object' ? (message.sender as any)._id : message.sender;
            const receiver = typeof message.receiver === 'object' ? (message.receiver as any)._id : message.receiver;

            let otherUser: string | null = null;
            if (currentUserId) {
                otherUser = sender === currentUserId ? receiver : sender;
            } else {
                console.warn("addLocalMessage: currentUserId missing, skipping update.");
                return;
            }

            if (!otherUser) return;

            // Normalize message sender/receiver for store
            const normalizedMessage = {
                ...message,
                sender,
                receiver
            };

            if (!state.conversations[otherUser]) {
                state.conversations[otherUser] = [];
            }
            // Avoid duplicates just in case
            const exists = state.conversations[otherUser].some(m => m._id === normalizedMessage._id);
            if (!exists) {
                state.conversations[otherUser].push(normalizedMessage as Message);
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchConversation.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchConversation.fulfilled, (state, action) => {
                state.isLoading = false;
                // Normalize all messages to use string IDs for sender and receiver
                state.conversations[action.payload.userId] = action.payload.messages.map((m: any) => ({
                    ...m,
                    sender: typeof m.sender === 'object' ? m.sender._id : m.sender,
                    receiver: typeof m.receiver === 'object' ? m.receiver._id : m.receiver
                }));
            })
            .addCase(fetchConversation.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                const sender = typeof action.payload.sender === 'object' ? action.payload.sender._id : action.payload.sender;
                const receiver = typeof action.payload.receiver === 'object' ? action.payload.receiver._id : action.payload.receiver;

                if (!state.conversations[receiver]) {
                    state.conversations[receiver] = [];
                }

                const normalizedMessage = {
                    ...action.payload,
                    sender,
                    receiver
                };

                // Avoid duplicates in case socket already added it
                const exists = state.conversations[receiver].some(m => m._id === normalizedMessage._id);
                if (!exists) {
                    state.conversations[receiver].push(normalizedMessage as Message);
                }
            });
    },
});

export const { clearMessageError, addLocalMessage } = messageSlice.actions;
export default messageSlice.reducer;
