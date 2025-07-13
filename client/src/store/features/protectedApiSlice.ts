/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const protectedApiSlice = createApi({
  reducerPath: "protectedApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
    credentials: "include",
    prepareHeaders: async (headers, { getState }) => {
      const token = (getState() as any).auth.accessToken;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({

    helpSeekerRegister: builder.mutation({
      query: (userData) => ({
        url: "/api/v1/help/auth/help-seeker-register",
        method: "POST",
        body: userData,
      }),
    }),
  }),
});

export const { useHelpSeekerRegisterMutation } = protectedApiSlice;
