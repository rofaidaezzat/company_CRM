import React, { useState, useRef, useEffect } from "react";
import "../../styles/filteration-mobile.css";

const STATUS_OPTIONS = [
  { label: "Fresh", count: 200 },
  { label: "Deal", count: 200 },
  { label: "Interested", count: 200 },
  { label: "Not interested", count: 200 },
  { label: "Meeting", count: 200 },
  { label: "After meeting followup", count: 200 },
  { label: "Wrong number", count: 200 },
  { label: "No answer", count: 200 },
];

interface StatusProps {
  onApply?: (selected: string[]) => void;
  onClear?: () => void;
  onClose?: () => void;
}

const Status: React.FC<StatusProps> = ({ onApply, onClear, onClose }) => {
  const [selected, setSelected] = useState<string[]>([]);
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
        {STATUS_OPTIONS.map((option) => (
          <label key={option.label} className="filter-checkbox-row" style={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={selected.includes(option.label)}
              onChange={() => toggleOption(option.label)}
              style={styles.checkbox}
            />
            <span className="filter-text" style={styles.optionText}>
              {option.label}
              <span style={styles.count}> ({option.count})</span>
            </span>
          </label>
        ))}
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
    height: "444px",
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
    height: "348px",
    minWidth: "290px",
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
