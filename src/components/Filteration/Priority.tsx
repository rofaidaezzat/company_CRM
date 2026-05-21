import React, { useState, useRef, useEffect } from "react";
import "../../styles/filteration-mobile.css";

const PRIORITY_OPTIONS = [
  { label: "Low", count: 200 },
  { label: "Medium", count: 200 },
  { label: "High", count: 200 },
];

interface PriorityProps {
  onApply?: (selected: string[]) => void;
  onClear?: () => void;
  onClose?: () => void;
}

const Priority: React.FC<PriorityProps> = ({ onApply, onClear, onClose }) => {
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
        {PRIORITY_OPTIONS.map((option) => (
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
    borderRadius: "12px",
    background: "rgba(255, 255, 255, 1)",
    boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.17)",
    display: "inline-flex",
    padding: "12px 16px",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    gap: "12px",
    boxSizing: "border-box",
  },

  optionsList: {
    width: "290px",
    height: "128px",
    minWidth: "290px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    opacity: 1,
  },

  checkboxRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: "40px",
    padding: "8px",
    gap: "12px",
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
    background: "rgba(0, 35, 111, 1)",
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
    boxSizing: "border-box",
  },

  clearButton: {
    width: "57px",
    height: "48px",
    borderRadius: "12px",
    gap: "8px",
    padding: "8px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "none",
    background: "transparent",
    color: "rgba(0, 35, 111, 1)",
    fontSize: "14px",
    fontWeight: 600,
    fontFamily: "Inter, sans-serif",
    cursor: "pointer",
    boxSizing: "border-box",
  },
};

export default Priority;
