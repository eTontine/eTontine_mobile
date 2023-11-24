import { createApi } from "@reduxjs/toolkit/query/react";
import {logout, setCredentials} from "./auth.slice";
import {setMessage} from "../alert/alert.slice";
import {baseQueryWithInterceptor} from "../../../utils/fetch";
import { localStorage } from "../../../utils/localStorage";
import {setUser} from "../user/user.slice";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: baseQueryWithInterceptor,
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: "login",
                method: "POST",
                body: data
            }),
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const {data} = await queryFulfilled;
                    await localStorage.setItem('access-token', JSON.stringify(data.access));
                    await localStorage.setItem('refresh-token', JSON.stringify(data.refresh));

                    dispatch(setCredentials(data))
                    dispatch(setUser({user: data.user}));

                    dispatch(setMessage({type: "success", message: 'Connexion reussi'}));

                } catch (error) {
                    dispatch(setMessage({type: "error", message: error?.error?.data?.message}));
                }
            },
        }),
        register: builder.mutation({
            query: (data) => ({
                url: "register",
                method: "POST",
                body: data
            }),
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const {data} = await queryFulfilled;

                    dispatch(setMessage({type: "success", message: 'Compte crée avec succès'}));

                } catch (error) {
                    console.log(error)
                    dispatch(setMessage({type: "error", message: error?.data?.message}));
                }
            },
        }),
        logout: builder.mutation({
            query: () => ({
                url: "mobile/logout",
                method: "POST",
            }),
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(logout());
                } catch (error) {
                    dispatch(logout());
                    console.log(error)
                }
            },
        })
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation
} = authApi;



export const refreshToken = async () => {
    const data = {
        accessToken: await localStorage.getItem('access-token'),
        refreshToken: await localStorage.getItem('refresh-token')
    }
    return data
}
