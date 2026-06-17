import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

// ─── Shared Sub-types ────────────────────────────────────────────────────────

export interface TicketCreatedBy {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'CLOSED';

// ─── Ticket Entity ────────────────────────────────────────────────────────────

export interface SupportTicket {
  id: string;
  tenant_id: string;
  created_by: TicketCreatedBy;
  title: string;
  description: string;
  status: TicketStatus;
  created_at: string;
  updated_at: string;
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface Pagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

// ─── Response shapes ──────────────────────────────────────────────────────────

export interface GetTicketsResponse {
  status: string;
  code: number;
  message: string;
  data: SupportTicket[];
  pagination: Pagination;
}

export interface GetTicketResponse {
  status: string;
  code: number;
  message: string;
  data: SupportTicket;
}

export interface DeleteTicketResponse {
  status: string;
  code: number;
  message: string;
}

// ─── Request shapes ───────────────────────────────────────────────────────────

export interface GetTicketsParams {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  tenant_id?: string;
  status?: TicketStatus;
}

export interface CreateTicketRequest {
  title: string;
  description: string;
  /** Required only for Admin / Tech-Support roles */
  tenant_id?: string;
}

export interface UpdateTicketRequest {
  id: string;
  body: {
    title?: string;
    description?: string;
    /** Only system roles (1, 2) or ticket creator may update status */
    status?: TicketStatus;
  };
}

export interface SupportMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  sender: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  message: string;
  created_at: string;
  updated_at: string;
}

export interface GetMessagesResponse {
  status: string;
  code: number;
  message: string;
  data: SupportMessage[];
  pagination: Pagination;
}

export interface GetMessagesParams {
  ticketId: string;
  page?: number;
  limit?: number;
}

export interface CreateMessageRequest {
  ticketId: string;
  message: string;
}

export interface CreateMessageResponse {
  status: string;
  code: number;
  message: string;
  data: SupportMessage;
}

// ─── API slice ────────────────────────────────────────────────────────────────

export const supportApi = createApi({
  reducerPath: 'supportApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['SupportTicket', 'SupportMessage'],
  endpoints: (builder) => ({

    // GET /api/v1/support  — paginated list with filters
    getTickets: builder.query<GetTicketsResponse, GetTicketsParams | void>({
      query: (params) => {
        const urlParams = new URLSearchParams();
        if (params) {
          Object.entries(params).forEach(([key, val]) => {
            if (val !== undefined && val !== null && val !== '') {
              urlParams.append(key, String(val));
            }
          });
        }
        const qs = urlParams.toString();
        return `api/v1/support${qs ? `?${qs}` : ''}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'SupportTicket' as const, id })),
              { type: 'SupportTicket', id: 'LIST' },
            ]
          : [{ type: 'SupportTicket', id: 'LIST' }],
    }),

    // GET /api/v1/support/:id  — single ticket
    getTicketById: builder.query<GetTicketResponse, string>({
      query: (id) => `api/v1/support/${id}`,
      providesTags: (result, error, id) => [{ type: 'SupportTicket', id }],
    }),

    // POST /api/v1/support  — create
    createTicket: builder.mutation<GetTicketResponse, CreateTicketRequest>({
      query: (body) => ({
        url: 'api/v1/support',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'SupportTicket', id: 'LIST' }],
    }),

    // PATCH /api/v1/support/:id  — update title / description / status
    updateTicket: builder.mutation<GetTicketResponse, UpdateTicketRequest>({
      query: ({ id, body }) => ({
        url: `api/v1/support/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'SupportTicket', id },
        { type: 'SupportTicket', id: 'LIST' },
      ],
    }),

    // DELETE /api/v1/support/:id
    deleteTicket: builder.mutation<DeleteTicketResponse, string>({
      query: (id) => ({
        url: `api/v1/support/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'SupportTicket', id },
        { type: 'SupportTicket', id: 'LIST' },
      ],
    }),

    // GET /api/v1/support/:ticketId/messages — paginated messages for a ticket
    getSupportMessages: builder.query<GetMessagesResponse, GetMessagesParams>({
      query: ({ ticketId, page = 1, limit = 100 }) =>
        `api/v1/support/${ticketId}/messages?page=${page}&limit=${limit}`,
      providesTags: (result, error, { ticketId }) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'SupportMessage' as const, id })),
              { type: 'SupportMessage', id: `LIST_${ticketId}` },
            ]
          : [{ type: 'SupportMessage', id: `LIST_${ticketId}` }],
    }),

    // POST /api/v1/support/:ticketId/messages — create message
    createSupportMessage: builder.mutation<CreateMessageResponse, CreateMessageRequest>({
      query: ({ ticketId, message }) => ({
        url: `api/v1/support/${ticketId}/messages`,
        method: 'POST',
        body: { message },
      }),
      invalidatesTags: (result, error, { ticketId }) => [
        { type: 'SupportMessage', id: `LIST_${ticketId}` },
      ],
    }),
  }),
});

export const {
  useGetTicketsQuery,
  useGetTicketByIdQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
  useGetSupportMessagesQuery,
  useCreateSupportMessageMutation,
} = supportApi;
