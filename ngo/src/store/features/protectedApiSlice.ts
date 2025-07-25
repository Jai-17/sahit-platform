import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQueryWithAuth";

export const protectedApiSlice = createApi({
  reducerPath: "protectedApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => "api/v1/ngo/auth/getuser",
    }),

    ngoRegister: builder.mutation({
      query: (userData) => ({
        url: "/api/v1/ngo/user/register-ngo",
        method: "POST",
        body: userData,
      }),
    }),

    incomingRequest: builder.query({
      query: () => "/api/v1/ngo/request/incoming-requests",
    }),

    acceptIncomingRequest: builder.mutation({
      query: (userData) => ({
        url: "/api/v1/request/accept/ngo",
        method: "PATCH",
        body: userData,
      }),
    }),

    getAllHelpRequest: builder.query({
      query: () => '/api/v1/ngo/request/all-requests'
    }),

    getDBStats: builder.query({
      query: () => '/api/v1/ngo/user/db-stat'
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
    }),

    updateProfile: builder.mutation({
      query: (userData) => ({
        url: '/api/v1/ngo/auth/update-user',
        method: 'PATCH',
        body: userData
      })
    }),
  }),
});

export const {
  useGetUserQuery,
  useNgoRegisterMutation,
  useIncomingRequestQuery,
  useAcceptIncomingRequestMutation,
  useGetAllHelpRequestQuery,
  useGetDBStatsQuery,
  useStartChatMutation,
  useGetMessagesByChatRoomIdQuery,
  useSendMessageMutation,
  useUpdateProfileMutation,
} = protectedApiSlice;
