import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    feed:null
}

const feedSlice = createSlice({
    name:'feed',
    initialState:initialState,
    reducers:{
        addFeed:(state,action) => {
            state.feed = action.payload
        },
        removeFeed:(state,action) => {
            state.feed = state.feed.filter((user) => user._id !== action.payload)
        },
        removeAllFeed:(state,action) => {
            state.feed = null;
        }
    }
})

export const {addFeed, removeFeed,removeAllFeed} = feedSlice.actions;
export default feedSlice.reducer;
