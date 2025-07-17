import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQueryWithAuth";

export const protectedApiSlice = createApi({
  reducerPath: "protectedApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({

    getUser: builder.query({
      query: () => 'api/v1/ngo/auth/getuser',
    }),

    ngoRegister: builder.mutation({
      query: (userData) => ({
        url: '/api/v1/ngo/user/register-ngo',
        method: 'POST',
        body: userData
      })
    })
  }),
});

export const { useGetUserQuery, useNgoRegisterMutation } = protectedApiSlice;
