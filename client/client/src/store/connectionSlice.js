import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    connections:null
}

const connectionSlice = createSlice({
    name:'connection',
    initialState:initialState,
    reducers:{
        addConnection:(state,action) => {
            state.connections = action.payload;
        },
        removeConnection:(state,action) => {
            state.connections = null;
        }
    }

})

export const {addConnection,removeConnection} = connectionSlice.actions;
export default connectionSlice.reducer;