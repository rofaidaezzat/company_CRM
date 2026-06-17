import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

// ─── Shared types ───────────────────────────────────────────────────────────

export interface SalesMember {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  avatar?: string | null;
  status?: string;
  created_at?: string;
  updated_at?: string;
  managerAssignments?: ManagerAssignment[];
  sales?: {
    id: string;
    status: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
    avatar?: string;
    tenant_id?: string;
  } | null;
}

export interface SalesManager {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  avatar?: string | null;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ManagerAssignment {
  id: string;
  manager_id: string;
  sales_member_id: string;
  assigned_at: string;
  manager?: SalesManager;
}

export interface Pagination {
  currentPage: number;
  limit: number;
  totalPages: number;
  total: number;
}

// ─── Response types ──────────────────────────────────────────────────────────

export interface GetManagersResponse {
  status: string;
  code: number;
  message: string;
  pagination: Pagination;
  data: SalesManager[];
}

export interface GetMembersResponse {
  status: string;
  code: number;
  message: string;
  pagination?: Pagination;
  data: SalesMember[];
}

export interface AssignMembersResponse {
  status: string;
  code: number;
  message: string;
  data: ManagerAssignment[];
}

export interface UnassignMemberResponse {
  status: string;
  code: number;
  message: string;
  data: { success: boolean };
}

export interface GetAssignedMembersResponse {
  status: string;
  code: number;
  message: string;
  pagination: Pagination;
  data: SalesMember[];
}

// ─── Request types ────────────────────────────────────────────────────────────

export interface SalesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
}

export interface AssignMembersRequest {
  managerId: string;
  sales_member_ids: string[];
}

export interface UnassignMemberRequest {
  managerId: string;
  memberId: string;
}

export interface GetAssignedMembersRequest {
  managerId: string;
  params?: SalesQueryParams;
}

// ─── API ──────────────────────────────────────────────────────────────────────

export const salesApi = createApi({
  reducerPath: 'salesApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Manager', 'Member', 'Assignment'],
  endpoints: (builder) => ({

    // 1. Assign Members to a Manager
    assignMembers: builder.mutation<AssignMembersResponse, AssignMembersRequest>({
      query: ({ managerId, sales_member_ids }) => ({
        url: `api/v1/sales/managers/${managerId}/assign-members`,
        method: 'POST',
        body: { sales_member_ids },
      }),
      invalidatesTags: (result, error, { managerId }) => [
        { type: 'Assignment', id: managerId },
        { type: 'Member', id: 'LIST' },
      ],
    }),

    // 2. Unassign a Member from a Manager
    unassignMember: builder.mutation<UnassignMemberResponse, UnassignMemberRequest>({
      query: ({ managerId, memberId }) => ({
        url: `api/v1/sales/managers/${managerId}/assigned-members/${memberId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { managerId, memberId }) => [
        { type: 'Assignment', id: managerId },
        { type: 'Member', id: memberId },
        { type: 'Member', id: 'LIST' },
      ],
    }),

    // 3. Get Manager's Assigned Members
    getAssignedMembers: builder.query<GetAssignedMembersResponse, GetAssignedMembersRequest>({
      query: ({ managerId, params }) => {
        const urlParams = new URLSearchParams();
        if (params) {
          Object.entries(params).forEach(([key, val]) => {
            if (val !== undefined && val !== null && val !== '') {
              urlParams.append(key, val.toString());
            }
          });
        }
        const qs = urlParams.toString();
        return `api/v1/sales/managers/${managerId}/assigned-members${qs ? `?${qs}` : ''}`;
      },
      providesTags: (result, error, { managerId }) => [{ type: 'Assignment', id: managerId }],
    }),

    // 4. Get All Managers
    getManagers: builder.query<GetManagersResponse, SalesQueryParams | void>({
      query: (params) => {
        const urlParams = new URLSearchParams();
        if (params) {
          Object.entries(params).forEach(([key, val]) => {
            if (val !== undefined && val !== null && val !== '') {
              urlParams.append(key, val.toString());
            }
          });
        }
        const qs = urlParams.toString();
        return `api/v1/sales/managers${qs ? `?${qs}` : ''}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Manager' as const, id })),
              { type: 'Manager', id: 'LIST' },
            ]
          : [{ type: 'Manager', id: 'LIST' }],
    }),

    // 5. Get All Sales Members
    getSalesMembers: builder.query<GetMembersResponse, SalesQueryParams | void>({
      query: (params) => {
        const urlParams = new URLSearchParams();
        if (params) {
          Object.entries(params).forEach(([key, val]) => {
            if (val !== undefined && val !== null && val !== '') {
              urlParams.append(key, val.toString());
            }
          });
        }
        const qs = urlParams.toString();
        return `api/v1/sales/members${qs ? `?${qs}` : ''}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Member' as const, id })),
              { type: 'Member', id: 'LIST' },
            ]
          : [{ type: 'Member', id: 'LIST' }],
    }),

  }),
});

export const {
  useAssignMembersMutation,
  useUnassignMemberMutation,
  useGetAssignedMembersQuery,
  useGetManagersQuery,
  useGetSalesMembersQuery,
} = salesApi;
