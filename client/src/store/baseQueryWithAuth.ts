/* eslint-disable @typescript-eslint/no-empty-object-type */
// features/baseQueryWithReauth.ts
import { BaseQueryApi, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query';
import { clearAuth, setAccessToken } from './features/authSlice';
import { RootState } from './store';

interface RefreshResponse {
  accessToken: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const baseQueryWithReauth = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: {}
) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  });

  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const refreshResult = await baseQuery(
      { url: '/api/v1/help/auth/refresh-token', method: 'POST' },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const newAccessToken = (refreshResult.data as RefreshResponse).accessToken;

      api.dispatch(setAccessToken(newAccessToken));

      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(clearAuth());
    }
  }

  return result;
};
