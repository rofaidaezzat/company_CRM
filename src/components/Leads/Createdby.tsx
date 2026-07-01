import React, { useState, useEffect, useRef } from 'react';

interface CreatedbyProps {
  selectedOption?: string;
  onChange?: (option: string) => void;
  onClickOutside?: () => void;
}

const defaultMembers = [
  "All Sales",
  "Mahmoud Abdelmawgoud",
  "Rowayda Ashraf",
  "Hany Gweid",
  "Mansour Elsayed",
  "Ahmed Hassan",
  "Omar Khaled"
];

const Createdby: React.FC<CreatedbyProps> = ({ selectedOption: initial = "All Sales", onChange, onClickOutside }) => {
  const [selected, setSelected] = useState(initial);
  const [search, setSearch] = useState("");
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

  const filteredMembers = defaultMembers.filter(member => 
    member.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={containerRef} style={{
      boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.17)",
      background: "rgba(255, 255, 255, 1)",
      width: 301,
      height: 292,
      display: "flex",
      flexDirection: "column",
      gap: 12,
      borderRadius: 12,
      padding: 12,
      boxSizing: "border-box",
      position: "absolute",
      top: "100%",
      left: 0,
      zIndex: 2000,
    }}>
      <style>
        {`
          .members-scroll::-webkit-scrollbar {
            width: 6px;
          }
          .members-scroll::-webkit-scrollbar-track {
            background: #F3F4F6;
            border-radius: 4px;
          }
          .members-scroll::-webkit-scrollbar-thumb {
            background: #9CA3AF;
            border-radius: 4px;
          }
        `}
      </style>
      
      {/* Search Input */}
      <div style={{
        display: "flex",
        alignItems: "center",
        padding: "0 12px",
        gap: 8,
        height: 40,
        border: "1px solid #D4D5D8",
        borderRadius: 8,
        background: "#FFF",
        flexShrink: 0
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input 
          type="text" 
          placeholder="Search sales name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            border: "none",
            outline: "none",
            background: "transparent",
            width: "100%",
            fontSize: 14,
            fontFamily: "Inter, sans-serif",
            color: "#111827"
          }}
        />
      </div>

      {/* Rows Container */}
      <div className="members-scroll" style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        overflowY: "auto",
        flex: 1,
        paddingRight: 4
      }}>
        {filteredMembers.map((option) => {
          const isSelected = selected === option;
          return (
            <div
              key={option}
              onClick={() => handleSelect(option)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: 8,
                height: 40,
                borderRadius: 8,
                background: isSelected ? "rgba(230, 233, 241, 1)" : "transparent",
                cursor: "pointer",
                boxSizing: "border-box",
                width: "100%",
                flexShrink: 0
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
                fontWeight: 400,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}>
                {option}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Createdby;
