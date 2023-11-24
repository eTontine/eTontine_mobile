import { createSlice } from "@reduxjs/toolkit";


const initialState = { subscriptions: [], mySubscription: {} };

const subscriptionSlice = createSlice({
    name: "subscription",
    initialState,
    reducers: {
        setSubscriptions: (
            state,{ payload: { subscriptions } } ) => {
            state.subscriptions = subscriptions;
        },
        setMySubscription: (
            state,{ payload: { subscription } } ) => {
            state.mySubscription = subscription;
        }
    },
});

export const { setSubscriptions, setMySubscription } = subscriptionSlice.actions;

export default subscriptionSlice.reducer;

