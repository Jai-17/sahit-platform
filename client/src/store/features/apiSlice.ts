import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL }),
    endpoints: (builder) => ({
        // AUTH
        signUp: builder.mutation<SignUpData, SignUpData>({
            query: (userData) => ({
                url: '/api/v1/help/auth/signup',
                method: 'POST',
                body: userData,
            })
        }),
    })
})

export const { useSignUpMutation } = apiSlice;