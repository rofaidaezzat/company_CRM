import React, { useState, useRef, useEffect } from 'react';

const STATUS_OPTIONS = ['Active', 'Inactive', 'Paused', 'Deactivated'];

interface LeadsStatusProps {
  onApply?: (selected: string[]) => void;
  onClear?: () => void;
  onClose?: () => void;
}

const Leads_status: React.FC<LeadsStatusProps> = ({ onApply, onClear, onClose }) => {
  const [selected, setSelected] = useState<string[]>([]);
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

  const toggleOption = (option: string) => {
    setSelected((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };

  const handleApply = () => {
    onApply?.(selected);
    onClose?.();
  };

  const handleClear = () => {
    setSelected([]);
    onClear?.();
    onClose?.();
  };

  return (
    <div
      ref={containerRef}
      style={{
        borderRadius: 12,
        background: 'var(--Foundation-neutral-white, #FFF)',
        boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.17)',
        display: 'inline-flex',
        padding: '12px 16px',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        gap: 12,
        boxSizing: 'border-box',
      }}
    >
      {/* Options list */}
      <div
        style={{
          display: 'flex',
          width: 290,
          minWidth: 290,
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 12,
        }}
      >
        {STATUS_OPTIONS.map((option) => {
          const isActive = selected.includes(option);
          return (
            <div
              key={option}
              onClick={() => toggleOption(option)}
              style={{
                display: 'flex',
                width: 290,
                height: 40,
                padding: 8,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                gap: 8,
                borderRadius: 8,
                background: isActive ? 'rgba(0, 35, 111, 0.06)' : 'transparent',
                cursor: 'pointer',
                boxSizing: 'border-box',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* Checkbox */}
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    border: isActive ? 'none' : '1px solid #D4D5D8',
                    background: isActive ? '#00236F' : '#FFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxSizing: 'border-box',
                  }}
                >
                  {isActive && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L4.5 8.5L10 3" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 14,
                    color: isActive ? '#00236F' : '#374151',
                    fontWeight: isActive ? 500 : 400,
                  }}
                >
                  {option}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Divider */}
      <div style={{ width: '100%', height: 1, background: '#E8E8F0' }} />

      {/* Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={handleClear}
          style={{
            borderRadius: 12,
            display: 'flex',
            height: 48,
            padding: '8px',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8,
            background: 'transparent',
            border: 'none',
            color: '#00236F',
            fontFamily: 'Inter, sans-serif',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            minWidth: 57,
          }}
        >
          Clear
        </button>
        <button
          onClick={handleApply}
          style={{
            borderRadius: 12,
            background: 'var(--Foundation-brand-brand-500, #00236F)',
            display: 'flex',
            height: 48,
            padding: '8px 24px',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8,
            border: 'none',
            color: '#FFF',
            fontFamily: 'Inter, sans-serif',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default Leads_status;
