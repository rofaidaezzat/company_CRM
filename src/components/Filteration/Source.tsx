import React, { useState, useRef, useEffect } from "react";
import "../../styles/filteration-mobile.css";

const SOURCE_OPTIONS = [
  { label: "Organic", count: 200 },
  { label: "Referral", count: 200 },
  { label: "Ads", count: 200 },
  { label: "Website", count: 200 },
  { label: "Farmer", count: 200 },
];

interface SourceProps {
  onApply?: (selected: string[]) => void;
  onClear?: () => void;
  onClose?: () => void;
}

const Source: React.FC<SourceProps> = ({ onApply, onClear, onClose }) => {
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
        {SOURCE_OPTIONS.map((option) => (
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
        <button
          style={styles.clearButton}
          onClick={handleClear}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(0,35,111,0.06)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          Clear
        </button>

        {/* Apply button */}
        <button
          style={styles.applyButton}
          onClick={handleApply}
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

const styles: Record<string, React.CSSProperties> = {
  container: {
    borderRadius: "12px",
    background: "var(--Foundation-neutral-white, #FFF)",
    boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.17)",
    display: "inline-flex",
    padding: "12px 16px",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    gap: "12px",
  },

  optionsList: {
    display: "flex",
    minWidth: "290px",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "4px",
  },

  checkboxRow: {
    width: "290px",
    height: "40px",
    display: "inline-flex",
    flexDirection: "row",
    alignItems: "center",
    padding: "8px",
    gap: "8px",
    cursor: "pointer",
    boxSizing: "border-box",
    opacity: 1,
    borderRadius: "6px",
    transition: "background 0.15s",
  },

  checkbox: {
    width: "18px",
    height: "18px",
    accentColor: "rgba(0, 35, 111, 1)",
    cursor: "pointer",
    flexShrink: 0,
  },

  optionText: {
    fontSize: "14px",
    fontWeight: 500,
    color: "#141414",
    fontFamily: "Inter, sans-serif",
    whiteSpace: "nowrap",
  },

  count: {
    color: "#6B7280",
    fontWeight: 400,
  },

  divider: {
    width: "100%",
    height: "1px",
    background: "rgba(212, 213, 216, 1)",
    flexShrink: 0,
  },

  buttonsRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    width: "161px",
    height: "48px",
    opacity: 1,
  },

  clearButton: {
    flex: 1,
    height: "48px",
    background: "transparent",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontFamily: "Inter, sans-serif",
    fontSize: "15px",
    fontWeight: 600,
    color: "rgba(0, 35, 111, 1)",
    padding: "8px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    transition: "background 0.15s",
    boxSizing: "border-box",
  },

  applyButton: {
    width: "92px",
    height: "48px",
    background: "rgba(0, 35, 111, 1)",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontFamily: "Inter, sans-serif",
    fontSize: "15px",
    fontWeight: 600,
    color: "#ffffff",
    paddingTop: "8px",
    paddingRight: "24px",
    paddingBottom: "8px",
    paddingLeft: "24px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    transition: "background 0.15s",
    boxSizing: "border-box",
    opacity: 1,
  },
};

export default Source;
