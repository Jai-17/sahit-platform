import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQueryWithAuth";

export const protectedApiSlice = createApi({
  reducerPath: "protectedApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({

    getUser: builder.query({
      query: () => 'api/v1/help/auth/getuser',
    })
  }),
});

export const { useGetUserQuery } = protectedApiSlice;
