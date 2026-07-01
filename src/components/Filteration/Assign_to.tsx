import React, { useState, useEffect, useRef } from 'react';
import { useGetSalesMembersQuery } from '../../app/service/crudsales';

interface AssignToProps {
  initialSelected?: string[];
  onApply?: (selected: string[]) => void;
  onClear?: () => void;
  onClose?: () => void;
}

const defaultMembers = [
  "Mohamed Modather",
  "Wael Abdelrasool",
  "Abdelwahed Elsaye",
  "Mahmoud Eldawly"
];

const Assign_to: React.FC<AssignToProps> = ({
  initialSelected = [],
  onApply,
  onClear,
  onClose
}) => {
  const { data: salesMembersResponse, isLoading } = useGetSalesMembersQuery();
  const [selected, setSelected] = useState<string[]>(initialSelected);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (onClose) onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleToggle = (option: string) => {
    if (selected.includes(option)) {
      setSelected(selected.filter(item => item !== option));
    } else {
      setSelected([...selected, option]);
    }
  };

  const handleApply = () => {
    if (onApply) onApply(selected);
  };

  const handleClear = () => {
    setSelected([]);
    if (onClear) onClear();
  };

  const salesMembers = salesMembersResponse?.data || [];
  const memberNames = salesMembers.length > 0 
    ? salesMembers.map(m => `${m.first_name} ${m.last_name}`)
    : defaultMembers;

  const filteredMembers = memberNames.filter(member =>
    member.toLowerCase().includes(search.toLowerCase())
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
        width: 301,
        boxSizing: "border-box",
        border: "1px solid #E5E7EB",
      }}
    >
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "0 12px",
          gap: 8,
          height: 40,
          border: "1px solid #D4D5D8",
          borderRadius: 8,
          background: "#FFF",
          flexShrink: 0,
          width: "100%",
          boxSizing: "border-box"
        }}
      >
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

      {/* Scrollable Members List */}
      <div
        className="members-scroll"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          overflowY: "auto",
          maxHeight: 180,
          width: "100%",
          paddingRight: 4
        }}
      >
        {filteredMembers.map((option) => {
          const isChecked = selected.includes(option);
          return (
            <div
              key={option}
              onClick={() => handleToggle(option)}
              style={{
                background: isChecked ? "var(--Foundation-brand-brand-50, #E6E9F1)" : "transparent",
                display: "flex",
                height: "40px",
                padding: "8px",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: "8px",
                alignSelf: "stretch",
                borderRadius: "6px",
                cursor: "pointer",
                boxSizing: "border-box"
              }}
            >
              {/* Checkbox Icon */}
              <div
                style={{
                  width: 18,
                  height: 18,
                  border: isChecked ? "none" : "2px solid #9CA3AF",
                  borderRadius: "4px",
                  background: isChecked ? "var(--Foundation-brand-brand-500, #00236F)" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}
              >
                {isChecked && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <span
                style={{
                  fontSize: 14,
                  color: "#111827",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: isChecked ? 600 : 400,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}
              >
                {option}
              </span>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 12,
          width: "100%",
          marginTop: 4
        }}
      >
        <button
          onClick={handleClear}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            fontSize: 14,
            fontWeight: 600,
            color: "var(--Foundation-brand-brand-500, #00236F)"
          }}
        >
          Clear
        </button>
        <button
          onClick={handleApply}
          style={{
            borderRadius: "12px",
            background: "var(--Foundation-brand-brand-500, #00236F)",
            display: "flex",
            height: "48px",
            padding: "8px 24px",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            border: "none",
            cursor: "pointer",
            color: "#FFF",
            fontFamily: "Inter, sans-serif",
            fontSize: 14,
            fontWeight: 600
          }}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default Assign_to;
