import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

export type QuestionType = 'TEXT' | 'NUMBER' | 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'BOOLEAN' | string;

export interface Question {
  id: string;
  tenant_id: string;
  question_text: string;
  question_type: QuestionType;
  options: string[] | null;
  is_required: boolean;
  is_active: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface QuestionSubmittedBy {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface QuestionResponseData {
  id: string | null;
  tenant_id: string;
  question_id: string;
  lead_id: string;
  submitted_by: QuestionSubmittedBy | null;
  answer: string | null;
  created_at: string | null;
  updated_at: string | null;
  question: Question;
}

export interface GetResponsesResponse {
  status: string;
  code: number;
  message: string;
  data: QuestionResponseData[];
}

export interface AnswerInput {
  question_id: string;
  answer: string;
}

export interface SubmitResponsesRequest {
  lead_id: string;
  responses: AnswerInput[];
}

export interface SubmitResponsesResponse {
  status: string;
  code: number;
  message: string;
  data: QuestionResponseData[];
}

export interface CreateQuestionsRequest {
  questions: Array<{
    question_text: string;
    question_type: QuestionType;
    options?: string[] | null;
    is_required?: boolean;
    is_active?: boolean;
    order?: number;
  }>;
}

export interface CreateQuestionsResponse {
  status: string;
  code: number;
  message: string;
  data: Question[];
}

export interface GetQuestionsParams {
  is_active?: boolean;
}

export interface GetQuestionsResponse {
  status: string;
  code: number;
  message: string;
  data: Question[];
}

export interface GetQuestionResponse {
  status: string;
  code: number;
  message: string;
  data: Question;
}

export interface UpdateQuestionRequest {
  id: string;
  body: {
    question_text?: string;
    question_type?: QuestionType;
    options?: string[] | null;
    is_required?: boolean;
    is_active?: boolean;
    order?: number;
  };
}

export interface DeleteQuestionResponse {
  status: string;
  code: number;
  message: string;
}

export const questionsApi = createApi({
  reducerPath: 'questionsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Question', 'QuestionResponse'],
  endpoints: (builder) => ({
    // POST /api/v1/questions — batch create questions
    createQuestions: builder.mutation<CreateQuestionsResponse, CreateQuestionsRequest>({
      query: (body) => ({
        url: 'api/v1/questions',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Question', id: 'LIST' }, { type: 'QuestionResponse', id: 'LIST' }],
    }),

    // GET /api/v1/questions — get all questions for the tenant
    getQuestions: builder.query<GetQuestionsResponse, GetQuestionsParams | void>({
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
        return `api/v1/questions${qs ? `?${qs}` : ''}`;
      },
      providesTags: (result) =>
        result
          ? [
            ...result.data.map(({ id }) => ({ type: 'Question' as const, id })),
            { type: 'Question', id: 'LIST' },
          ]
          : [{ type: 'Question', id: 'LIST' }],
    }),

    // PATCH /api/v1/questions/:id — update a single question
    updateQuestion: builder.mutation<GetQuestionResponse, UpdateQuestionRequest>({
      query: ({ id, body }) => ({
        url: `api/v1/questions/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Question', id },
        { type: 'Question', id: 'LIST' },
        { type: 'QuestionResponse', id: 'LIST' },
      ],
    }),

    // DELETE /api/v1/questions/:id — delete a single question
    deleteQuestion: builder.mutation<DeleteQuestionResponse, string>({
      query: (id) => ({
        url: `api/v1/questions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Question', id },
        { type: 'Question', id: 'LIST' },
        { type: 'QuestionResponse', id: 'LIST' },
      ],
    }),

    // GET /api/v1/questions/responses/lead/:leadId — retrieves all responses & questions for a lead
    getLeadResponses: builder.query<GetResponsesResponse, string>({
      query: (leadId) => `api/v1/questions/responses/lead/${leadId}?_t=${Date.now()}`,
      providesTags: (result, error, leadId) => [
        { type: 'QuestionResponse', id: `LEAD_${leadId}` },
        { type: 'QuestionResponse', id: 'LIST' },
      ],
    }),

    // POST /api/v1/questions/responses/lead/:leadId — submits responses (creates/updates)
    submitLeadResponses: builder.mutation<SubmitResponsesResponse, SubmitResponsesRequest>({
      query: ({ lead_id, responses }) => ({
        url: `api/v1/questions/responses/lead/${lead_id}`,
        method: 'POST',
        body: { responses },
      }),
      invalidatesTags: (result, error, { lead_id }) => [
        { type: 'QuestionResponse', id: `LEAD_${lead_id}` },
        { type: 'QuestionResponse', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useCreateQuestionsMutation,
  useGetQuestionsQuery,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
  useGetLeadResponsesQuery,
  useSubmitLeadResponsesMutation,
} = questionsApi;
