import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL, credentials: 'include' }),
    endpoints: (builder) => ({
        // AUTH
        signUp: builder.mutation<SignUpData, SignUpData>({
            query: (userData) => ({
                url: '/api/v1/help/auth/signup',
                method: 'POST',
                body: userData,
            })
        }),

        signIn: builder.mutation<{accessToken: string}, SignInData>({
            query: (userData) => ({
                url: "/api/v1/help/auth/signin",
                method: 'POST',
                body: userData
            })
        }),

        oAuthSync: builder.mutation({
            query: (data) => ({
                url: '/api/v1/help/auth/oauth-sync',
                method: 'POST',
                body: data
            })
        })
    })
})

export const { useSignUpMutation, useSignInMutation, useOAuthSyncMutation } = apiSlice;