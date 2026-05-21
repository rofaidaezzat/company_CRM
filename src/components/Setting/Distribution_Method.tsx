import React from 'react';

const PRIMARY = 'rgba(0, 35, 111, 1)';
const SELECTED_BG = 'rgba(230, 233, 241, 1)';
const DROPDOWN_SHADOW = '0px 2px 4px 0px rgba(0, 0, 0, 0.17)';

export const DISTRIBUTION_OPTIONS = [
  {
    value: 'Automatic distribution',
    label: 'Automatic distribution',
    description:
      'Leads are assigned instantly based on predefined rules, availability, priority, or workload to ensure zero response delay.',
  },
  {
    value: 'Manual Distribution',
    label: 'Manual Distribution',
    description:
      'Leads are reviewed and assigned by a manager or team member for more control and flexibility.',
  },
] as const;

const RadioBtn = ({ selected }: { selected: boolean }) => (
  <div
    style={{
      width: 20,
      height: 20,
      borderRadius: '50%',
      border: selected ? `6px solid ${PRIMARY}` : '1px solid rgba(212, 213, 216, 1)',
      boxSizing: 'border-box',
      flexShrink: 0,
      marginTop: 2,
    }}
  />
);

interface DistributionMethodProps {
  value: string;
  onChange: (value: string) => void;
}

const Distribution_Method: React.FC<DistributionMethodProps> = ({ value, onChange }) => (
  <div
    style={{
      boxShadow: DROPDOWN_SHADOW,
      background: 'rgba(255, 255, 255, 1)',
      width: '100%',
      maxWidth: 573,
      minHeight: 186,
      height: 'auto',
      gap: 4,
      borderRadius: 12,
      padding: 12,
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    {DISTRIBUTION_OPTIONS.map((option) => {
      const selected = value === option.value;
      return (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 8,
            width: '100%',
            maxWidth: 549,
            minHeight: selected ? 79 : 40,
            height: selected ? 79 : 'auto',
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minWidth: 0 }}>
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 14,
                fontWeight: 500,
                color: '#141414',
              }}
            >
              {option.label}
            </span>
            {selected && (
              <span
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 12,
                  color: '#6B7280',
                  lineHeight: '140%',
                }}
              >
                {option.description}
              </span>
            )}
          </div>
        </button>
      );
    })}
  </div>
);

export default Distribution_Method;
