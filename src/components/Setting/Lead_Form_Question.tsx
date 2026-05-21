import React, { useMemo, useState } from 'react';
import { Sparkles, ChevronDown } from 'lucide-react';
import closeIcon from '../../assets/x-02.svg';
import filePlusIcon from '../../assets/file-plus-01.svg';

const PRIMARY = 'rgba(0, 35, 111, 1)';
const NEUTRAL_BORDER = '1px solid rgba(212, 213, 216, 1)';
const FIELD_WIDTH = 470;
const FIELD_BLOCK_HEIGHT = 75;
const INPUT_HEIGHT = 48;
const MODAL_WIDTH = 538;
const MODAL_MAX_HEIGHT = 560;

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

const getInputStyle = (value: string, saved: boolean): React.CSSProperties => {
  if (saved) {
    return {
      ...baseInputStyle,
      border: 'none',
      background: 'rgba(212, 213, 216, 1)',
      cursor: 'default',
    };
  }
  return {
    ...baseInputStyle,
    background: value.trim() ? '#fff' : 'transparent',
  };
};

interface LeadFormQuestionProps {
  onClose?: () => void;
  onSave?: (questions: string[]) => void;
}

const QUESTION_COUNTS = Array.from({ length: 10 }, (_, i) => i + 1);
const MAX_AI_TRIALS = 5;

const Lead_Form_Question: React.FC<LeadFormQuestionProps> = ({ onClose, onSave }) => {
  const [questionCount, setQuestionCount] = useState(10);
  const [questions, setQuestions] = useState<string[]>(() => Array(10).fill(''));
  const [isSaved, setIsSaved] = useState(false);
  const [aiTrialsUsed, setAiTrialsUsed] = useState(0);
  const [hasAiFilled, setHasAiFilled] = useState(false);

  const visibleQuestions = useMemo(() => questions.slice(0, questionCount), [questions, questionCount]);

  const allFilled = visibleQuestions.every((q) => q.trim() !== '');
  const isSaveEnabled = allFilled && !isSaved;

  const handleCountChange = (count: number) => {
    setQuestionCount(count);
    setQuestions((prev) => {
      const next = [...prev];
      while (next.length < count) next.push('');
      return next;
    });
    if (isSaved) setIsSaved(false);
  };

  const handleQuestionChange = (index: number, value: string) => {
    if (isSaved) return;
    setQuestions((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleAiAction = () => {
    if (aiTrialsUsed >= MAX_AI_TRIALS) return;
    setQuestions((prev) => {
      const next = [...prev];
      for (let i = 0; i < questionCount; i++) {
        next[i] = 'Input text';
      }
      return next;
    });
    setAiTrialsUsed((n) => Math.min(n + 1, MAX_AI_TRIALS));
    setHasAiFilled(true);
    setIsSaved(false);
  };

  const handleSave = () => {
    if (!isSaveEnabled) return;
    onSave?.(visibleQuestions);
    setIsSaved(true);
  };

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
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: NEUTRAL_BORDER,
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <img src={closeIcon} alt="" width={14} height={14} />
        </button>
      </div>

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexShrink: 0, width: '100%', maxWidth: FIELD_WIDTH, boxSizing: 'border-box' }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 500, color: '#141414' }}>
            Number of Questions
          </span>
          <div
            style={{
              position: 'relative',
              width: 72,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <select
              value={questionCount}
              onChange={(e) => handleCountChange(Number(e.target.value))}
              disabled={isSaved}
              style={{
                width: '100%',
                height: 40,
                padding: '0 28px 0 12px',
                borderRadius: 12,
                border: '1px solid rgba(212, 213, 216, 1)',
                fontFamily: 'Inter, sans-serif',
                fontSize: 14,
                color: '#141414',
                background: 'transparent',
                appearance: 'none',
                cursor: isSaved ? 'default' : 'pointer',
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {QUESTION_COUNTS.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <ChevronDown
              size={16}
              color="#464646"
              style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
            />
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
            flexShrink: 0,
            gap: 12,
            width: '100%',
            maxWidth: FIELD_WIDTH,
            boxSizing: 'border-box',
            flexWrap: 'wrap',
          }}
        >
          <button
            type="button"
            onClick={handleAiAction}
            disabled={isSaved || aiTrialsUsed >= MAX_AI_TRIALS}
            style={{
              display: 'flex',
              height: 32,
              padding: '8px 16px',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 8,
              borderRadius: 12,
              border: `1px solid ${PRIMARY}`,
              background: 'transparent',
              color: PRIMARY,
              fontFamily: 'Inter, sans-serif',
              fontSize: 14,
              fontWeight: 500,
              boxSizing: 'border-box',
              flexShrink: 0,
              cursor: isSaved || aiTrialsUsed >= MAX_AI_TRIALS ? 'not-allowed' : 'pointer',
              opacity: isSaved || aiTrialsUsed >= MAX_AI_TRIALS ? 0.6 : 1,
            }}
          >
            <Sparkles size={16} color={PRIMARY} />
            {hasAiFilled ? 'Regenerate' : 'AI Suggestion'}
          </button>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#6B7280', flexShrink: 1, minWidth: 0 }}>
            ({aiTrialsUsed}/{MAX_AI_TRIALS}) Monthly AI Trials
          </span>
        </div>

        <div
          style={{
            flex: 1,
            minHeight: 0,
            maxHeight: 280,
            overflowY: 'auto',
            overflowX: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            width: '100%',
            maxWidth: FIELD_WIDTH,
            boxSizing: 'border-box',
          }}
        >
          {visibleQuestions.map((q, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                width: '100%',
                maxWidth: FIELD_WIDTH,
                height: FIELD_BLOCK_HEIGHT,
                flexShrink: 0,
                boxSizing: 'border-box',
              }}
            >
              <label style={labelStyle}>
                Q{index + 1}<span style={{ color: PRIMARY }}>*</span>
              </label>
              <input
                type="text"
                value={q}
                onChange={(e) => handleQuestionChange(index, e.target.value)}
                readOnly={isSaved}
                placeholder="Input text"
                style={getInputStyle(q, isSaved)}
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={!isSaveEnabled}
          style={{
            marginTop: 20,
            marginBottom: 20,
            width: '100%',
            maxWidth: FIELD_WIDTH,
            height: 48,
            borderRadius: 12,
            border: 'none',
            background: isSaveEnabled ? PRIMARY : 'rgba(212, 213, 216, 1)',
            boxSizing: 'border-box',
            color: isSaveEnabled ? '#fff' : '#9CA3AF',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: 15,
            cursor: isSaveEnabled ? 'pointer' : 'not-allowed',
            flexShrink: 0,
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default Lead_Form_Question;
