import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

export interface DealLead {
  id: string;
  name: string | null;
  phone: string;
  email: string | null;
  source: string;
  status: string;
}

export interface DealAuthor {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface Deal {
  id: string;
  tenant_id: string;
  lead_id: string;
  lead?: DealLead;
  author?: DealAuthor;
  currency: string;
  country: string;
  city: string;
  value: number;
  deals_details: string | null;
  close_date: string;
  created_at: string;
  updated_at: string;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DateCounts {
  today: number;
  yesterday: number;
  thisWeek: number;
  lastWeek: number;
  thisMonth: number;
  lastMonth: number;
  thisYear: number;
}

export interface GetDealsResponse {
  status: string;
  code: number;
  message: string;
  pagination?: PaginationInfo;
  min_revenue?: number;
  max_revenue?: number;
  dateCounts?: DateCounts;
  data: Deal[];
}

export interface GetDealResponse {
  status: string;
  code: number;
  message: string;
  data: Deal;
}

export interface CreateDealRequest {
  lead_id?: string;
  phone: string;
  name: string;
  company_name?: string;
  source: string;
  city: string;
  value: number;
  deals_details?: string;
  close_date?: string;
}

export interface UpdateDealRequest {
  id: string;
  body: {
    source?: string;
    value?: number;
    city?: string;
    deals_details?: string;
    close_date?: string;
  };
}

export interface DeleteDealResponse {
  status: string;
  code: number;
  message: string;
}

export interface GetDealsParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  [key: string]: any;
}

export const dealsApi = createApi({
  reducerPath: 'dealsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Deal'],
  endpoints: (builder) => ({
    getDeals: builder.query<GetDealsResponse, GetDealsParams | void>({
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
        return `api/v1/deals${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Deal' as const, id })),
              { type: 'Deal', id: 'LIST' },
            ]
          : [{ type: 'Deal', id: 'LIST' }],
    }),
    getDealById: builder.query<GetDealResponse, string>({
      query: (id) => `api/v1/deals/${id}`,
      providesTags: (result, error, id) => [{ type: 'Deal', id }],
    }),
    createDeal: builder.mutation<GetDealResponse, CreateDealRequest>({
      query: (body) => ({
        url: 'api/v1/deals',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Deal', id: 'LIST' }],
    }),
    updateDeal: builder.mutation<GetDealResponse, UpdateDealRequest>({
      query: ({ id, body }) => ({
        url: `api/v1/deals/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Deal', id },
        { type: 'Deal', id: 'LIST' },
      ],
    }),
    deleteDeal: builder.mutation<DeleteDealResponse, string>({
      query: (id) => ({
        url: `api/v1/deals/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Deal', id },
        { type: 'Deal', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetDealsQuery,
  useGetDealByIdQuery,
  useCreateDealMutation,
  useUpdateDealMutation,
  useDeleteDealMutation,
} = dealsApi;
