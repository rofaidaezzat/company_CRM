import React, { useState } from "react";
import closeIcon from "../../assets/x-02.svg";
import "../../styles/sales-modals-mobile.css";

interface EditTargetProps {
  onClose?: () => void;
  onApply?: (data: { period: string; value: string }) => void;
  salesName?: string;
}

const TargetIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12 12V11C11.4477 11 11 11.4477 11 12H12ZM12.0797 12H13.0797C13.0797 11.4477 12.632 11 12.0797 11V12ZM12.0797 12.0721V13.0721C12.632 13.0721 13.0797 12.6244 13.0797 12.0721H12.0797ZM12 12.0721H11C11 12.6244 11.4477 13.0721 12 13.0721V12.0721ZM21 12H20C20 16.4183 16.4183 20 12 20V21V22C17.5228 22 22 17.5228 22 12H21ZM12 21V20C7.58172 20 4 16.4183 4 12H3H2C2 17.5228 6.47715 22 12 22V21ZM3 12H4C4 7.58172 7.58172 4 12 4V3V2C6.47715 2 2 6.47715 2 12H3ZM12 3V4C16.4183 4 20 7.58172 20 12H21H22C22 6.47715 17.5228 2 12 2V3ZM16.5 12H15.5C15.5 13.933 13.933 15.5 12 15.5V16.5V17.5C15.0376 17.5 17.5 15.0376 17.5 12H16.5ZM12 16.5V15.5C10.067 15.5 8.5 13.933 8.5 12H7.5H6.5C6.5 15.0376 8.96243 17.5 12 17.5V16.5ZM7.5 12H8.5C8.5 10.067 10.067 8.5 12 8.5V7.5V6.5C8.96243 6.5 6.5 8.96243 6.5 12H7.5ZM12 7.5V8.5C13.933 8.5 15.5 10.067 15.5 12H16.5H17.5C17.5 8.96243 15.0376 6.5 12 6.5V7.5ZM12 12V13H12.0797V12V11H12V12ZM12.0797 12H11.0797V12.0721H12.0797H13.0797V12H12.0797ZM12.0797 12.0721V11.0721H12V12.0721V13.0721H12.0797V12.0721ZM12 12.0721H13V12H12H11V12.0721H12Z" fill="#464646"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M6 9L12 15L18 9" stroke="#464646" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PERIOD_OPTIONS = ["Monthly", "Quarterly", "Yearly"];

const Edit_Target: React.FC<EditTargetProps> = ({
  onClose,
  onApply,
  salesName = "Sales name",
}) => {
  const [period, setPeriod] = useState("Monthly");
  const [isPeriodOpen, setIsPeriodOpen] = useState(false);
  const [value, setValue] = useState("");

  const handleApply = () => {
    if (onApply) onApply({ period, value });
  };

  return (
    <div
      className="sales-modal-container"
      style={{
        width: 462,
        height: 448,
        borderRadius: 12,
        background: "var(--Foundation-neutral-neutral-25, #F5F6FA)",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        overflow: "hidden",
        boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.12)",
        boxSizing: "border-box",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          borderRadius: "12px 12px 0 0",
          borderBottom: "1px solid var(--Foundation-neutral-neutral-100, #D4D5D8)",
          background: "var(--Foundation-neutral-neutral-25, #F5F6FA)",
          display: "flex",
          padding: 20,
          justifyContent: "space-between",
          alignItems: "center",
          alignSelf: "stretch",
          boxSizing: "border-box",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <TargetIcon />
            <span
              style={{
                color: "var(--Foundation-neutral-neutral-950, #141414)",
                fontFamily: "Inter, sans-serif",
                fontSize: 19,
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "normal",
              }}
            >
              Edit Target
            </span>
          </div>
          <span
            style={{
              color: "var(--Foundation-neutral-neutral-800, #464646)",
              fontFamily: "Inter, sans-serif",
              fontSize: 16,
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "normal",
              alignSelf: "stretch",
              paddingLeft: 32,
            }}
          >
            for "{salesName}"
          </span>
        </div>

        <button
          onClick={onClose}
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "1px solid rgba(212, 213, 216, 1)",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <img src={closeIcon} alt="Close" width={14} height={14} />
        </button>
      </div>

      {/* ── Content ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          padding: "0 20px",
          boxSizing: "border-box",
        }}
      >
        <div
          className="sales-modal-form"
          style={{
            display: "flex",
            width: 422,
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 16,
          }}
        >
          {/* ── Target Period ── */}
          <div
            style={{
              display: "flex",
              alignSelf: "stretch",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid var(--Foundation-neutral-neutral-100, #D4D5D8)",
              paddingBottom: 16,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#141414",
                  lineHeight: "normal",
                }}
              >
                Target Period
              </span>
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 13,
                  fontWeight: 400,
                  color: "#747474",
                  maxWidth: 220,
                  lineHeight: "1.5",
                }}
              >
                Define how often this target is measured and reset.
              </span>
            </div>

            {/* Period Dropdown */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setIsPeriodOpen(!isPeriodOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 14px",
                  border: "1px solid rgba(212, 213, 216, 1)",
                  borderRadius: 12,
                  background: "transparent",
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#141414",
                  whiteSpace: "nowrap",
                }}
              >
                {period}
                <ChevronDownIcon />
              </button>
              {isPeriodOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 4px)",
                    right: 0,
                    background: "#fff",
                    borderRadius: 12,
                    boxShadow: "0px 2px 8px rgba(0,0,0,0.12)",
                    border: "1px solid rgba(212, 213, 216, 1)",
                    padding: 4,
                    minWidth: 130,
                    zIndex: 50,
                  }}
                >
                  {PERIOD_OPTIONS.map((opt) => (
                    <div
                      key={opt}
                      onClick={() => { setPeriod(opt); setIsPeriodOpen(false); }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#E6E9F1")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      style={{
                        padding: "8px 12px",
                        borderRadius: 8,
                        cursor: "pointer",
                        fontFamily: "Inter, sans-serif",
                        fontSize: 14,
                        color: "#141414",
                        background: opt === period ? "#E6E9F1" : "transparent",
                      }}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Target Revenue ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, alignSelf: "stretch" }}>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 16,
                fontWeight: 700,
                color: "#141414",
                lineHeight: "normal",
              }}
            >
              Target Revenue
            </span>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                fontWeight: 400,
                color: "#747474",
                lineHeight: "1.5",
              }}
            >
              Enter the preferred monthly target value.
            </span>
            <label
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                fontWeight: 500,
                color: "#4B5563",
              }}
            >
              Value<span style={{ color: "#00236F" }}>*</span>
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder=""
              style={{
                width: "100%",
                height: 48,
                border: "1px solid rgba(212, 213, 216, 1)",
                borderRadius: 8,
                padding: "0 14px",
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                color: "#141414",
                background: "transparent",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#3B5BDB")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(212, 213, 216, 1)")}
            />
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div
        style={{
          borderRadius: "0 0 12px 12px",
          background: "var(--Foundation-neutral-neutral-25, #F5F6FA)",
          display: "flex",
          height: 76,
          padding: "8px 20px 20px 20px",
          justifyContent: "center",
          alignItems: "center",
          gap: 12,
          alignSelf: "stretch",
          boxSizing: "border-box",
          flexShrink: 0,
        }}
      >
        <button
          onClick={onClose}
          style={{
            borderRadius: 12,
            border: "1px solid var(--Foundation-neutral-neutral-100, #D4D5D8)",
            display: "flex",
            height: 48,
            padding: "8px 24px",
            justifyContent: "center",
            alignItems: "center",
            flex: "1 0 0",
            background: "transparent",
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            fontSize: 16,
            fontWeight: 600,
            color: "#00236F",
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleApply}
          style={{
            borderRadius: 12,
            background: "var(--Foundation-brand-brand-500, #00236F)",
            border: "none",
            display: "flex",
            height: 48,
            padding: "8px 24px",
            justifyContent: "center",
            alignItems: "center",
            flex: "1 0 0",
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            fontSize: 16,
            fontWeight: 600,
            color: "#FFF",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0, 25, 85, 1)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--Foundation-brand-brand-500, #00236F)")}
        >
          Apply Changes
        </button>
      </div>
    </div>
  );
};

export default Edit_Target;
