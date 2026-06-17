import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

export interface NoteAuthor {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface Note {
  id: string;
  tenant_id: string;
  lead_id: string;
  author: NoteAuthor;
  content: string;
  note_type: string;
  pinned: boolean;
  pinned_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface GetNotesResponse {
  status: string;
  code: number;
  message: string;
  data: Note[];
}

export interface GetNoteResponse {
  status: string;
  code: number;
  message: string;
  data: Note;
}

export interface CreateNoteRequest {
  lead_id: string;
  content: string;
  note_type?: 'PUBLIC' | 'PRIVATE' | string;
  pinned?: boolean;
}

export interface UpdateNoteRequest {
  id: string;
  body: {
    content?: string;
    note_type?: 'PUBLIC' | 'PRIVATE' | string;
    pinned?: boolean;
  };
}

export interface DeleteNoteResponse {
  status: string;
  code: number;
  message: string;
}

export const notesApi = createApi({
  reducerPath: 'notesApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Note'],
  endpoints: (builder) => ({
    getNotesForLead: builder.query<GetNotesResponse, string>({
      query: (leadId) => `api/v1/notes/lead/${leadId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Note' as const, id })),
              { type: 'Note', id: 'LIST' },
            ]
          : [{ type: 'Note', id: 'LIST' }],
    }),
    getNoteById: builder.query<GetNoteResponse, string>({
      query: (id) => `api/v1/notes/${id}`,
      providesTags: (result, error, id) => [{ type: 'Note', id }],
    }),
    createNote: builder.mutation<GetNoteResponse, CreateNoteRequest>({
      query: (body) => ({
        url: 'api/v1/notes',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Note', id: 'LIST' }],
    }),
    updateNote: builder.mutation<GetNoteResponse, UpdateNoteRequest>({
      query: ({ id, body }) => ({
        url: `api/v1/notes/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Note', id },
        { type: 'Note', id: 'LIST' },
      ],
    }),
    deleteNote: builder.mutation<DeleteNoteResponse, string>({
      query: (id) => ({
        url: `api/v1/notes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Note', id },
        { type: 'Note', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetNotesForLeadQuery,
  useGetNoteByIdQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = notesApi;
