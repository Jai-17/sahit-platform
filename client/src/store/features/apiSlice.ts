import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    // AUTH
    signUp: builder.mutation<SignUpData, SignUpData>({
      query: (userData) => ({
        url: "/api/v1/help/auth/signup",
        method: "POST",
        body: userData,
      }),
    }),

    signIn: builder.mutation<{ accessToken: string }, SignInData>({
      query: (userData) => ({
        url: "/api/v1/help/auth/signin",
        method: "POST",
        body: userData,
      }),
    }),

    oAuthSync: builder.mutation({
      query: (data) => ({
        url: "/api/v1/help/auth/oauth-sync",
        method: "POST",
        body: data,
      }),
    }),

    getNGOById: builder.query({
      query: (id) => ({
        url: `/api/v1/ngo/user/getUserById/${id}`,
      }),
    }),

    declineRequestUser: builder.mutation({
      query: (userData) => ({
        url: "/api/v1/request/decline/user",
        method: "POST",
        body: userData,
      }),
    }),

    getHelpSeekerById: builder.query({
      query: (id) => ({
        url: `/api/v1/help/user/getUserById/${id}?detail=basic`,
      }),
    }),

    getHelpSeekerByIdDetailed: builder.query({
      query: (id) => ({
        url: `/api/v1/help/user/getUserById/${id}`,
      }),
    }),

    getHelpRequestById: builder.query({
      query: (id) => ({
        url: `/api/v1/help/request/help-request/${id}`,
      }),
    }),

    markAsResolved: builder.mutation({
      query: (userData) => ({
        url: "/api/v1/help/request/resolve-request",
        method: "PATCH",
        body: userData,
      }),
    }),

    getNGOFeedbacks: builder.query({
      query: (ngoId) => ({
        url: `/api/v1/ngo/user/get-feedbacks?ngoId=${ngoId}&limit=5`,
      }),
    }),
  }),
});

export const {
  useSignUpMutation,
  useSignInMutation,
  useOAuthSyncMutation,
  useGetNGOByIdQuery,
  useGetHelpSeekerByIdQuery,
  useGetHelpSeekerByIdDetailedQuery,
  useGetHelpRequestByIdQuery,
  useDeclineRequestUserMutation,
  useMarkAsResolvedMutation,
  useGetNGOFeedbacksQuery
} = apiSlice;
