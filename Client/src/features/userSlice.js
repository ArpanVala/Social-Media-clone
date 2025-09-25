import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import api from '../api/axios.js';
import toast from 'react-hot-toast';

const initialState = {
    value: null
}

//get user details
export const fetchUser = createAsyncThunk('user/fetch-user', async(token)=>{
    const {data} = await api.get('/api/user/data',{
        headers:{ Authorization: `Bearer ${token}` }
    })
    return data.success ? data.user : null;
})

//update User details
export const updateUser = createAsyncThunk('user/update-user', async({userData, token})=>{
    const {data} = await api.post('/api/user/update', userData, {
        headers:{ Authorization: `Bearer ${token}` }
    })

    if(data.success){
        toast.success(data.message);
        return data.user;
    }
    else
    {
        toast.error(data.message);
        return null;
    }
})

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchUser.fulfilled, (state, action) => {
            state.value = action.payload;
        })
        .addCase(updateUser.fulfilled, (state, action) => {
            state.value = action.payload;
        })
    }
});

export default userSlice.reducer;