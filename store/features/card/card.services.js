import { createApi } from "@reduxjs/toolkit/query/react";
import {setMessage} from "../alert/alert.slice";
import {baseQueryWithInterceptor} from "../../../utils/fetch";
import { localStorage } from "../../../utils/localStorage";
import {setCards, setCurrentCard} from "./card.slice";
import {setCredentials} from "../auth/auth.slice";
import {setUser} from "../user/user.slice";

export const cardApi = createApi({
    reducerPath: "cardApi",
    baseQuery: baseQueryWithInterceptor,
    tagTypes: ['Cards'],
    endpoints: (builder) => ({
        getCards: builder.query({
            query: ({tontinier,search,page, user, limit}) =>({
                url: `getAssociateCartes?tontinier=${tontinier}&user=${user}&limit=${limit}&page=${page}`,
            }),
            providesTags: ['Cards'],
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                } catch ({error}) {
                    console.log("error", error)
                    dispatch(setMessage({type: "error", message: error?.data?.message}));
                }
            },
        }),
        getAssociateCardDetail: builder.query({
            query: ({id}) =>({
                url: `getAssociateCarte/${id}`,
            }),
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;

                    dispatch(setCurrentCard({card: data}));

                } catch ({error}) {
                    dispatch(setMessage({type: "error", message: error?.data?.message}));
                }
            },
        }),
        getTontinerCards: builder.query({
            query: ({id}) =>({
                url: `get-cartes/${id}`,
            }),
            providesTags: ['Cards'],
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    console.log('useGetTontinerCardsQuery', data)
                } catch ({error}) {
                    dispatch(setMessage({type: "error", message: error?.data?.message}));
                }
            },
        }),
        getTontinerCardDetail: builder.query({
            query: ({id}) =>({
                url: `get-carte/${id}`,
            }),
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;

                    dispatch(setCurrentCard({card: data}));

                } catch ({error}) {
                    dispatch(setMessage({type: "error", message: error?.data?.message}));
                }
            },
        }),
        createCard: builder.mutation({
            query: (data) => ({
                url: "create-carte",
                method: "POST",
                body: data
            }),
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const data = await queryFulfilled;

                    console.log(data)

                    dispatch(setMessage({type: "success", message: "Carte crée avec succès"}));

                } catch ({error}) {
                    dispatch(setMessage({type: "error", message: error?.data?.message}));
                }
            },
        }),
        associateCard: builder.mutation({
            query: (data) => ({
                url: "associateCarte",
                method: "POST",
                body: data
            }),
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    console.log("Associate")
                    const data = await queryFulfilled;

                    dispatch(setMessage({type: "success", message: "Association envoyée avec succès"}));

                } catch ({error}) {
                    console.log("Associate error", error)
                    dispatch(setMessage({type: "error", message: error?.data?.message}));
                }
            },
        }),
        validateAssociate: builder.mutation({
            query: (data) => ({
                url: "setAssociateCarteUserTontinierStatus/"+data.id,
                method: "PUT",
                body: data
            }),
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const data = await queryFulfilled;

                    dispatch(setMessage({type: "success", message: "Association validé avec succès"}));

                } catch ({error}) {
                    dispatch(setMessage({type: "error", message: error?.data?.message}));
                }
            },
        }),
        makePayment: builder.mutation({
            query: (data) => ({
                url: "send-carte-contribution",
                method: "POST",
                body: data
            }),
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const data = await queryFulfilled;

                    dispatch(setMessage({type: "success", message: "Paiment carte envoyé avec succès"}));

                } catch ({error}) {
                    console.log("makePayment", error)
                    dispatch(setMessage({type: "error", message: error?.data?.message}));
                }
            },
        }),
        updateCard: builder.mutation({
            query: (data) => ({
                url: `update-carte/${data.id}`,
                method: "PUT",
                body: data
            }),
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const {data} = await queryFulfilled;

                    dispatch(setMessage({type: "success", message: "Carte mise à jour avec succès"}));

                } catch ({error}) {
                    dispatch(setMessage({type: "error", message: error?.data?.message}));
                }
            },
        }),
        deleteCard: builder.mutation({
            query: ({id}) => ({
                url: `delete-carte/${id}`,
                method: "DELETE",
            }),
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    console.log("here")
                    const data = await queryFulfilled;

                    dispatch(setMessage({type: "success", message: "Carte supprimer avec succès"}));

                } catch ({error}) {
                    console.log("error", error)
                    dispatch(setMessage({type: "error", message: error?.data?.message}));
                }
            },
        }),
    }),
});

export const {
    useGetCardsQuery,
    useGetAssociateCardDetailQuery,
    useGetTontinerCardsQuery,
    useGetTontinerCardDetailQuery,
    useCreateCardMutation,
    useAssociateCardMutation,
    useValidateAssociateMutation,
    useMakePaymentMutation,
    useUpdateCardMutation,
    useDeleteCardMutation
} = cardApi;
