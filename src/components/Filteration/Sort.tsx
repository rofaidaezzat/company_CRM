import React, { useState } from 'react';
import "../../styles/filteration-mobile.css";

interface SortOption {
  value: string;
  label: string;
}

const sortOptionsDefault: SortOption[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'a-z', label: 'A to Z' },
  { value: 'z-a', label: 'Z to A' },
];
interface SortProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (selectedValue: string) => void;
  defaultValue?: string;
  options?: SortOption[];
}

export const Sort: React.FC<SortProps> = ({
  isOpen,
  onClose,
  onApply,
  defaultValue = 'newest',
  options,
}) => {
  const currentOptions = options || sortOptionsDefault;
  const [selected, setSelected] = useState(defaultValue);

  const handleApply = () => {
    onApply(selected);
    onClose();
  };

  const handleClear = () => {
    setSelected('newest');
    onApply('newest');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="filter-modal" style={styles.container}>
      {/* Radio Options */}
      <div className="filter-list" style={styles.optionsList}>
        {currentOptions.map((option) => (
          <label key={option.value} className="filter-checkbox-row" style={styles.radioRow}>
            <input
              type="radio"
              name="sort"
              value={option.value}
              checked={selected === option.value}
              onChange={(e) => setSelected(e.target.value)}
              style={styles.radio}
            />
            <span className="filter-text" style={styles.optionText}>{option.label}</span>
          </label>
        ))}
      </div>

      {/* Divider */}
      <div style={styles.divider} />

      {/* Buttons */}
      <div style={styles.buttonsRowContainer}>
        <div className="filter-buttons" style={styles.buttonsRow}>
          <button onClick={handleClear} style={styles.clearButton}>
            Clear
          </button>
          <button onClick={handleApply} style={styles.applyButton}>
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.17)",
    background: "rgba(255, 255, 255, 1)",
    width: "322px",
    height: "268px",
    borderRadius: "12px",
    paddingTop: "12px",
    paddingRight: "16px",
    paddingBottom: "12px",
    paddingLeft: "16px",
    gap: "12px",
    opacity: 1,
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
  },
  optionsList: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    width: "290px",
    height: "172px",
    minWidth: "290px",
    opacity: 1,
  },
  radioRow: {
    display: "flex",
    alignItems: "center",
    width: "290px",
    height: "40px",
    gap: "12px",
    padding: "8px",
    cursor: "pointer",
    boxSizing: "border-box",
  },
  radio: {
    width: "20px",
    height: "20px",
    accentColor: "#00236f",
    cursor: "pointer",
  },
  optionText: {
    fontSize: "16px",
    color: "#374151",
    fontFamily: "Inter, sans-serif",
  },
  divider: {
    width: "100%",
    height: "1px",
    background: "#E8E8F0",
  },
  buttonsRowContainer: {
    display: "flex",
    justifyContent: "flex-end",
    width: "100%",
  },
  buttonsRow: {
    display: "flex",
    width: "161px",
    height: "48px",
    gap: "12px",
    opacity: 1,
    alignItems: "center",
  },
  clearButton: {
    width: "57px",
    height: "48px",
    borderRadius: "12px",
    gap: "8px",
    opacity: 1,
    padding: "8px",
    background: "transparent",
    border: "none",
    color: "rgba(0, 35, 111, 1)",
    fontFamily: "Inter, sans-serif",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxSizing: "border-box",
  },
  applyButton: {
    background: "rgba(0, 35, 111, 1)",
    width: "92px",
    height: "48px",
    borderRadius: "12px",
    paddingTop: "8px",
    paddingRight: "24px",
    paddingBottom: "8px",
    paddingLeft: "24px",
    gap: "8px",
    opacity: 1,
    color: "#ffffff",
    border: "none",
    fontFamily: "Inter, sans-serif",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxSizing: "border-box",
  },
};