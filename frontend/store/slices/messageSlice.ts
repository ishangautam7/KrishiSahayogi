import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiClient from '@/lib/axios';

interface Message {
    _id: string;
    sender: string;
    receiver: string;
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
        addLocalMessage: (state, action: PayloadAction<Message>) => {
            const { sender, receiver } = action.payload;
            const otherUser = state.conversations[sender] ? sender : receiver;

            if (!state.conversations[otherUser]) {
                state.conversations[otherUser] = [];
            }
            state.conversations[otherUser].push(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchConversation.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchConversation.fulfilled, (state, action) => {
                state.isLoading = false;
                state.conversations[action.payload.userId] = action.payload.messages;
            })
            .addCase(fetchConversation.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                const { receiver } = action.payload;
                if (!state.conversations[receiver]) {
                    state.conversations[receiver] = [];
                }
                state.conversations[receiver].push(action.payload);
            });
    },
});

export const { clearMessageError, addLocalMessage } = messageSlice.actions;
export default messageSlice.reducer;
