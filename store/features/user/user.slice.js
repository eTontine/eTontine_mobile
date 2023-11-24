import { createSlice } from "@reduxjs/toolkit";


const initialState = { currentUser: null };

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (
            state,{ payload: { user } } ) => {
            state.currentUser = user;
        }
    },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;

