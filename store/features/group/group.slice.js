import { createSlice } from "@reduxjs/toolkit";


const initialState = { groupes: [], currentGroup: {}, rules: [] };

const groupSlice = createSlice({
    name: "subscription",
    initialState,
    reducers: {
        setGroupes: (
            state,{ payload: { groupes } } ) => {
            state.groupes = groupes;
        },
        setCurrentGroup: (
            state,{ payload: { group } } ) => {
            state.currentGroup = group;
        },
        setRules: (
            state,{ payload: { rules } } ) => {
            state.rules = rules;
        },
    },
});

export const { setGroupes, setCurrentGroup, setRules } = groupSlice.actions;

export default groupSlice.reducer;

