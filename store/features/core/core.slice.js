import { createSlice } from "@reduxjs/toolkit";
import { localStorage } from "../../../utils/localStorage";


const initialState = {
    countries: []
};

const coreSlice = createSlice({
    name: "core",
    initialState,
    reducers: {
        loadCountries: (
            state,{ payload: { countries  } } ) => {
            state.countries = countries;
        },
    },
});

export const { loadCountries } = coreSlice.actions;

export default coreSlice.reducer;

export const selectCurrentToken = ((state) => state.auth.token)
