import { createSlice } from "@reduxjs/toolkit";
import { localStorage } from "../../../utils/localStorage";


const initialState = { historics: [] };

const historicSlice = createSlice({
    name: "historic",
    initialState,
    reducers: {
        setHistorics: (
            state,{ payload: { historics } } ) => {
            state.historics = historics;
        }
    },
});

export const { setHistorics } = historicSlice.actions;

export default historicSlice.reducer;

export const selectCurrentToken = ((state) => state.auth.token)
