import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL }),
  endpoints: (builder) => ({
    //GET ALL HELP SEEKERS
    getAllHelpSeeker: builder.query({
      query: () => "/api/v1/help/user/getAllUsers",
    }),

    getHelpSeekerById: builder.query({
      query: (id) => ({
        url: `/api/v1/help/user/getUserById/${id}`,
      }),
    }),

    helpSeekerAdminApprove: builder.mutation({
      query: (userData) => ({
        url: "/api/v1/help/user/admin-approve",
        method: "PATCH",
        body: userData,
      }),
    }),

    // NGO ROUTES
    getAllNGOs: builder.query({
      query: () => `api/v1/ngo/user/get-ngos?detail`,
    }),

    getNGOById: builder.query({
      query: (id) => ({
        url: `/api/v1/ngo/user/getUserById/${id}`,
      }),
    }),

    ngoAdminApprove: builder.mutation({
      query: (userData) => ({
        url: "/api/v1/ngo/user/admin-approve",
        method: "PATCH",
        body: userData,
      }),
    }),

    getDBStats: builder.query({
      query: () => "/api/v1/request/admin-stats",
    }),

    getNGOFeedbacks: builder.query({
      query: (ngoId) => ({
        url: `/api/v1/ngo/user/get-feedbacks?ngoId=${ngoId}&limit=5`,
      }),
    }),

    assignRequestToNGO: builder.mutation({
      query: (userData) => ({
        url: "/api/v1/request/accept/user",
        method: "POST",
        body: userData,
      }),
    }),
  }),
});

export const {
  useGetAllHelpSeekerQuery,
  useGetHelpSeekerByIdQuery,
  useHelpSeekerAdminApproveMutation,
  useGetAllNGOsQuery,
  useGetNGOByIdQuery,
  useNgoAdminApproveMutation,
  useGetDBStatsQuery,
  useGetNGOFeedbacksQuery,
  useAssignRequestToNGOMutation
} = apiSlice;
