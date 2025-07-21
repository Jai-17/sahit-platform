import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQueryWithAuth";

export const protectedApiSlice = createApi({
  reducerPath: "protectedApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({

    helpSeekerRegister: builder.mutation({
      query: (userData) => ({
        url: "/api/v1/help/auth/help-seeker-register",
        method: "POST",
        body: userData,
      }),
    }),

    getUser: builder.query({
      query: () => '/api/v1/help/auth/getuser',
    }),

    getAcceptedRequestByNGO: builder.query({
      query: () => '/api/v1/request/ngo-accepted'
    }),

    getRequestHistory: builder.query({
      query: () => '/api/v1/help/request/all-requests'
    }),

    getActiveHelpRequest: builder.query({
      query: () => '/api/v1/help/request/active-request'
    }),
    
    getHelpRequestCount: builder.query({
      query: () => '/api/v1/help/request/count-requests'
    }),

    createHelpRequest: builder.mutation({
      query: (userData) => ({
        url: '/api/v1/request/create',
        method: 'POST',
        body: userData,
      })
    })
  }),
});

export const { useHelpSeekerRegisterMutation, useGetUserQuery, useGetAcceptedRequestByNGOQuery, useGetRequestHistoryQuery, useGetActiveHelpRequestQuery, useGetHelpRequestCountQuery, useCreateHelpRequestMutation } = protectedApiSlice;
