import { createApi } from "@reduxjs/toolkit/query/react";
import {setMessage} from "../alert/alert.slice";
import {baseQueryWithInterceptor} from "../../../utils/fetch";
import {setHistorics} from "./historic.slice";

export const historicApi = createApi({
    reducerPath: "historicApi",
    baseQuery: baseQueryWithInterceptor,
    endpoints: (builder) => ({
        getHistorics: builder.query({
            query: ({userId, start, end}) => `transactions-history?user=${userId}&start_date=${start}&end_date=${end}`,
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    console.log("here")
                    const data  = await queryFulfilled;


                } catch (error) {
                    console.log(error)
                    dispatch(setMessage({type: "error", message: error?.data?.message}));
                }
            },
        }),
    }),
});

export const {
    useGetHistoricsQuery,
} = historicApi;

