import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import api from '../api/axios.js';

const initialState = {
    messages: []
}


export const fetchMessages = createAsyncThunk('messages/fetchMessages', async({token, userId}) => {
    const {data} = await api.post('/api/message/get', {to_user_id:userId}, {
        headers: {Authorization: `Bearer ${token}`}
    })
    if (!data || data.success !== true || !Array.isArray(data.messages)) {
        return { success: false, messages: [] };
    }
    return data;
})
const messageSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        addMessage: (state, action) => {
            state.messages = [...state.messages, action.payload];
        },
        resetMessages : (state) => {
            state.messages = []
        }

    },
    extraReducers: (builder) => {
        builder.addCase(fetchMessages.fulfilled, (state, action) => {
            state.messages = Array.isArray(action.payload?.messages) ? action.payload.messages : [];
        })
    }
});


export const {setMessages, addMessage, resetMessages} = messageSlice.actions;
export default messageSlice.reducer;