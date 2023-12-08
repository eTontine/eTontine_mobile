import { createApi } from "@reduxjs/toolkit/query/react";
import {setMessage} from "../alert/alert.slice";
import {baseQueryWithInterceptor} from "../../../utils/fetch";

export const requestApi = createApi({
    reducerPath: "requestApi",
    baseQuery: baseQueryWithInterceptor,
    endpoints: (builder) => ({
        getRequests: builder.query({
            query: ({userId, start, end}) => `get-carte-collect-request/${userId}?start_date=${start}&end_date=${end}`,
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    console.log("ici")
                    const data  = await queryFulfilled;
                    console.log("data", data)
                } catch (error) {
                    console.log(error)
                    dispatch(setMessage({type: "error", message: error?.data?.message}));
                }
            },
        }),
    }),
});

export const {
    useGetRequestsQuery,
} = requestApi;

