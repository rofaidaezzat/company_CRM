import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

export interface ReportSales {
  id: string;
  phone: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
}

export interface Report {
  id: string;
  tenant_id: string;
  sales_id: string;
  calls_today: number;
  follow_ups_today: number;
  leads_contacted_today: number;
  meetings_today: number;
  deals_closed_today: number;
  revenue_today: number;
  date: string;
  top_periority_tomorrow: string;
  additional_notes: string;
  created_at: string;
  updated_at: string;
  sales?: ReportSales;
}

export interface Pagination {
  currentPage: number;
  limit: number;
  totalPages: number;
  total: number;
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

export interface GetReportsResponse {
  status: string;
  code: number;
  message: string;
  pagination: Pagination;
  min_revenue?: number;
  max_revenue?: number;
  dateCounts?: DateCounts;
  data: Report[];
}

export interface GetReportResponse {
  status: string;
  code: number;
  message: string;
  data: Report;
}

export interface TodayStats {
  date: string;
  deals_closed_today: number;
  revenue_today: number;
}

export interface GetTodayStatsResponse {
  status: string;
  code: number;
  message: string;
  data: TodayStats;
}

export interface CreateReportRequest {
  calls_today: number;
  follow_ups_today: number;
  leads_contacted_today: number;
  meetings_today: number;
  deals_closed_today?: number;
  revenue_today?: number;
  top_periority_tomorrow?: string;
  additional_notes?: string;
}

export interface UpdateReportRequest {
  id: string;
  body: {
    calls_today?: number;
    follow_ups_today?: number;
    leads_contacted_today?: number;
    meetings_today?: number;
    deals_closed_today?: number;
    revenue_today?: number;
    top_periority_tomorrow?: string;
    additional_notes?: string;
  };
}

export interface GetReportsParams {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  [key: string]: any; // for dynamic range filters e.g. calls_today[gt]=10
}

export const reportsApi = createApi({
  reducerPath: 'reportsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Report', 'TodayStats'],
  endpoints: (builder) => ({
    getReports: builder.query<GetReportsResponse, GetReportsParams | void>({
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
        return `api/v1/reports${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Report' as const, id })),
              { type: 'Report', id: 'LIST' },
            ]
          : [{ type: 'Report', id: 'LIST' }],
    }),
    getReportById: builder.query<GetReportResponse, string>({
      query: (id) => `api/v1/reports/${id}`,
      providesTags: (result, error, id) => [{ type: 'Report', id }],
    }),
    getTodayStats: builder.query<GetTodayStatsResponse, void>({
      query: () => 'api/v1/reports/today-stats',
      providesTags: ['TodayStats'],
    }),
    createReport: builder.mutation<GetReportResponse, CreateReportRequest>({
      query: (body) => ({
        url: 'api/v1/reports',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Report', id: 'LIST' }, 'TodayStats'],
    }),
    updateReport: builder.mutation<GetReportResponse, UpdateReportRequest>({
      query: ({ id, body }) => ({
        url: `api/v1/reports/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Report', id },
        { type: 'Report', id: 'LIST' },
        'TodayStats',
      ],
    }),
  }),
});

export const {
  useGetReportsQuery,
  useGetReportByIdQuery,
  useGetTodayStatsQuery,
  useLazyGetTodayStatsQuery,
  useCreateReportMutation,
  useUpdateReportMutation,
} = reportsApi;
