import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth, setCookie } from './baseQuery';

export interface Badge {
  name: string;
  earned: boolean;
}

export interface ProfileData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  gender?: 'MALE' | 'FEMALE' | 'NOT_SPECIFIED';
  language?: 'EN' | 'AR';
  task_reminder?: boolean;
  follow_up_reminder?: boolean;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  current_rank?: number;
  target_percentage?: number;
  monthly_sales?: number;
  badges?: Badge[];
  avatar?: string | null;
  rank_list?: any[];
  role?: {
    id: number;
    name: string;
  };
}

export interface ProfileDetailsResponse {
  status: string;
  code: number;
  data: {
    profile: ProfileData;
  };
}

export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  gender?: 'MALE' | 'FEMALE' | 'NOT_SPECIFIED';
  language?: 'EN' | 'AR';
  task_reminder?: boolean;
  follow_up_reminder?: boolean;
  address?: string | null;
  city?: string | null;
  country?: string | null;
}

export interface ChangePasswordRequest {
  current_password?: string;
  new_password?: string;
}

export interface GenericResponse {
  status: string;
  code: number;
  message: string;
}

export const settingsApi = createApi({
  reducerPath: 'settingsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Profile'],
  endpoints: (builder) => ({
    getProfileDetails: builder.query<ProfileDetailsResponse, void>({
      query: () => 'api/v1/sales/profile',
      providesTags: ['Profile'],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const userId = data?.data?.profile?.id;
          if (userId) {
            setCookie('user_id', userId);
          }
        } catch (error) {
          console.error('Fetching profile failed:', error);
        }
      },
    }),
    updateProfileInfo: builder.mutation<ProfileDetailsResponse, UpdateProfileRequest>({
      query: (body) => ({
        url: 'api/v1/sales/profile',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Profile'],
    }),
    changePassword: builder.mutation<GenericResponse, ChangePasswordRequest>({
      query: (body) => ({
        url: 'api/v1/sales/profile/change-password',
        method: 'PATCH',
        body,
      }),
    }),
    uploadProfilePicture: builder.mutation<GenericResponse, FormData>({
      query: (body) => ({
        url: 'api/v1/sales/profile/upload-photo',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Profile'],
    }),
  }),
});

export const {
  useGetProfileDetailsQuery,
  useUpdateProfileInfoMutation,
  useChangePasswordMutation,
  useUploadProfilePictureMutation,
} = settingsApi;
