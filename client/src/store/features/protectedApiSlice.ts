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
      query: () => 'api/v1/help/auth/getuser',
    })
  }),
});

export const { useHelpSeekerRegisterMutation, useGetUserQuery } = protectedApiSlice;
