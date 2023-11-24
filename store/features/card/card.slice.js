import { createSlice } from "@reduxjs/toolkit";


const initialState = { cards: [], currentCard: {} };

const cardSlice = createSlice({
    name: "subscription",
    initialState,
    reducers: {
        setCards: (
            state,{ payload: { cards } } ) => {
            state.cards = cards;
        },
        setCurrentCard: (
            state,{ payload: { card } } ) => {
            state.currentCard = card;
        }
    },
});

export const { setCards, setCurrentCard } = cardSlice.actions;

export default cardSlice.reducer;

