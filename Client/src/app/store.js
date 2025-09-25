import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../features/userSlice.js'
import messageReducer from '../features/messageSlice.js'
import connectionReducer from '../features/connectionSlice.js'

const store = configureStore({
    reducer:{
        user: userReducer,
        messages: messageReducer,
        connections: connectionReducer
    }
})

export default store;