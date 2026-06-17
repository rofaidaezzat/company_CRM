import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth, setCookie, deleteCookie } from './baseQuery';

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: 'MALE' | 'FEMALE';
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  user_type: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  avatar: string;
}

export interface GenericResponse {
  status: string;
  code: number;
  message: string;
}

export interface LoginResponse {
  status: string;
  code: number;
  message: string;
  data: {
    user: User;
    access_token: string;
  };
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  email: string;
  password?: string;
}

export interface ResendOtpRequest {
  email: string;
  type: 'VERIFICATION' | string;
}

export interface VerifyEmailRequest {
  email: string;
  otp: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: 'api/v1/auth/login?s=4',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.data?.access_token) {
            setCookie('token', data.data.access_token);
          }
          if (data?.data?.user?.user_type) {
            setCookie('user_type', data.data.user.user_type);
          }
          if (data?.data?.user?.id) {
            setCookie('user_id', data.data.user.id);
            setCookie('id', data.data.user.id);
          }
          if (data?.data?.user?.language) {
            setCookie('language', data.data.user.language.toLowerCase());
          }
        } catch (error) {
          console.error('Login failed:', error);
        }
      },
    }),
    logout: builder.mutation<GenericResponse, void>({
      query: () => ({
        url: 'api/v1/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          deleteCookie('token');
          deleteCookie('user_type');
          deleteCookie('user_id');
          deleteCookie('id');
          deleteCookie('language');
        } catch (error) {
          console.error('Logout failed:', error);
          // Still clean token in case of failure
          deleteCookie('token');
          deleteCookie('user_type');
          deleteCookie('user_id');
          deleteCookie('id');
          deleteCookie('language');
        }
      },
    }),
    forgotPassword: builder.mutation<GenericResponse, ForgotPasswordRequest>({
      query: (body) => ({
        url: 'api/v1/auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),
    verifyOtp: builder.mutation<GenericResponse, VerifyOtpRequest>({
      query: (body) => ({
        url: 'api/v1/auth/verify-otp',
        method: 'POST',
        body,
      }),
    }),
    resetPassword: builder.mutation<GenericResponse, ResetPasswordRequest>({
      query: (body) => ({
        url: 'api/v1/auth/reset-password',
        method: 'POST',
        body,
      }),
    }),
    resendOtp: builder.mutation<GenericResponse, ResendOtpRequest>({
      query: (body) => ({
        url: 'api/v1/auth/resend-otp',
        method: 'POST',
        body,
      }),
    }),
    verifyEmail: builder.mutation<GenericResponse, VerifyEmailRequest>({
      query: (body) => ({
        url: 'api/v1/auth/verify-email?s=4',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  useResendOtpMutation,
  useVerifyEmailMutation,
} = authApi;
