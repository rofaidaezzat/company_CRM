import React, { useState, useRef, useEffect } from 'react';

const LEAD_STATUSES = [
  'Fresh',
  'Follow up',
  'Interested',
  'Not interested',
  'Meeting',
  'Wrong number',
  'No answer',
];

interface LeadsFilterProps {
  onApply?: (values: { from: string; to: string; status: string | null }) => void;
  onClear?: () => void;
  onClose?: () => void;
}

const Leads: React.FC<LeadsFilterProps> = ({ onApply, onClear, onClose }) => {
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
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

  const min = 0;
  const max = 100;
  let fromNum = parseInt(fromValue) || 0;
  let toNum = parseInt(toValue) || 100;
  if (fromNum < min) fromNum = min;
  if (toNum > max) toNum = max;
  if (fromNum > toNum) fromNum = toNum;
  const leftPercent = ((fromNum - min) / (max - min)) * 100;
  const rightPercent = ((toNum - min) / (max - min)) * 100;
  const activeWidth = rightPercent - leftPercent;

  const handleClear = () => {
    setFromValue('');
    setToValue('');
    setSelectedStatus(null);
    onClear?.();
    onClose?.();
  };

  const handleApply = () => {
    onApply?.({ from: fromValue, to: toValue, status: selectedStatus });
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
        gap: 16,
        boxSizing: 'border-box',
      }}
    >
      {/* Section 1: Number */}
      <div
        style={{
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 12,
          width: '100%',
        }}
      >
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 600, color: '#141414' }}>
          Number
        </span>

        {/* From / To inputs */}
        <div style={{ width: 290, height: 63, display: 'flex', alignItems: 'flex-end', gap: 8 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
            <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#374151' }}>From</label>
            <input
              type="number"
              value={fromValue}
              onChange={(e) => setFromValue(e.target.value)}
              style={{
                width: '100%',
                height: 36,
                border: '1px solid #D4D5D8',
                borderRadius: 8,
                padding: '0 10px',
                fontFamily: 'Inter, sans-serif',
                fontSize: 14,
                color: '#141414',
                outline: 'none',
                boxSizing: 'border-box',
                background: 'transparent',
              }}
            />
          </div>
          <span style={{ color: '#D4D5D8', fontSize: 16, marginBottom: 8 }}>–</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
            <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#374151' }}>To</label>
            <input
              type="number"
              value={toValue}
              onChange={(e) => setToValue(e.target.value)}
              style={{
                width: '100%',
                height: 36,
                border: '1px solid #D4D5D8',
                borderRadius: 8,
                padding: '0 10px',
                fontFamily: 'Inter, sans-serif',
                fontSize: 14,
                color: '#141414',
                outline: 'none',
                boxSizing: 'border-box',
                background: 'transparent',
              }}
            />
          </div>
        </div>

        {/* Progress/Range Visual */}
        <div style={{ display: 'flex', width: 320, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', gap: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', paddingBottom: 2 }}>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#4B5563' }}>0</span>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#4B5563' }}>100</span>
          </div>
          <div style={{ position: 'relative', width: 320, height: 20, display: 'flex', alignItems: 'center' }}>
            {/* Track background */}
            <div style={{ position: 'absolute', width: '100%', height: 8, borderRadius: 4, background: 'var(--Grey-100, #F6F7F9)' }} />
            {/* Active part */}
            <div
              style={{
                position: 'absolute',
                left: `${leftPercent}%`,
                width: `${activeWidth}%`,
                height: 8,
                borderRadius: 4,
                background: 'var(--Foundation-brand-brand-500, #00236F)',
              }}
            />
            {/* Left thumb */}
            <div
              style={{
                position: 'absolute',
                left: `calc(${leftPercent}% - 10px)`,
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: '#FFF',
                border: '2px solid #D4D5D8',
                boxSizing: 'border-box',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                alignSelf: 'stretch',
              }}
            />
            {/* Right thumb */}
            <div
              style={{
                position: 'absolute',
                left: `calc(${rightPercent}% - 10px)`,
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: '#FFF',
                border: '2px solid #D4D5D8',
                boxSizing: 'border-box',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ width: '100%', height: 1, background: '#E8E8F0' }} />

      {/* Section 2: Status */}
      <div
        style={{
          display: 'flex',
          width: '100%',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 12,
          alignSelf: 'flex-start',
        }}
      >
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 600, color: '#141414' }}>
          Status
        </span>

        {LEAD_STATUSES.map((status) => (
          <div
            key={status}
            onClick={() => setSelectedStatus(selectedStatus === status ? null : status)}
            style={{
              display: 'flex',
              height: 40,
              padding: 8,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
              gap: 8,
              alignSelf: 'stretch',
              borderRadius: 8,
              background: selectedStatus === status ? 'rgba(0, 35, 111, 0.06)' : 'transparent',
              cursor: 'pointer',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Radio circle */}
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  border: selectedStatus === status ? '6px solid #00236F' : '2px solid #D4D5D8',
                  background: '#FFF',
                  flexShrink: 0,
                  boxSizing: 'border-box',
                }}
              />
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#374151' }}>
                {status}
              </span>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#9CA3AF' }}>
                (200)
              </span>
            </div>
          </div>
        ))}
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

export default Leads;
