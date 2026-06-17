import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

// ── Nested types ──────────────────────────────────────────────────────────────

export interface TaskUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface TaskLead {
  id: string;
  name: string;
  phone: string;
  email: string | null;
}

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type TaskStatus   = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

// ── Task entity ───────────────────────────────────────────────────────────────

export interface Task {
  id: string;
  tenant_id: string;
  created_by: TaskUser;
  lead_id: string;
  lead: TaskLead;
  sales: TaskUser;
  title: string;
  description: string;
  due_date: string;
  reminder_at: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

// ── Response shapes ───────────────────────────────────────────────────────────

export interface Pagination {
  currentPage: number;
  limit: number;
  totalPages: number;
  total: number;
}

export interface GetTasksResponse {
  status: string;
  code: number;
  pagination: Pagination;
  message: string;
  data: Task[];
}

export interface GetTaskResponse {
  status: string;
  code: number;
  message: string;
  data: Task;
}

export interface DeleteTaskResponse {
  status: string;
  code: number;
  message: string;
}

// ── Request shapes ────────────────────────────────────────────────────────────

export interface CreateTaskRequest {
  title: string;
  description?: string;
  lead_id?: string;
  sales_id?: string;
  due_date: string;           // ISO-8601
  reminder_at?: string;       // ISO-8601
  priority?: TaskPriority;
}

export interface UpdateTaskRequest {
  id: string;
  body: {
    title?: string;
    description?: string;
    lead_id?: string | null;
    sales_id?: string;
    due_date?: string;
    reminder_at?: string | null;
    priority?: TaskPriority;
    status?: TaskStatus;
  };
}

// ── RTK Query API ─────────────────────────────────────────────────────────────

export const tasksApi = createApi({
  reducerPath: 'tasksApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Task'],
  endpoints: (builder) => ({

    // GET /api/v1/tasks
    getTasks: builder.query<GetTasksResponse, void>({
      query: () => 'api/v1/tasks',
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Task' as const, id })),
              { type: 'Task', id: 'LIST' },
            ]
          : [{ type: 'Task', id: 'LIST' }],
    }),

    // GET /api/v1/tasks/:id
    getTaskById: builder.query<GetTaskResponse, string>({
      query: (id) => `api/v1/tasks/${id}`,
      providesTags: (result, error, id) => [{ type: 'Task', id }],
    }),

    // POST /api/v1/tasks
    createTask: builder.mutation<GetTaskResponse, CreateTaskRequest>({
      query: (body) => ({
        url: 'api/v1/tasks',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Task', id: 'LIST' }],
    }),

    // PATCH /api/v1/tasks/:id
    updateTask: builder.mutation<GetTaskResponse, UpdateTaskRequest>({
      query: ({ id, body }) => ({
        url: `api/v1/tasks/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Task', id },
        { type: 'Task', id: 'LIST' },
      ],
    }),

    // DELETE /api/v1/tasks/:id
    deleteTask: builder.mutation<DeleteTaskResponse, string>({
      query: (id) => ({
        url: `api/v1/tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Task', id },
        { type: 'Task', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskByIdQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = tasksApi;
