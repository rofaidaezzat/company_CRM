import React, { useState, useRef, useEffect } from "react";
import "../../styles/filteration-mobile.css";

interface ValueProps {
  onApply?: (values: { from: string; to: string }) => void;
  onClear?: () => void;
  onClose?: () => void;
}

const Target: React.FC<ValueProps> = ({ onApply, onClear, onClose }) => {
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");
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

  const handleClear = () => {
    setFromValue("");
    setToValue("");
    onClear?.();
    onClose?.();
  };

  const handleApply = () => {
    onApply?.({ from: fromValue, to: toValue });
  };

  // Calculate widths for the fake slider just for visual representation
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
return (
    <div ref={containerRef} className="filter-modal" style={styles.container}>
      {/* Content */}
      <div className="filter-list" style={styles.content}>
        {/* From / To Inputs */}
        <div className="filter-split" style={styles.fromToContainer}>
          {/* From */}
          <div className="filter-split-item" style={styles.inputWrapper}>
            <label style={styles.label}>From</label>
            <input
              type="text"
              className="filter-input"
              value={fromValue ? `${fromValue.replace(/%/g, "")}%` : ""}
              onChange={(e) => setFromValue(e.target.value.replace(/%/g, ""))}
              style={styles.input}
            />
          </div>

          <span style={styles.dash}>-</span>

          {/* To */}
          <div className="filter-split-item" style={styles.inputWrapper}>
            <label style={styles.label}>To</label>
            <input
              type="text"
              className="filter-input"
              value={toValue ? `${toValue.replace(/%/g, "")}%` : ""}
              onChange={(e) => setToValue(e.target.value.replace(/%/g, ""))}
              style={styles.input}
            />
          </div>
        </div>

        {/* Range Slider Visual */}
        <div style={styles.sliderContainer}>
          <div style={{ ...styles.trackWrapper, marginTop: 20 }}>
            <div style={styles.trackBackground} />
            <div
              style={{
                ...styles.trackActive,
                left: `${leftPercent}%`,
                width: `${activeWidth}%`,
              }}
            />
            {/* Left Thumb & Label */}
            <div
              style={{
                position: "absolute",
                top: "-24px",
                left: `calc(${leftPercent}% - 4px)`,
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                color: "#4B5563",
                transform: "translateX(-25%)",
              }}
            >
              {fromValue ? `${fromValue.replace(/%/g, "")}%` : "10%"}
            </div>
            <div
              style={{
                ...styles.thumb,
                left: `calc(${leftPercent}% - 10px)`,
              }}
            />
            
            {/* Right Thumb & Label */}
            <div
              style={{
                position: "absolute",
                top: "-24px",
                left: `calc(${rightPercent}% - 4px)`,
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                color: "#4B5563",
                transform: "translateX(-25%)",
              }}
            >
              {toValue ? `${toValue.replace(/%/g, "")}%` : "50%"}
            </div>
            <div
              style={{
                ...styles.thumb,
                left: `calc(${rightPercent}% - 10px)`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={styles.divider} />

      {/* Action buttons */}
      <div style={styles.buttonsRowContainer}>
        <div className="filter-buttons" style={styles.buttonsRow}>
          <button style={styles.clearButton} onClick={handleClear}>
            Clear
          </button>
          <button style={styles.applyButton} onClick={handleApply}>
            Apply
          </button>
        </div>
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
    gap: "16px",
    boxSizing: "border-box",
  },
  content: {
    width: "320px",
    height: "130px",
    minWidth: "290px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    opacity: 1,
  },
  fromToContainer: {
    width: "290px",
    height: "63px",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: "8px",
    opacity: 1,
  },
  inputWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    flex: 1,
  },
  label: {
    fontFamily: "Inter, sans-serif",
    fontSize: "14px",
    color: "#374151",
    fontWeight: 500,
  },
  input: {
    width: "108px",
    height: "36px",
    border: "1px solid rgba(212, 213, 216, 1)",
    borderRadius: "8px",
    padding: "12px",
    fontFamily: "Inter, sans-serif",
    fontSize: "14px",
    color: "#141414",
    outline: "none",
    boxSizing: "border-box",
    opacity: 1,
  },
  dash: {
    color: "rgba(212, 213, 216, 1)",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "36px", // match input height
    marginBottom: "0px",
  },
  sliderContainer: {
    width: "320px",
    height: "43px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    opacity: 1,
  },
  sliderLabels: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0 4px",
  },
  sliderLabelText: {
    fontFamily: "Inter, sans-serif",
    fontSize: "13px",
    color: "#4B5563",
  },
  trackWrapper: {
    position: "relative",
    width: "320px",
    height: "20px", // enough to contain the 20px circle thumbs
    display: "flex",
    alignItems: "center",
  },
  trackBackground: {
    position: "absolute",
    width: "100%",
    height: "8px",
    background: "rgba(246, 247, 249, 1)",
    borderRadius: "4px",
  },
  trackActive: {
    position: "absolute",
    height: "8px",
    background: "rgba(0, 35, 111, 1)",
    borderRadius: "4px",
  },
  thumb: {
    position: "absolute",
    width: "20px",
    height: "20px",
    background: "#fff",
    border: "2px solid rgba(212, 213, 216, 1)",
    borderRadius: "50%",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    boxSizing: "border-box",
  },
  divider: {
    width: "100%",
    height: "1px",
    background: "rgba(212, 213, 216, 1)",
    opacity: 0.5,
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
    alignItems: "center",
  },
  clearButton: {
    width: "57px",
    height: "48px",
    borderRadius: "12px",
    padding: "8px",
    background: "transparent",
    border: "none",
    color: "rgba(0, 35, 111, 1)",
    fontSize: "14px",
    fontWeight: 600,
    fontFamily: "Inter, sans-serif",
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
    padding: "8px 24px",
    color: "#ffffff",
    border: "none",
    fontSize: "14px",
    fontWeight: 600,
    fontFamily: "Inter, sans-serif",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxSizing: "border-box",
  },
};

export default Target;
