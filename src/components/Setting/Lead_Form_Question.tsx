import React, { useEffect, useMemo, useState } from 'react';
import { Sparkles, ChevronDown, Trash2 } from 'lucide-react';
import closeIcon from '../../assets/x-02.svg';
import filePlusIcon from '../../assets/file-plus-01.svg';
import {
  useGetQuestionsQuery,
  useCreateQuestionsMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
} from '../../app/service/crudQuestions';
import { toast } from 'sonner';

const PRIMARY = 'rgba(0, 35, 111, 1)';
const NEUTRAL_BORDER = '1px solid rgba(212, 213, 216, 1)';
const FIELD_WIDTH = 470;
const FIELD_BLOCK_HEIGHT = 75;
const INPUT_HEIGHT = 48;
const MODAL_WIDTH = 538;
const MODAL_MAX_HEIGHT = 580;

const labelStyle: React.CSSProperties = {
  fontFamily: 'Inter, sans-serif',
  fontWeight: 500,
  fontSize: 14,
  color: '#141414',
  lineHeight: '19px',
  margin: 0,
};

const baseInputStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: FIELD_WIDTH,
  height: INPUT_HEIGHT,
  border: '1px solid rgba(212, 213, 216, 1)',
  borderWidth: 1,
  borderRadius: 8,
  padding: 12,
  fontFamily: 'Inter, sans-serif',
  fontSize: 14,
  color: '#141414',
  outline: 'none',
  boxSizing: 'border-box',
};

interface LocalQuestion {
  id?: string;        // existing question id from API
  text: string;
  saved: boolean;     // true = synced to backend
  deleted?: boolean;  // marked for deletion
}

interface LeadFormQuestionProps {
  onClose?: () => void;
}

const QUESTION_COUNTS = Array.from({ length: 10 }, (_, i) => i + 1);
const MAX_AI_TRIALS = 5;

const Lead_Form_Question: React.FC<LeadFormQuestionProps> = ({ onClose }) => {
  // ── API hooks ──────────────────────────────────────────────────────────────
  const { data: questionsData, isLoading: isLoadingQuestions } = useGetQuestionsQuery();
  const [createQuestions, { isLoading: isCreating }] = useCreateQuestionsMutation();
  const [updateQuestion, { isLoading: isUpdating }] = useUpdateQuestionMutation();
  const [deleteQuestion] = useDeleteQuestionMutation();

  // ── Local state ────────────────────────────────────────────────────────────
  const [questionCount, setQuestionCount] = useState(5);
  const [questions, setQuestions] = useState<LocalQuestion[]>(() =>
    Array(5).fill(null).map(() => ({ text: '', saved: false }))
  );
  const [aiTrialsUsed, setAiTrialsUsed] = useState(0);
  const [hasAiFilled, setHasAiFilled] = useState(false);

  // ── Populate from API ──────────────────────────────────────────────────────
  useEffect(() => {
    if (questionsData?.data) {
      const apiQs = questionsData.data;
      if (apiQs.length > 0) {
        const loaded: LocalQuestion[] = apiQs.map((q) => ({
          id: q.id,
          text: q.question_text,
          saved: true,
        }));
        setQuestionCount(Math.max(apiQs.length, 1));
        // Pad to at least the count
        while (loaded.length < questionCount) {
          loaded.push({ text: '', saved: false });
        }
        setQuestions(loaded);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionsData]);

  const visibleQuestions = useMemo(() => questions.slice(0, questionCount), [questions, questionCount]);

  const allFilled = visibleQuestions.every((q) => q.text.trim() !== '');
  const isBusy = isCreating || isUpdating;

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleCountChange = (count: number) => {
    setQuestionCount(count);
    setQuestions((prev) => {
      const next = [...prev];
      while (next.length < count) next.push({ text: '', saved: false });
      return next;
    });
  };

  const handleQuestionChange = (index: number, value: string) => {
    setQuestions((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], text: value, saved: false };
      return next;
    });
  };

  const handleAiAction = () => {
    if (aiTrialsUsed >= MAX_AI_TRIALS) return;
    setQuestions((prev) => {
      const next = [...prev];
      for (let i = 0; i < questionCount; i++) {
        next[i] = { ...next[i], text: 'Input text', saved: false };
      }
      return next;
    });
    setAiTrialsUsed((n) => Math.min(n + 1, MAX_AI_TRIALS));
    setHasAiFilled(true);
  };

  const handleDeleteQuestion = async (index: number) => {
    const q = questions[index];
    if (q.id) {
      try {
        await deleteQuestion(q.id).unwrap();
        toast.success('Question deleted.');
      } catch {
        toast.error('Failed to delete question.');
        return;
      }
    }
    setQuestions((prev) => prev.filter((_, i) => i !== index));
    setQuestionCount((c) => Math.max(c - 1, 1));
  };

  const handleSave = async () => {
    if (!allFilled) {
      toast.error('Please fill in all questions.');
      return;
    }

    const toCreate: LocalQuestion[] = [];
    const toUpdate: LocalQuestion[] = [];

    visibleQuestions.forEach((q) => {
      if (q.id) {
        toUpdate.push(q);
      } else {
        toCreate.push(q);
      }
    });

    try {
      // Create new questions in one batch call
      if (toCreate.length > 0) {
        await createQuestions({
          questions: toCreate.map((q, i) => ({
            question_text: q.text.trim(),
            question_type: 'TEXT',
            is_required: true,
            is_active: true,
            order: (toUpdate.length) + i + 1,
          })),
        }).unwrap();
      }

      // Update existing questions one by one
      for (const q of toUpdate) {
        await updateQuestion({
          id: q.id!,
          body: { question_text: q.text.trim() },
        }).unwrap();
      }

      // Mark all as saved locally
      setQuestions((prev) =>
        prev.map((q) => ({ ...q, saved: true }))
      );

      toast.success('Questions saved successfully.');
      onClose?.();
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        (Array.isArray(err?.data?.message) ? err.data.message.join(', ') : null) ||
        'Failed to save questions.';
      toast.error(msg);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        width: MODAL_WIDTH,
        maxHeight: MODAL_MAX_HEIGHT,
        height: 'auto',
        opacity: 1,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 12,
        overflow: 'hidden',
        overflowX: 'hidden',
        boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.12)',
        background: 'rgba(245, 246, 250, 1)',
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          flexShrink: 0,
          background: 'rgba(245, 246, 250, 1)',
          borderBottom: NEUTRAL_BORDER,
          padding: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src={filePlusIcon} alt="" width={24} height={24} />
            <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 19, color: '#141414' }}>
              Lead Form Questions
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            width: 32, height: 32, borderRadius: '50%',
            border: NEUTRAL_BORDER, background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0,
          }}
        >
          <img src={closeIcon} alt="" width={14} height={14} />
        </button>
      </div>

      {/* ── Body ── */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          padding: '20px 34px 0',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflowX: 'hidden',
          width: '100%',
        }}
      >
        {isLoadingQuestions ? (
          <div style={{ padding: 40, color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
            Loading questions...
          </div>
        ) : (
          <>
            {/* Number of questions row */}
            <div
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: 16, flexShrink: 0,
                width: '100%', maxWidth: FIELD_WIDTH, boxSizing: 'border-box',
              }}
            >
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 500, color: '#141414' }}>
                Number of Questions
              </span>
              <div style={{ position: 'relative', width: 72, display: 'flex', alignItems: 'center', gap: 8 }}>
                <select
                  value={questionCount}
                  onChange={(e) => handleCountChange(Number(e.target.value))}
                  style={{
                    width: '100%', height: 40,
                    padding: '0 28px 0 12px', borderRadius: 12,
                    border: '1px solid rgba(212, 213, 216, 1)',
                    fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#141414',
                    background: 'transparent', appearance: 'none',
                    cursor: 'pointer', boxSizing: 'border-box',
                  }}
                >
                  {QUESTION_COUNTS.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
                <ChevronDown
                  size={16} color="#464646"
                  style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                />
              </div>
            </div>

            {/* AI suggestion row */}
            <div
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: 16, flexShrink: 0, gap: 12,
                width: '100%', maxWidth: FIELD_WIDTH, boxSizing: 'border-box', flexWrap: 'wrap',
              }}
            >
              <button
                type="button"
                onClick={handleAiAction}
                disabled={aiTrialsUsed >= MAX_AI_TRIALS}
                style={{
                  display: 'flex', height: 32, padding: '8px 16px',
                  justifyContent: 'center', alignItems: 'center', gap: 8,
                  borderRadius: 12, border: `1px solid ${PRIMARY}`,
                  background: 'transparent', color: PRIMARY,
                  fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 500,
                  boxSizing: 'border-box', flexShrink: 0,
                  cursor: aiTrialsUsed >= MAX_AI_TRIALS ? 'not-allowed' : 'pointer',
                  opacity: aiTrialsUsed >= MAX_AI_TRIALS ? 0.6 : 1,
                }}
              >
                <Sparkles size={16} color={PRIMARY} />
                {hasAiFilled ? 'Regenerate' : 'AI Suggestion'}
              </button>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#6B7280', flexShrink: 1, minWidth: 0 }}>
                ({aiTrialsUsed}/{MAX_AI_TRIALS}) Monthly AI Trials
              </span>
            </div>

            {/* Questions list */}
            <div
              style={{
                flex: 1, minHeight: 0, maxHeight: 280,
                overflowY: 'auto', overflowX: 'hidden',
                display: 'flex', flexDirection: 'column', gap: 12,
                width: '100%', maxWidth: FIELD_WIDTH, boxSizing: 'border-box',
              }}
            >
              {visibleQuestions.map((q, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex', flexDirection: 'column', gap: 8,
                    width: '100%', maxWidth: FIELD_WIDTH,
                    height: FIELD_BLOCK_HEIGHT, flexShrink: 0, boxSizing: 'border-box',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={labelStyle}>
                      Q{index + 1}<span style={{ color: PRIMARY }}>*</span>
                    </label>
                    {/* Delete button for existing/filled questions */}
                    {(q.id || q.text.trim()) && (
                      <button
                        type="button"
                        onClick={() => handleDeleteQuestion(index)}
                        style={{
                          background: 'transparent', border: 'none', cursor: 'pointer',
                          padding: 2, display: 'flex', alignItems: 'center',
                        }}
                        title="Delete question"
                      >
                        <Trash2 size={14} color="#DC2626" />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={q.text}
                    onChange={(e) => handleQuestionChange(index, e.target.value)}
                    placeholder="Enter your question"
                    style={{
                      ...baseInputStyle,
                      background: q.saved ? 'rgba(212, 213, 216, 0.35)' : (q.text.trim() ? '#fff' : 'transparent'),
                      borderColor: q.saved ? 'transparent' : 'rgba(212, 213, 216, 1)',
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Save button */}
            <button
              type="button"
              onClick={handleSave}
              disabled={!allFilled || isBusy}
              style={{
                marginTop: 20, marginBottom: 20,
                width: '100%', maxWidth: FIELD_WIDTH,
                height: 48, borderRadius: 12, border: 'none',
                background: allFilled && !isBusy ? PRIMARY : 'rgba(212, 213, 216, 1)',
                boxSizing: 'border-box',
                color: allFilled && !isBusy ? '#fff' : '#9CA3AF',
                fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 15,
                cursor: allFilled && !isBusy ? 'pointer' : 'not-allowed',
                flexShrink: 0,
              }}
            >
              {isBusy ? 'Saving...' : 'Save'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Lead_Form_Question;
