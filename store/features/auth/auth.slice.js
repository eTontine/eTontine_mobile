import { createSlice } from "@reduxjs/toolkit";
import { localStorage } from "../../../utils/localStorage";


const initialState = { accessToken: null , refreshToken: null, appLoading: true };

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (
            state,{ payload: { access, refresh  } } ) => {
            state.accessToken = access;
            state.refreshToken = refresh;
            state.appLoading = false;
        },
        logout: (state ) => {
            state.accessToken = null;
            state.refreshToken = null;
            state.appLoading = false;
            localStorage.removeItem('access-token')
            localStorage.removeItem('refresh-token')
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentToken = ((state) => state.auth.token)
