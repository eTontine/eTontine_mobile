import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    type: "",
    message: ""
};

const alertSlice = createSlice({
    name: "alert",
    initialState,
    reducers: {
        setMessage: (state, action) => {
            return { message: action.payload.message, type: action.payload.type };
        },
        clearMessage: () => {
            return { message: "" , type: ""};
        },
    },
});

const { reducer, actions } = alertSlice;

export const { setMessage, clearMessage } = actions
export default reducer;
