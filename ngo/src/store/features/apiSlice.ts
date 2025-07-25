import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL, credentials: 'include' }),
    endpoints: (builder) => ({
        // AUTH
        signUp: builder.mutation<SignUpData, SignUpData>({
            query: (userData) => ({
                url: '/api/v1/ngo/auth/signup',
                method: 'POST',
                body: userData,
            })
        }),

        signIn: builder.mutation<{accessToken: string}, SignInData>({
            query: (userData) => ({
                url: "/api/v1/ngo/auth/signin",
                method: 'POST',
                body: userData
            })
        }),

        oAuthSync: builder.mutation({
            query: (data) => ({
                url: '/api/v1/ngo/auth/oauth-sync',
                method: 'POST',
                body: data
            })
        }),

        // HELP REQUESTS
        getIncomingRequestById: builder.query({
            query: (id) => ({
                url: `/api/v1/request/user/${id}`
            })
        }),

        getHelpRequestById: builder.query({
            query: (id) => ({
                url: `/api/v1/ngo/request/${id}`
            })
        }),

        getNGOById: builder.query({
            query: (id) => ({
                url: `/api/v1/ngo/user/getUserById/${id}`
            })
        })
    })
})

export const { useSignUpMutation, useSignInMutation, useOAuthSyncMutation, useGetIncomingRequestByIdQuery, useGetHelpRequestByIdQuery, useGetNGOByIdQuery } = apiSlice;