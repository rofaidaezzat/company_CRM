import React, { useState, useEffect, useRef } from 'react';

interface MonthFilterProps {
  selectedOption?: string;
  onChange?: (option: string) => void;
  onClickOutside?: () => void;
}

const options = [
  "This month",
  "Last month",
  "Last 3 months",
  "Last 6 months",
  "Last year"
];

const Month_filter: React.FC<MonthFilterProps> = ({ selectedOption: initial = "This month", onChange, onClickOutside }) => {
  const [selected, setSelected] = useState(initial);
  const containerRef = useRef<HTMLDivElement>(null);

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
    if (onChange) onChange(option);
  };

  return (
    <div ref={containerRef} style={{
      boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.17)",
      background: "rgba(255, 255, 255, 1)",
      width: 277,
      height: 292,
      display: "flex",
      flexDirection: "column",
      gap: 4,
      borderRadius: 12,
      padding: 12,
      boxSizing: "border-box"
    }}>
      {options.map((option) => {
        const isSelected = selected === option;
        return (
          <div
            key={option}
            onClick={() => handleSelect(option)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: 8,
              height: 48,
              borderRadius: 8,
              background: isSelected ? "rgba(230, 233, 241, 1)" : "transparent",
              cursor: "pointer",
              boxSizing: "border-box",
              width: "100%"
            }}
          >
            {/* Custom Radio Button */}
            <div style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              border: isSelected ? "2px solid #00236F" : "2px solid #8F8F8F",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxSizing: "border-box"
            }}>
              {isSelected && (
                <div style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "#00236F"
                }} />
              )}
            </div>

            <span style={{
              fontSize: 16,
              color: "#111827",
              fontFamily: "Inter, sans-serif",
              fontWeight: 400
            }}>
              {option}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default Month_filter;
