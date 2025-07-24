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
      query: () => "/api/v1/help/auth/getuser",
    }),

    getAcceptedRequestByNGO: builder.query({
      query: () => "/api/v1/request/ngo-accepted",
    }),

    getRequestHistory: builder.query({
      query: () => "/api/v1/help/request/all-requests",
    }),

    getActiveHelpRequest: builder.query({
      query: () => "/api/v1/help/request/active-request",
    }),

    getActiveHelpRequestDetails: builder.query({
      query: () => '/api/v1/help/request/active-request-details'
    }),

    getHelpRequestCount: builder.query({
      query: () => "/api/v1/help/request/count-requests",
    }),

    createHelpRequest: builder.mutation({
      query: (userData) => ({
        url: "/api/v1/request/create",
        method: "POST",
        body: userData,
      }),
    }),

    createChatToken: builder.mutation({
      query: () => ({
        url: "/api/v1/chat/token",
        method: "POST",
      }),
    }),

    startChat: builder.mutation({
      query: (userData) => ({
        url: '/api/v1/chat/start',
        method: 'POST',
        body: userData
      })
    }),

    getMessagesByChatRoomId: builder.query({
      query: (chatRoomId) => ({
        url: `/api/v1/chat/messages/${chatRoomId}`
      })
    }),

    sendMessage: builder.mutation({
      query: (userData) => ({
        url: '/api/v1/chat/send',
        method: 'POST',
        body: userData
      })
    })
  }),
});

export const {
  useHelpSeekerRegisterMutation,
  useGetUserQuery,
  useGetAcceptedRequestByNGOQuery,
  useGetRequestHistoryQuery,
  useGetActiveHelpRequestQuery,
  useGetActiveHelpRequestDetailsQuery,
  useGetHelpRequestCountQuery,
  useCreateHelpRequestMutation,
  useCreateChatTokenMutation,
  useStartChatMutation,
  useGetMessagesByChatRoomIdQuery,
  useSendMessageMutation
} = protectedApiSlice;
