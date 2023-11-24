import { createApi } from "@reduxjs/toolkit/query/react";
import {setMessage} from "../alert/alert.slice";
import {baseQueryWithInterceptor} from "../../../utils/fetch";
import { localStorage } from "../../../utils/localStorage";
import {setUser} from "./user.slice";

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: baseQueryWithInterceptor,
    tagTypes: ['User'],
    endpoints: (builder) => ({
        getMe: builder.query({
            query: () => 'me',
            providesTags: ['User'],
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    console.log("getMe", data)
                    await localStorage.setItem('user', JSON.stringify(data));
                    dispatch(setUser({user: data}));

                } catch ({error}) {
                    console.log("error get me", error)
                    // dispatch(setMessage({type: "error", message: error?.data?.message}));
                }
            },
        }),
    }),
});

export const {
    useGetMeQuery,
} = userApi;

