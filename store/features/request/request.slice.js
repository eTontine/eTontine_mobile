import { createSlice } from "@reduxjs/toolkit";


const initialState = { requests: [] };

const requestSlice = createSlice({
    name: "historic",
    initialState,
    reducers: {
        setRequests: (
            state,{ payload: { requests } } ) => {
            state.requests = requests;
        }
    },
});

export const { setRequests } = requestSlice.actions;

export default requestSlice.reducer;
