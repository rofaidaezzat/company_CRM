import React, { useState, useEffect, useRef } from 'react';

interface MonthFilterProps {
  selectedOption?: string;
  onChange?: (option: string) => void;
  onClickOutside?: () => void;
  onClear?: () => void;
  onApply?: (data: { option: string; startDate: string; endDate: string }) => void;
}

const options = [
  "This month",
  "Last month",
  "Last 3 months",
  "Last 6 months",
  "Last year",
];

const Month_filter: React.FC<MonthFilterProps> = ({
  selectedOption: initial = "This month",
  onChange,
  onClickOutside,
  onClear,
  onApply,
}) => {
  const [selected, setSelected] = useState(initial);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (onClickOutside) onClickOutside();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClickOutside]);

  const handleSelect = (option: string) => {
    setSelected(option);
    setStartDate("");
    setEndDate("");
    if (onChange) onChange(option);
  };

  const handleCustomDateChange = (type: "start" | "end", val: string) => {
    setSelected("");
    if (type === "start") setStartDate(val);
    else setEndDate(val);
  };

  const handleClear = () => {
    setSelected("This month");
    setStartDate("");
    setEndDate("");
    if (onClear) onClear();
    if (onChange) onChange("This month");
  };

  const handleApply = () => {
    if (onApply) {
      onApply({ option: selected, startDate, endDate });
    }
    if (onClickOutside) onClickOutside();
  };

  const formatDateForDisplay = (isoStr: string) => {
    if (!isoStr) return "";
    const [y, m, d] = isoStr.split("-");
    return `${d}/${m}/${y}`;
  };

  const dateInputStyle: React.CSSProperties = {
    position: "relative",
    display: "flex",
    width: "180px",
    height: "40px",
    padding: "0 12px",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: "8px",
    border: "1px solid var(--Foundation-neutral-neutral-100, #D4D5D8)",
    background: "#FFF",
    cursor: "pointer",
    boxSizing: "border-box",
  };

  const CalendarIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M5.5 8.91425H19.5M7.30952 3V4.54304M17.5 3V4.54285M17.5 4.54285H7.5C5.84315 4.54285 4.5 5.92436 4.5 7.62855V17.9143C4.5 19.6185 5.84315 21 7.5 21H17.5C19.1569 21 20.5 19.6185 20.5 17.9143L20.5 7.62855C20.5 5.92436 19.1569 4.54285 17.5 4.54285ZM12.5 12V14.5714M12.5 14.5714V17.1428M12.5 14.5714H15M12.5 14.5714H10"
        stroke="#464646"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div
      ref={containerRef}
      style={{
        borderRadius: "12px",
        background: "var(--Foundation-neutral-white, #FFF)",
        boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.17)",
        display: "inline-flex",
        padding: "12px 16px",
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "flex-end",
        gap: "12px",
        fontFamily: "Inter, sans-serif",
        boxSizing: "border-box",
        border: "1px solid rgba(229, 231, 235, 1)",
      }}
    >
      {/* ── Body: Presets + Date Inputs ── */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "flex-start",
          boxSizing: "border-box",
          width: "100%",
        }}
      >
        {/* Left Column: Preset Radios */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            boxSizing: "border-box",
            width: "172px",
            paddingInlineEnd: "12px",
            borderInlineEnd: "1px solid #E5E7EB",
            alignSelf: "stretch",
          }}
        >
          {options.map((option) => {
            const isSelected = selected === option;
            return (
              <div
                key={option}
                onClick={() => handleSelect(option)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  width: "160px",
                  height: "40px",
                  padding: "8px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  background: isSelected ? "#E6E9F1" : "transparent",
                  transition: "background 0.15s ease",
                  boxSizing: "border-box",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = "#F3F4F6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isSelected ? "#E6E9F1" : "transparent";
                }}
              >
                {/* Custom Radio Button */}
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    border: `2px solid ${isSelected ? "var(--Foundation-brand-brand-500, #00236F)" : "#D4D5D8"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxSizing: "border-box",
                    flexShrink: 0,
                  }}
                >
                  {isSelected && (
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: "var(--Foundation-brand-brand-500, #00236F)",
                      }}
                    />
                  )}
                </div>

                {/* Preset label */}
                <span
                  style={{
                    color: "var(--Foundation-neutral-neutral-800, #464646)",
                    fontSize: "14px",
                    fontWeight: isSelected ? 500 : 400,
                  }}
                >
                  {option}
                </span>
              </div>
            );
          })}
        </div>

        {/* Right Column: Custom Start / End Date Inputs */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            boxSizing: "border-box",
            width: "180px",
          }}
        >
          {/* Start Date */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <label style={{ fontSize: "13px", fontWeight: 500, color: "#141414" }}>
                Start date
              </label>
              {startDate && (
                <button
                  type="button"
                  onClick={() => setStartDate("")}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "var(--Foundation-brand-brand-500, #00236F)",
                  }}
                >
                  Clear
                </button>
              )}
            </div>
            <div onClick={() => startInputRef.current?.showPicker()} style={dateInputStyle}>
              <span style={{ fontSize: "14px", color: startDate ? "#141414" : "#9CA3AF" }}>
                {startDate ? formatDateForDisplay(startDate) : "DD/MM/YYYY"}
              </span>
              <CalendarIcon />
              <input
                ref={startInputRef}
                type="date"
                value={startDate}
                onChange={(e) => handleCustomDateChange("start", e.target.value)}
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0,
                  cursor: "pointer",
                  width: "100%",
                  height: "100%",
                  zIndex: -1,
                }}
              />
            </div>
          </div>

          {/* End Date */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <label style={{ fontSize: "13px", fontWeight: 500, color: "#141414" }}>
                End date
              </label>
              {endDate && (
                <button
                  type="button"
                  onClick={() => setEndDate("")}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "var(--Foundation-brand-brand-500, #00236F)",
                  }}
                >
                  Clear
                </button>
              )}
            </div>
            <div onClick={() => endInputRef.current?.showPicker()} style={dateInputStyle}>
              <span style={{ fontSize: "14px", color: endDate ? "#141414" : "#9CA3AF" }}>
                {endDate ? formatDateForDisplay(endDate) : "DD/MM/YYYY"}
              </span>
              <CalendarIcon />
              <input
                ref={endInputRef}
                type="date"
                value={endDate}
                onChange={(e) => handleCustomDateChange("end", e.target.value)}
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0,
                  cursor: "pointer",
                  width: "100%",
                  height: "100%",
                  zIndex: -1,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer: Clear + Apply ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "12px",
          width: "100%",
          boxSizing: "border-box",
          marginTop: "4px",
        }}
      >
        {/* Clear button */}
        <button
          type="button"
          onClick={handleClear}
          style={{
            display: "flex",
            height: "48px",
            padding: "8px",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            borderRadius: "12px",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
            fontWeight: 600,
            color: "var(--Foundation-brand-brand-500, #00236F)",
            transition: "background 0.15s ease",
            boxSizing: "border-box",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#F9FAFB")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
        >
          Clear
        </button>

        {/* Apply button */}
        <button
          type="button"
          onClick={handleApply}
          style={{
            display: "flex",
            height: "48px",
            padding: "8px 24px",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            borderRadius: "12px",
            background: "var(--Foundation-brand-brand-500, #00236F)",
            color: "#FFF",
            border: "none",
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
            fontWeight: 600,
            transition: "background 0.15s ease",
            boxSizing: "border-box",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0, 25, 85, 1)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--Foundation-brand-brand-500, #00236F)")}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default Month_filter;
