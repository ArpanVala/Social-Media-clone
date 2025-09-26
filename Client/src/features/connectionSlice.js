import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import api from '../api/axios.js';
const initialState = {
    connections: [],
    pendingConnections: [],
    followers: [],
    following: []
}
//get conncetions
export const fetchConnections = createAsyncThunk('connection/fetch', async(token)=>{
   
        const {data} = await api.get('/api/user/connections', {
            headers: { Authorization: `Bearer ${token}` }
        })
        return data.success ? data : null;
        
    
})
const connectionSlice = createSlice({
    name: 'connection',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchConnections.fulfilled,(state, action) => {
            if(action.payload)
            {
            state.connections = action.payload.connections;
            state.pendingConnections = action.payload.pendingConnections;
            state.followers = action.payload.followers;
            state.following = action.payload.following;

            }
            
        })
    }
});

export default connectionSlice.reducer;