import { createApi } from "@reduxjs/toolkit/query/react";
import {setMessage} from "../alert/alert.slice";
import {baseQueryWithInterceptor} from "../../../utils/fetch";
import { localStorage } from "../../../utils/localStorage";
import {setGroupes, setCurrentGroup, setRules} from "./group.slice";
import {setCredentials} from "../auth/auth.slice";
import {setUser} from "../user/user.slice";

export const groupApi = createApi({
    reducerPath: "groupApi",
    baseQuery: baseQueryWithInterceptor,
    tagTypes: ['Groupes'],
    endpoints: (builder) => ({
        getGroupes: builder.query({
            query: ({tontinier,search,page, user, limit}) =>({
                url: `get-associate-groupes?tontinier=${tontinier}&user=${user}&limit=${limit}&page=${page}`,
            }),
            providesTags: ['Groupes'],
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    console.log("getGroupes")
                    const { data } = await queryFulfilled;
                } catch ({error}) {
                    console.log("getGroupes error", error)
                    dispatch(setMessage({type: "error", message: error?.data?.message}));
                }
            },
        }),
        getAssociateGroupDetail: builder.query({
            query: ({id}) =>({
                url: `get-groupe-associate/${id}`,
            }),
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;

                    dispatch(setCurrentGroup({group: data}));

                } catch ({error}) {
                    dispatch(setMessage({type: "error", message: error?.data?.message}));
                }
            },
        }),
        getTontinerGroupes: builder.query({
            query: ({id}) =>({
                url: `get-groupes/${id}`,
            }),
            providesTags: ['Groupes'],
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    console.log("getTontinerGroupes")
                    const { data } = await queryFulfilled;

                } catch ({error}) {
                    console.log("getTontinerGroupes", error)
                    dispatch(setMessage({type: "error", message: error?.data?.message}));
                }
            },
        }),
        getTontinerGroupDetail: builder.query({
            query: ({id}) =>({
                url: `get-groupe/${id}`,
            }),
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {

                    console.log("getTontinerGroupDetail")
                    const { data } = await queryFulfilled;

                    dispatch(setCurrentGroup({group: data}));

                } catch ({error}) {
                    console.log("getTontinerGroupDetail", error)
                    dispatch(setMessage({type: "error", message: error?.data?.message}));
                }
            },
        }),
        createGroup: builder.mutation({
            query: (data) => ({
                url: "create-groupe",
                method: "POST",
                body: data
            }),
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const data = await queryFulfilled;

                    console.log(data)

                    dispatch(setMessage({type: "success", message: "Groupe crée avec succès"}));

                } catch ({error}) {
                    dispatch(setMessage({type: "error", message: error?.data?.message}));
                }
            },
        }),
        associateGroup: builder.mutation({
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
        updateGroup: builder.mutation({
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
        deleteGroup: builder.mutation({
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
        getRules: builder.query({
            query: () =>({
                url: `get-rules/GROUPES`,
            }),
            providesTags: ['Groupes'],
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setRules({rules: data}))
                } catch ({error}) {
                    console.log("getGroupes error", error)
                    dispatch(setMessage({type: "error", message: error?.data?.message}));
                }
            },
        }),
    }),
});

export const {
    useGetGroupesQuery,
    useGetAssociateGroupDetailQuery,
    useGetTontinerGroupesQuery,
    useGetTontinerGroupDetailQuery,
    useCreateGroupMutation,
    useAssociateGroupMutation,
    useUpdateGroupMutation,
    useDeleteGroupMutation,
    useGetRulesQuery,
} = groupApi;
