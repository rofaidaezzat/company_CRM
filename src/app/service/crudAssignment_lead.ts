import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

export interface LeadInfo {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  source: string;
  status: string;
}

export interface SalesInfo {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface AssignedByUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface LeadAssignment {
  id: string;
  tenant_id: string;
  lead_id: string;
  lead: LeadInfo;
  sales_id: string;
  sales: SalesInfo | null;
  assigned_at: string;
  assigned_by: string;
  assigned_by_user: AssignedByUser;
  status: string;
  converted: boolean;
}

export interface AssignLeadRequest {
  lead_id: string;
  sales_id: string;
}

export interface AssignLeadResponse {
  status: string;
  code: number;
  message: string;
  data: LeadAssignment;
}

export interface AssignmentHistoryResponse {
  status: string;
  code: number;
  message: string;
  data: LeadAssignment[];
}

export interface SalesAssignmentsResponse {
  status: string;
  code: number;
  message: string;
  data: LeadAssignment[];
}

export interface UnassignLeadRequest {
  leadId: string;
  salesId: string;
}

export interface UnassignLeadResponse {
  status: string;
  code: number;
  message: string;
}

export const leadsAssignmentsApi = createApi({
  reducerPath: 'leadsAssignmentsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['LeadAssignment'],
  endpoints: (builder) => ({
    assignLead: builder.mutation<AssignLeadResponse, AssignLeadRequest>({
      query: (body) => ({
        url: 'api/v1/leads-assignments',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['LeadAssignment'],
    }),
    unassignLead: builder.mutation<UnassignLeadResponse, UnassignLeadRequest>({
      query: ({ leadId, salesId }) => ({
        url: `api/v1/leads-assignments/lead/${leadId}/sales/${salesId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['LeadAssignment'],
    }),
    getAssignmentHistory: builder.query<AssignmentHistoryResponse, string>({
      query: (leadId) => `api/v1/leads-assignments/lead/${leadId}?_t=${Date.now()}`,
      providesTags: (result, error, leadId) => [
        { type: 'LeadAssignment', id: `LEAD_${leadId}` },
        'LeadAssignment',
      ],
    }),
    getSalesAssignments: builder.query<SalesAssignmentsResponse, string>({
      query: (salesId) => `api/v1/leads-assignments/sales/${salesId}`,
      providesTags: (result, error, salesId) => [
        { type: 'LeadAssignment', id: `SALES_${salesId}` },
        'LeadAssignment',
      ],
    }),
  }),
});

export const {
  useAssignLeadMutation,
  useUnassignLeadMutation,
  useGetAssignmentHistoryQuery,
  useGetSalesAssignmentsQuery,
} = leadsAssignmentsApi;
