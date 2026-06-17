import React, { useState, useRef, useEffect } from 'react';
import "../../styles/filteration-mobile.css";

interface FollowUpProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (data: {
    filterType: string;
    startDate: string;
    endDate: string;
  }) => void;
  onClear?: () => void;
  defaultFilter?: string;
  defaultStartDate?: string;
  defaultEndDate?: string;
  followUpCounts?: Record<string, number>;
}

const followUpOptions = [
  { value: 'today', label: 'Today', countKey: 'today' },
  { value: 'tomorrow', label: 'Tomorrow', countKey: 'tomorrow' },
  { value: 'this-week', label: 'This week', countKey: 'thisWeek' },
  { value: 'next-week', label: 'Next week', countKey: 'nextWeek' },
  { value: 'no-followup', label: 'No followup', countKey: 'noFollowup' },
  { value: 'missed', label: 'Missed', countKey: 'missed' },
];

export const FollowUp: React.FC<FollowUpProps> = ({
  isOpen,
  onClose,
  onApply,
  onClear,
  defaultFilter,
  defaultStartDate,
  defaultEndDate,
  followUpCounts,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(defaultFilter || null);
  const [startDate, setStartDate] = useState(defaultStartDate || "");
  const [endDate, setEndDate] = useState(defaultEndDate || "");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose?.();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const handleClear = () => {
    setSelectedPreset(null);
    setStartDate("");
    setEndDate("");
    onClear?.();
    onClose?.();
  };

  const handleApply = () => {
    if (onApply) onApply({ filterType: selectedPreset || '', startDate, endDate });
    if (onClose) onClose();
  };

  if (isOpen !== undefined && !isOpen) return null;

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: 48,
    border: "1px solid rgba(212, 213, 216, 1)",
    borderRadius: 8,
    padding: "0 14px",
    fontFamily: "Inter, sans-serif",
    fontSize: 14,
    color: "#141414",
    background: "transparent",
    outline: "none",
    boxSizing: "border-box",
    cursor: "pointer",
    transition: "border-color 0.2s",
  };

  return (
    <div
      ref={containerRef}
      className="filter-modal"
      style={{
        width: 520,
        height: 400,
        background: "rgba(255, 255, 255, 1)",
        borderRadius: 12,
        boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.17)",
        padding: "12px 16px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        fontFamily: "Inter, sans-serif",
        opacity: 1,
      }}
    >
      {/* ── Main content row ── */}
      <div
        className="filter-split"
        style={{
          width: 488,
          height: 304,
          display: "flex",
          gap: 12,
          flexShrink: 0,
        }}
      >
        {/* Left – preset radio list */}
        <div
          className="filter-split-item filter-list"
          style={{
            width: 187,
            height: 304,
            display: "flex",
            flexDirection: "column",
            gap: 4,
            flexShrink: 0,
            borderRight: "1px solid rgba(212, 213, 216, 1)",
            paddingRight: 8,
            boxSizing: "border-box",
          }}
        >
          {followUpOptions.map((preset) => {
            const active = selectedPreset === preset.label;
            const count = followUpCounts?.[preset.countKey];
            return (
              <div
                key={preset.label}
                onClick={() => setSelectedPreset(preset.label)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px",
                  borderRadius: 8,
                  cursor: "pointer",
                  background: active
                    ? "rgba(245, 246, 250, 1)"
                    : "transparent",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (!active)
                    e.currentTarget.style.background = "rgba(245,246,250,0.6)";
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.background = "transparent";
                }}
              >
                {/* Custom radio */}
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    border: `2px solid ${
                      active
                        ? "rgba(0, 35, 111, 1)"
                        : "rgba(212, 213, 216, 1)"
                    }`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "border-color 0.15s",
                  }}
                >
                  {active && (
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: "rgba(0, 35, 111, 1)",
                      }}
                    />
                  )}
                </div>

                <span
                  className="filter-text"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 14,
                    color: "#141414",
                    fontWeight: 400,
                  }}
                >
                  {preset.label}
                </span>
                {count !== undefined && (
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: 13,
                      color: "#6B7280",
                      fontWeight: 400,
                    }}
                  >
                    ({count})
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Right – date inputs */}
        <div
          className="filter-split-item"
          style={{
            width: 277,
            height: 158,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            margin: "auto 0",
            gap: 24,
          }}
        >
          {/* Start Date */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <label
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#141414",
                }}
              >
                Start date
              </label>
              <button
                onClick={() => setStartDate("")}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "rgba(0, 35, 111, 1)",
                  padding: 0,
                }}
              >
                Clear
              </button>
            </div>
            <input
              type="date"
              className="filter-input"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setSelectedPreset(null);
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = "rgba(0, 35, 111, 1)")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "rgba(212, 213, 216, 1)")
              }
              style={inputStyle}
            />
          </div>

          {/* End Date */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <label
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#141414",
                }}
              >
                End date
              </label>
              <button
                onClick={() => setEndDate("")}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "rgba(0, 35, 111, 1)",
                  padding: 0,
                }}
              >
                Clear
              </button>
            </div>
            <input
              type="date"
              className="filter-input"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setSelectedPreset(null);
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = "rgba(0, 35, 111, 1)")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "rgba(212, 213, 216, 1)")
              }
              style={inputStyle}
            />
          </div>
        </div>
      </div>

      {/* ── Divider ── */}
      <div
        style={{
          width: "100%",
          height: 1,
          background: "rgba(212, 213, 216, 1)",
          flexShrink: 0,
        }}
      />

      {/* ── Footer – Clear + Apply ── */}
      <div
        className="filter-buttons"
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 12,
          height: 48,
          flexShrink: 0,
        }}
      >
        {/* Clear button */}
        <button
          onClick={handleClear}
          style={{
            height: 48,
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            fontSize: 15,
            fontWeight: 600,
            color: "rgba(0, 35, 111, 1)",
            padding: "8px 16px",
            borderRadius: 12,
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(0,35,111,0.06)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "none")
          }
        >
          Clear
        </button>

        {/* Apply button */}
        <button
          onClick={handleApply}
          style={{
            width: 92,
            height: 48,
            background: "rgba(0, 35, 111, 1)",
            border: "none",
            borderRadius: 12,
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            fontSize: 15,
            fontWeight: 600,
            color: "#ffffff",
            padding: "8px 24px",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(0, 25, 85, 1)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(0, 35, 111, 1)")
          }
        >
          Apply
        </button>
      </div>
    </div>
  );
};
export default FollowUp;