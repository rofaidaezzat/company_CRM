import React, { useState, useRef, useEffect } from "react";
import "../../styles/filteration-mobile.css";
import { useTranslation } from "../../context/LanguageContext";

interface ValueProps {
  onApply?: (values: { from: string; to: string }) => void;
  onClear?: () => void;
  onClose?: () => void;
  initialFrom?: string;
  initialTo?: string;
  minRevenue?: number;
  maxRevenue?: number;
}

const Value: React.FC<ValueProps> = ({ onApply, onClear, onClose, initialFrom, initialTo, minRevenue, maxRevenue }) => {
  const { t } = useTranslation();
  const [fromValue, setFromValue] = useState(initialFrom || "");
  const [toValue, setToValue] = useState(initialTo || "");
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const calculateValueFromPos = (clientX: number) => {
    if (!trackRef.current) return min;
    const rect = trackRef.current.getBoundingClientRect();
    const percent = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));

    if (useLog) {
      const logMin = Math.log10(min || 1);
      const logMax = Math.log10(max);
      const logVal = logMin + (percent / 100) * (logMax - logMin);
      return Math.round(Math.pow(10, logVal));
    } else {
      return Math.round(min + (percent / 100) * (max - min));
    }
  };

  const handleLeftMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const handleMouseMove = (moveEvent: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const newVal = calculateValueFromPos(clientX);
      const limit = hasTo ? parseInt(toValue) || max : max;
      setFromValue(String(Math.min(limit, newVal)));
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleMouseMove);
      document.removeEventListener("touchend", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleMouseMove);
    document.addEventListener("touchend", handleMouseUp);
  };

  const handleRightMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const handleMouseMove = (moveEvent: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const newVal = calculateValueFromPos(clientX);
      const limit = hasFrom ? parseInt(fromValue) || min : min;
      setToValue(String(Math.max(limit, newVal)));
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleMouseMove);
      document.removeEventListener("touchend", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleMouseMove);
    document.addEventListener("touchend", handleMouseUp);
  };

  const handleTrackClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).getAttribute('data-thumb')) return;

    const clickedVal = calculateValueFromPos(e.clientX);

    if (clickedVal <= fromNum) {
      setFromValue(String(clickedVal));
    } else if (clickedVal >= toNum) {
      setToValue(String(clickedVal));
    } else {
      const distToLeft = Math.abs(clickedVal - fromNum);
      const distToRight = Math.abs(clickedVal - toNum);
      if (distToLeft < distToRight) {
        setFromValue(String(clickedVal));
      } else {
        setToValue(String(clickedVal));
      }
    }
  };

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

  const hasFrom = fromValue !== "";
  const hasTo = toValue !== "";

  const min = minRevenue !== undefined ? minRevenue : 0;
  const max = maxRevenue !== undefined ? maxRevenue : 100;

  const fromNum = hasFrom ? Math.max(min, parseInt(fromValue) || 0) : min;
  const toNum = hasTo ? Math.max(fromNum, parseInt(toValue) || 0) : max;

  // Use logarithmic scale if the range spans multiple orders of magnitude (ratio > 50)
  const useLog = min > 0 && max / min > 50;

  const getPercent = (val: number) => {
    if (max <= min) return 0;
    if (useLog) {
      const logMin = Math.log10(min);
      const logMax = Math.log10(max);
      const logVal = Math.log10(Math.max(min, val));
      return ((logVal - logMin) / (logMax - logMin)) * 100;
    } else {
      return ((val - min) / (max - min)) * 100;
    }
  };

  const leftPercent = Math.min(100, Math.max(0, getPercent(fromNum)));
  const rightPercent = Math.min(100, Math.max(0, getPercent(toNum)));

  const activeLeft = leftPercent;
  const activeWidth = rightPercent - leftPercent;

  return (
    <div ref={containerRef} className="filter-modal" style={styles.container}>
      {/* Content */}
      <div className="filter-list" style={styles.content}>
        {/* From / To Inputs */}
        <div className="filter-split" style={styles.fromToContainer}>
          {/* From */}
          <div className="filter-split-item" style={styles.inputWrapper}>
            <label style={styles.label}>{t('filteration.from')}</label>
            <input
              type="number"
              className="filter-input"
              value={fromValue}
              onChange={(e) => setFromValue(e.target.value)}
              placeholder={String(min)}
              style={styles.input}
            />
          </div>

          <span style={styles.dash}>-</span>

          {/* To */}
          <div className="filter-split-item" style={styles.inputWrapper}>
            <label style={styles.label}>{t('filteration.to')}</label>
            <input
              type="number"
              className="filter-input"
              value={toValue}
              onChange={(e) => setToValue(e.target.value)}
              placeholder={String(max)}
              style={styles.input}
            />
          </div>
        </div>

        {/* Range Slider Visual */}
        <div style={styles.sliderContainer}>
          <div style={styles.sliderLabels}>
            <span style={styles.sliderLabelText}>{`${min.toLocaleString()} EGP`}</span>
            <span style={styles.sliderLabelText}>{`${max.toLocaleString()} EGP`}</span>
          </div>

          <div
            ref={trackRef}
            onClick={handleTrackClick}
            style={{ ...styles.trackWrapper, cursor: "pointer" }}
          >
            <div style={styles.trackBackground} />
            <div
              style={{
                ...styles.trackActive,
                left: `${activeLeft}%`,
                width: `${activeWidth}%`,
              }}
            />
            {/* Left Thumb */}
            <div
              data-thumb="left"
              onMouseDown={handleLeftMouseDown}
              onTouchStart={handleLeftMouseDown}
              style={{
                ...styles.thumb,
                left: `calc(${leftPercent}% - 10px)`,
                cursor: "grab",
              }}
            />
            {/* Right Thumb */}
            <div
              data-thumb="right"
              onMouseDown={handleRightMouseDown}
              onTouchStart={handleRightMouseDown}
              style={{
                ...styles.thumb,
                left: `calc(${rightPercent}% - 10px)`,
                cursor: "grab",
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
            {t('filteration.clear')}
          </button>
          <button style={styles.applyButton} onClick={handleApply}>
            {t('filteration.apply')}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: "352px",
    height: "234px",
    borderRadius: "12px",
    background: "rgba(255, 255, 255, 1)",
    boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.17)",
    display: "flex",
    flexDirection: "column",
    padding: "12px 16px",
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
    touchAction: "none",
  },
  trackBackground: {
    position: "absolute",
    width: "100%",
    height: "8px",
    background: "rgba(246, 247, 249, 1)",
    borderRadius: "4px",
    overflow: "hidden",
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
    touchAction: "none",
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

export default Value;
