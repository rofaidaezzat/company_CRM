import React, { useState } from "react";
import filePlusIcon from "../../assets/file-plus-01.svg";
import closeIcon from "../../assets/x-02.svg";
import "../../styles/leads-modal-mobile.css";

interface LeadFormProps {
  leadsName?: string;
  onClose?: () => void;
  onSave?: (data: { q1: string; q2: string; q3: string }) => void;
  slot?: string;
}

const Lead_form: React.FC<LeadFormProps> = ({
  leadsName = "leads name",
  onClose,
  onSave,
  slot = "Modified",
}) => {
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [q3, setQ3] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const isSaveEnabled = q1.trim() !== "" && q2.trim() !== "" && q3.trim() !== "";

  const savedTextareaStyle: React.CSSProperties = {
    width: "100%",
    height: 85,
    resize: "none",
    border: "none",
    borderRadius: 8,
    padding: 12,
    fontFamily: "Inter, sans-serif",
    fontSize: 14,
    color: "#141414",
    background: "rgba(212, 213, 216, 1)",
    outline: "none",
    boxSizing: "border-box",
    transition: "all 0.25s ease",
    cursor: "default",
  };

  const defaultTextareaStyle: React.CSSProperties = {
    width: "100%",
    height: 85,
    resize: "none",
    border: "1px solid rgba(0, 35, 111, 1)",
    borderRadius: 8,
    padding: "12px",
    fontFamily: "Inter, sans-serif",
    fontSize: 14,
    color: "#141414",
    background: "transparent",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s, background 0.25s, height 0.25s",
  };

  const handleSave = () => {
    if (onSave) {
      onSave({ q1, q2, q3 });
    }
    setIsSaved(true);
  };

  return (
    <div
      className="leads-modal-root"
      style={{
        width: 462,
        height: 607,
        opacity: 1,
        display: "flex",
        flexDirection: "column",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.12)",
      }}
    >
      {/* Header */}
      <div
        className="leads-modal-header"
        slot={slot}
        style={{
          width: 462,
          height: 91,
          background: "rgba(245, 246, 250, 1)",
          borderBottom: "1px solid rgba(212, 213, 216, 1)",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          padding: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          boxSizing: "border-box",
        }}
      >
        {/* Left: icon + title + subtitle */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img
              src={filePlusIcon}
              alt="Lead Form Icon"
              width={24}
              height={24}
            />
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                fontSize: 19,
                color: "#141414",
                lineHeight: "100%",
              }}
            >
              Lead Form
            </span>
          </div>
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              fontSize: 13,
              color: "#6B7280",
              lineHeight: "18px",
              paddingLeft: 2,
            }}
          >
            for &quot;{leadsName}&quot;
          </span>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
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

      {/* Form Body */}
      <div
        className="leads-modal-body"
        style={{
          width: 462,
          flex: 1,
          background: "rgba(245, 246, 250, 1)",
          borderBottomRightRadius: 12,
          borderBottomLeftRadius: 12,
          paddingTop: 32,
          paddingLeft: 20,
          paddingRight: 20,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          className="leads-modal-inner"
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
        {/* Q1 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              fontSize: 13,
              color: "#141414",
            }}
          >
            Q1<span style={{ color: "rgba(0, 35, 111, 1)" }}>*</span>
          </label>
          <textarea
            value={q1}
            onChange={(e) => !isSaved && setQ1(e.target.value)}
            readOnly={isSaved}
            placeholder="Input text"
            style={isSaved ? savedTextareaStyle : defaultTextareaStyle}
            onFocus={(e) => { if (!isSaved) e.currentTarget.style.borderColor = "#3B5BDB"; }}
            onBlur={(e) => { if (!isSaved) e.currentTarget.style.borderColor = "rgba(0, 35, 111, 1)"; }}
          />
        </div>

        {/* Q2 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              fontSize: 13,
              color: "#141414",
            }}
          >
            Q2<span style={{ color: "rgba(0, 35, 111, 1)" }}>*</span>
          </label>
          <textarea
            value={q2}
            onChange={(e) => !isSaved && setQ2(e.target.value)}
            readOnly={isSaved}
            placeholder="Input text"
            style={isSaved ? savedTextareaStyle : defaultTextareaStyle}
            onFocus={(e) => { if (!isSaved) e.currentTarget.style.borderColor = "#3B5BDB"; }}
            onBlur={(e) => { if (!isSaved) e.currentTarget.style.borderColor = "rgba(0, 35, 111, 1)"; }}
          />
        </div>

        {/* Q3 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              fontSize: 13,
              color: "#141414",
            }}
          >
            Q3<span style={{ color: "rgba(0, 35, 111, 1)" }}>*</span>
          </label>
          <textarea
            value={q3}
            onChange={(e) => !isSaved && setQ3(e.target.value)}
            readOnly={isSaved}
            placeholder="Input text"
            style={isSaved ? savedTextareaStyle : defaultTextareaStyle}
            onFocus={(e) => { if (!isSaved) e.currentTarget.style.borderColor = "#3B5BDB"; }}
            onBlur={(e) => { if (!isSaved) e.currentTarget.style.borderColor = "rgba(0, 35, 111, 1)"; }}
          />
        </div>
      </div>

        {/* Save / Edit Button */}
        {!isSaved ? (
          <button
            className="leads-modal-footer-btn"
            onClick={handleSave}
            disabled={!isSaveEnabled}
            style={{
              marginTop: 40,
              marginBottom: 24,
              alignSelf: "center",
              width: "100%",
              height: 48,
              borderRadius: 12,
              border: "none",
              background: isSaveEnabled
                ? "rgba(0, 35, 111, 1)"
                : "rgba(212, 213, 216, 1)",
              color: isSaveEnabled ? "#fff" : "#9CA3AF",
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: 15,
              cursor: isSaveEnabled ? "pointer" : "not-allowed",
              transition: "background 0.2s, color 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              paddingTop: 8,
              paddingBottom: 8,
              paddingLeft: 24,
              paddingRight: 24,
              boxSizing: "border-box",
            }}
          >
            Save
          </button>
        ) : (
          <button
            className="leads-modal-footer-btn"
            onClick={() => setIsSaved(false)}
            style={{
              marginTop: 40,
              marginBottom: 24,
              alignSelf: "center",
              width: "100%",
              height: 48,
              borderRadius: 12,
              border: "1.5px solid rgba(0, 35, 111, 1)",
              background: "#fff",
              color: "rgba(0, 35, 111, 1)",
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: 15,
              cursor: "pointer",
              transition: "background 0.2s, color 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              paddingTop: 8,
              paddingBottom: 8,
              paddingLeft: 24,
              paddingRight: 24,
              boxSizing: "border-box",
            }}
          >
            {/* Pencil icon */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
                stroke="rgba(0, 35, 111, 1)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.43741 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z"
                stroke="rgba(0, 35, 111, 1)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default Lead_form;
