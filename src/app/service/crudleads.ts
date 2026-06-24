import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

export interface LeadAssignedTo {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface Lead {
  id: string;
  tenant_id: string;
  assigned_to: LeadAssignedTo | null;
  name: string;
  phone: string;
  email: string | null;
  company_name: string | null;
  source: string;
  status: string;
  next_follow_up: string | null;
  metadata: any | null;
  created_at: string;
  updated_at: string;
}

export interface Pagination {
  currentPage: number;
  limit: number;
  totalPages: number;
  total: number;
}

export interface GetLeadsResponse {
  status: string;
  code: number;
  pagination: Pagination;
  message: string;
  data: Lead[];
}

export interface GetLeadResponse {
  status: string;
  code: number;
  message: string;
  data: Lead;
}

export interface CreateLeadRequest {
  name: string;
  phone: string;
  source?: string;
  status?: string;
  assigned_to_id?: string;
  company_name?: string;
  next_follow_up?: string | null;
  city?: string;
  value?: number;
}

export interface UpdateLeadRequest {
  id: string;
  status?: string;
  priority?: string;
  body: {
    name?: string;
    phone?: string;
    source?: string;
    status?: string;
    assigned_to_id?: string | null;
    company_name?: string;
    next_follow_up?: string | null;
    value?: string;
    city?: string;
    priority?: string;
  };
}

export interface UpdateLeadStatusRequest {
  id: string;
  body: {
    status: string;
  };
}

export interface DeleteLeadResponse {
  status: string;
  code: number;
  message: string;
}

export interface GetLeadsParams {
  page?: number;
  limit?: number;
  search?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  priority?: string;
  source?: string;
  next_follow_up_start?: string;
  next_follow_up_end?: string;
  next_follow_up_preset?: string;
  sort?: string;
}

export interface LeadStatsData {
  status: Record<string, number>;
  source: Record<string, number>;
  priority: Record<string, number>;
  date: {
    today: number;
    yesterday: number;
    thisWeek: number;
    lastWeek: number;
    thisMonth: number;
    thisYear: number;
  };
}

export interface GetLeadStatsResponse {
  status: string;
  code: number;
  message: string;
  data: LeadStatsData;
}

export interface GetLeadStatsParams {
  search?: string;
  assigned_to_id?: string;
  priority?: string;
}

export const leadsApi = createApi({
  reducerPath: 'leadsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Lead', 'LeadStats'],
  endpoints: (builder) => ({
    getLeads: builder.query<GetLeadsResponse, GetLeadsParams | void>({
      query: (params) => {
        const urlParams = new URLSearchParams();
        if (params) {
          Object.entries(params).forEach(([key, val]) => {
            if (val !== undefined && val !== null && val !== '') {
              urlParams.append(key, val.toString());
            }
          });
        }
        const queryString = urlParams.toString();
        return `api/v1/leads${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Lead' as const, id })),
              { type: 'Lead', id: 'LIST' },
            ]
          : [{ type: 'Lead', id: 'LIST' }],
    }),
    getLead: builder.query<GetLeadResponse, string>({
      query: (id) => `api/v1/leads/${id}`,
      providesTags: (result, error, id) => [{ type: 'Lead', id }],
    }),
    createLead: builder.mutation<GetLeadResponse, CreateLeadRequest>({
      query: (body) => ({
        url: 'api/v1/leads',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Lead', id: 'LIST' }],
    }),
    updateLead: builder.mutation<GetLeadResponse, UpdateLeadRequest>({
      query: ({ id, body, status, priority }) => {
        const queryParams = new URLSearchParams();
        if (status) queryParams.append('status', status);
        if (priority) queryParams.append('priority', priority);
        const queryString = queryParams.toString();

        const requestBody = { ...body };
        if (priority && !requestBody.priority) {
          requestBody.priority = priority;
        }
        if (status && !requestBody.status) {
          requestBody.status = status;
        }

        return {
          url: `api/v1/leads/${id}${queryString ? `?${queryString}` : ''}`,
          method: 'PATCH',
          body: requestBody,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'Lead', id },
        { type: 'Lead', id: 'LIST' },
      ],
    }),
    updateLeadStatus: builder.mutation<GetLeadResponse, UpdateLeadStatusRequest>({
      query: ({ id, body }) => ({
        url: `api/v1/leads/${id}/status`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Lead', id },
        { type: 'Lead', id: 'LIST' },
      ],
    }),
    deleteLead: builder.mutation<DeleteLeadResponse, string>({
      query: (id) => ({
        url: `api/v1/leads/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Lead', id },
        { type: 'Lead', id: 'LIST' },
      ],
    }),
    getLeadStats: builder.query<GetLeadStatsResponse, GetLeadStatsParams | void>({
      query: (params) => {
        const urlParams = new URLSearchParams();
        if (params) {
          Object.entries(params).forEach(([key, val]) => {
            if (val !== undefined && val !== null && val !== '') {
              urlParams.append(key, val.toString());
            }
          });
        }
        const queryString = urlParams.toString();
        return {
          url: `api/v1/leads/stats${queryString ? `?${queryString}` : ''}`,
          cache: 'no-store',
        };
      },
      providesTags: ['LeadStats'],
    }),
  }),
});

export const {
  useGetLeadsQuery,
  useLazyGetLeadsQuery,
  useGetLeadQuery,
  useCreateLeadMutation,
  useUpdateLeadMutation,
  useUpdateLeadStatusMutation,
  useDeleteLeadMutation,
  useGetLeadStatsQuery,
} = leadsApi;
