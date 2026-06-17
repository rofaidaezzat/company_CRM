import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

export const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
};

export const setCookie = (name: string, val: string, maxAgeSeconds: number = 31536000) => {
  document.cookie = `${name}=${val}; path=/; max-age=${maxAgeSeconds}; Secure; SameSite=Lax`;
};

export const deleteCookie = (name: string) => {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: 'https://crm-v1-otu8.vercel.app/',
  prepareHeaders: (headers) => {
    if (headers.has('X-Skip-Authorization') || headers.has('x-skip-authorization')) {
      headers.delete('X-Skip-Authorization');
      headers.delete('x-skip-authorization');
      return headers;
    }
    const token = getCookie('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    const lang = getCookie('language') || 'en';
    headers.set('Accept-Language', lang);
    return headers;
  },
  credentials: 'include', // Ensures HTTP-only cookies (such as refreshToken) are automatically sent/received
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const isRefreshRequest = typeof args === 'string'
      ? args.includes('auth/refresh-token')
      : args.url?.includes('auth/refresh-token');

    // Never try to refresh if the failing request IS the refresh endpoint (avoid infinite loops)
    if (!isRefreshRequest) {
      try {
        // The refresh token lives in an HTTP-only cookie — always attempt refresh on 401
        const refreshResult = await rawBaseQuery(
          {
            url: 'api/v1/auth/refresh-token?s=4',
            method: 'POST',
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          const payload = refreshResult.data as any;
          console.log('Refresh token response payload:', payload);
          const newToken =
            payload?.data?.newAccessToken ||
            (typeof payload?.data === 'string' ? payload.data : null) ||
            payload?.data?.access_token ||
            payload?.data?.token ||
            payload?.access_token ||
            payload?.token ||
            (typeof payload === 'string' ? payload : null);

          if (newToken) {
            // Store the new token and retry the original request
            setCookie('token', newToken);
            result = await rawBaseQuery(args, api, extraOptions);
          } else {
            // Refresh succeeded but returned no token — session truly expired
            deleteCookie('token');
            deleteCookie('user_type');
            deleteCookie('user_id');
          }
        } else {
          // Refresh token itself is expired / invalid
          deleteCookie('token');
          deleteCookie('user_type');
          deleteCookie('user_id');
        }
      } catch (err) {
        console.error('Refresh token request threw:', err);
        deleteCookie('token');
        deleteCookie('user_type');
        deleteCookie('user_id');
      }
    }
  }

  return result;
};
