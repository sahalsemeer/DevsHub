import { createSlice } from "@reduxjs/toolkit";


const initalState = {
    requests:null
}
const requestSlice = createSlice({
    name:'requests',
    initialState:initalState,
    reducers:{
        addRequest:(state,action) => {
            state.requests = action.payload;
        },
        removeRequest:(state,action) => {
            state.requests = state.requests.filter((connection) => connection._id !== action.payload);
        }

    }
})


export const {addRequest, removeRequest} = requestSlice.actions;

export default requestSlice.reducer;