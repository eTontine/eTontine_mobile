import { createApi } from "@reduxjs/toolkit/query/react";
import {setMessage} from "../alert/alert.slice";
import {baseQueryWithInterceptor} from "../../../utils/fetch";
import { localStorage } from "../../../utils/localStorage";
import {setMySubscription, setSubscriptions} from "./subscription.slice";
import {setCredentials} from "../auth/auth.slice";
import {setUser} from "../user/user.slice";

export const subscriptionApi = createApi({
    reducerPath: "subscriptionApi",
    baseQuery: baseQueryWithInterceptor,
    tagTypes: ['Subscription'],
    endpoints: (builder) => ({
        getSubscriptions: builder.query({
            query: () => 'abonnements',
            providesTags: ['Subscription'],
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setSubscriptions({subscriptions: data}));

                } catch ({error}) {
                    dispatch(setMessage({type: "error", message: error?.data?.message}));
                }
            },
        }),
        getMySubscription: builder.query({
            query: () => 'default-abonnement',
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;

                    dispatch(setMySubscription({subscription: data}));

                } catch ({error}) {
                    dispatch(setMySubscription({subscription: {}}))
                    console.log("getMySubscription", error)
                    // dispatch(setMessage({type: "error", message: error?.data?.message}));
                }
            },
        }),
        subscribe: builder.mutation({
            query: (data) => ({
                url: "make-abonnement",
                method: "POST",
                body: data
            }),
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const {data} = await queryFulfilled;

                    dispatch(setMessage({type: "success", message: "Vous avez réussi à souscrire avec succès à l'abonnement "}));

                } catch ({error}) {
                    dispatch(setMessage({type: "error", message: error?.data?.message}));
                }
            },
        }),
    }),
});

export const {
    useGetSubscriptionsQuery,
    useGetMySubscriptionQuery,
    useSubscribeMutation,
} = subscriptionApi;
