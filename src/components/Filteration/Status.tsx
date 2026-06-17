import React, { useState, useRef, useEffect } from "react";
import "../../styles/filteration-mobile.css";

const STATUS_OPTIONS: { label: string; apiKey: string }[] = [
  { label: "Fresh", apiKey: "FRESH" },
  { label: "Deal", apiKey: "DEAL" },
  { label: "Interested", apiKey: "INTERESTED" },
  { label: "Not interested", apiKey: "NOT_INTERESTED" },
  { label: "Meeting", apiKey: "MEETING" },
  { label: "After meeting followup", apiKey: "FOLLOW_UP_AFTER_MEETING" },
  { label: "Wrong number", apiKey: "WRONG_NUMBER" },
  { label: "No answer", apiKey: "NO_ANSWER" },
  { label: "Follow up", apiKey: "FOLLOW_UP" },
  { label: "Waiting", apiKey: "WAITING" },
  { label: "Send WA", apiKey: "SEND_WA" },
];

interface StatusProps {
  onApply?: (selected: string[]) => void;
  onClear?: () => void;
  onClose?: () => void;
  initialSelected?: string[];
  counts?: Record<string, number>;
}

const Status: React.FC<StatusProps> = ({ onApply, onClear, onClose, initialSelected, counts }) => {
  const [selected, setSelected] = useState<string[]>(initialSelected || []);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose?.();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const toggleOption = (label: string) => {
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]
    );
  };

  const handleClear = () => {
    setSelected([]);
    onClear?.();
    onClose?.();
  };

  const handleApply = () => {
    onApply?.(selected);
  };

  return (
    <div ref={containerRef} className="filter-modal" style={styles.container}>
      {/* Options list */}
      <div className="filter-list" style={styles.optionsList}>
        {STATUS_OPTIONS.map((option) => {
          const count = counts?.[option.apiKey] ?? undefined;
          return (
            <label key={option.label} className="filter-checkbox-row" style={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={selected.includes(option.label)}
                onChange={() => toggleOption(option.label)}
                style={styles.checkbox}
              />
              <span className="filter-text" style={styles.optionText}>
                {option.label}
                {count !== undefined && (
                  <span style={styles.count}> ({count})</span>
                )}
              </span>
            </label>
          );
        })}
      </div>

      {/* Divider */}
      <div style={styles.divider} />

      {/* Action buttons */}
      <div className="filter-buttons" style={styles.buttonsRow}>
        {/* Clear button */}
        <button style={styles.clearButton} onClick={handleClear}>
          Clear
        </button>

        {/* Apply button */}
        <button style={styles.applyButton} onClick={handleApply}>
          Apply
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.17)",
    background: "rgba(255, 255, 255, 1)",
    width: "322px",
    borderRadius: "12px",
    paddingTop: "12px",
    paddingRight: "16px",
    paddingBottom: "12px",
    paddingLeft: "16px",
    gap: "12px",
    opacity: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    boxSizing: "border-box",
  },

  optionsList: {
    width: "290px",
    minWidth: "290px",
    maxHeight: "380px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    opacity: 1,
    overflowY: "auto",
  },

  checkboxRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: "40px",
    padding: "8px",
    gap: "8px",
    cursor: "pointer",
    boxSizing: "border-box",
  },

  checkbox: {
    width: "18px",
    height: "18px",
    accentColor: "#00236F",
    cursor: "pointer",
    flexShrink: 0,
  },

  optionText: {
    fontSize: "14px",
    fontWeight: 500,
    color: "#1A1A2E",
    fontFamily: "Inter, sans-serif",
    whiteSpace: "nowrap",
  },

  count: {
    color: "#8C8C9E",
    fontWeight: 400,
  },

  divider: {
    width: "100%",
    height: "1px",
    background: "#E8E8F0",
  },

  buttonsRow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    width: "100%",
    gap: "12px",
  },

  applyButton: {
    borderRadius: "12px",
    background: "var(--Foundation-brand-brand-500, #00236F)",
    display: "flex",
    height: "48px",
    padding: "8px 24px",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    border: "none",
    color: "#FFF",
    fontSize: "14px",
    fontWeight: 600,
    fontFamily: "Inter, sans-serif",
    cursor: "pointer",
    transition: "opacity 0.2s ease",
  },

  clearButton: {
    borderRadius: "12px",
    display: "flex",
    height: "48px",
    padding: "8px",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    border: "none",
    background: "transparent",
    color: "var(--Foundation-brand-brand-500, #00236F)",
    fontSize: "14px",
    fontWeight: 600,
    fontFamily: "Inter, sans-serif",
    cursor: "pointer",
    transition: "opacity 0.2s ease",
  },
};

export default Status;
