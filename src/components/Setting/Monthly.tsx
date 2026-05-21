import React from 'react';

const PRIMARY = 'rgba(0, 35, 111, 1)';
const SELECTED_BG = 'rgba(230, 233, 241, 1)';
const DROPDOWN_SHADOW = '0px 2px 4px 0px rgba(0, 0, 0, 0.17)';

export const PERIOD_OPTIONS = ['Monthly', 'Quarterly', 'Semi-annual', 'Yearly'] as const;
export type PeriodOption = (typeof PERIOD_OPTIONS)[number];

const RadioBtn = ({ selected }: { selected: boolean }) => (
  <div
    style={{
      width: 20,
      height: 20,
      borderRadius: '50%',
      border: selected ? `6px solid ${PRIMARY}` : '1px solid rgba(212, 213, 216, 1)',
      boxSizing: 'border-box',
      flexShrink: 0,
    }}
  />
);

interface MonthlyProps {
  value: string;
  onChange: (value: string) => void;
}

const Monthly: React.FC<MonthlyProps> = ({ value, onChange }) => (
  <div
    style={{
      boxShadow: DROPDOWN_SHADOW,
      background: 'rgba(255, 255, 255, 1)',
      width: 183,
      height: 196,
      gap: 4,
      borderRadius: 12,
      padding: 12,
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    {PERIOD_OPTIONS.map((option) => {
      const selected = value === option;
      return (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            width: 159,
            height: 40,
            padding: 8,
            margin: 0,
            border: 'none',
            borderRadius: 8,
            background: selected ? SELECTED_BG : 'transparent',
            cursor: 'pointer',
            boxSizing: 'border-box',
            textAlign: 'left',
          }}
        >
          <RadioBtn selected={selected} />
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 14,
              fontWeight: 500,
              color: '#141414',
            }}
          >
            {option}
          </span>
        </button>
      );
    })}
  </div>
);

export default Monthly;
