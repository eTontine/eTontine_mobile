import { createApi } from "@reduxjs/toolkit/query/react";
import {baseQueryWithInterceptor} from "../../../utils/fetch";
import {setMessage} from "../alert/alert.slice";
import {loadCountries} from "./core.slice";

export const coreApi = createApi({
    reducerPath: "coreApi",
    baseQuery: baseQueryWithInterceptor,
    tagTypes: ['Country'],
    endpoints: (builder) => ({
        getCountry: builder.query({
            query: () => 'countries',
            providesTags: (result, error, id) => [{ type: 'Country', id }],
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(loadCountries({ countries: data }))

                } catch ({error}) {
                    dispatch(setMessage({type: "error", message: error?.data?.message}));
                }
            },
        }),
    }),
});

export const {
    useGetCountryQuery
} = coreApi;

