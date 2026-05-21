import React, { useState, useRef, useEffect } from 'react';

const STATUS_OPTIONS = [
  'Fresh',
  'Deal',
  'Interested',
  'Not interested',
  'Meeting',
  'After meeting followup',
  'Wrong number',
  'No answer',
];

interface StatusFilterProps {
  onApply?: (selected: string | null) => void;
  onClear?: () => void;
  onClose?: () => void;
}

const Status: React.FC<StatusFilterProps> = ({ onApply, onClear, onClose }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose?.();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={containerRef}
      style={{
        borderRadius: 12,
        background: 'var(--Foundation-neutral-white, #FFF)',
        boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.17)',
        display: 'inline-flex',
        padding: 12,
        alignItems: 'flex-start',
        gap: 4,
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 4,
        }}
      >
        {STATUS_OPTIONS.map((status) => (
          <div
            key={status}
            onClick={() => setSelected(selected === status ? null : status)}
            style={{
              display: 'flex',
              width: 274,
              height: 40,
              padding: 8,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
              gap: 8,
              borderRadius: 8,
              background: selected === status ? 'rgba(0, 35, 111, 0.06)' : 'transparent',
              cursor: 'pointer',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                display: 'flex',
                minWidth: 120,
                alignItems: 'center',
                gap: 12,
              }}
            >
              {/* Radio circle */}
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  border: selected === status ? '6px solid #00236F' : '2px solid #D4D5D8',
                  background: '#FFF',
                  flexShrink: 0,
                  boxSizing: 'border-box',
                }}
              />
              <span
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 14,
                  color: selected === status ? '#00236F' : '#374151',
                  fontWeight: selected === status ? 500 : 400,
                  whiteSpace: 'nowrap',
                }}
              >
                {status}
              </span>
              <span
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 13,
                  color: '#9CA3AF',
                }}
              >
                (200)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Status;
