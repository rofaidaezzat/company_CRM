import React, { useState } from "react";
import editIcon from "../../assets/edit-contained.svg";
import closeIcon from "../../assets/x-02.svg";
import calendarPlusIcon from "../../assets/calendar-plus.svg";
import "../../styles/leads-modal-mobile.css";

interface EditLeadInfoProps {
  leadsName?: string;
  initialData?: {
    leadName?: string;
    companyName?: string;
    phoneNumber?: string;
    nextFollowup?: string;
  };
  onClose?: () => void;
  onSave?: (data: {
    leadName: string;
    companyName: string;
    phoneNumber: string;
    nextFollowup: string;
  }) => void;
  slot?: string;
}

const inputStyle: React.CSSProperties = {
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
};

const labelStyle: React.CSSProperties = {
  fontFamily: "Inter, sans-serif",
  fontWeight: 500,
  fontSize: 13,
  color: "#141414",
  marginBottom: 6,
  display: "block",
};

const Edit_lead_info: React.FC<EditLeadInfoProps> = ({
  leadsName = "leads name",
  initialData = {
    leadName: "John Dorghamasadsad",
    companyName: "John Dorghamasadsad",
    phoneNumber: "+201121504065",
    nextFollowup: "2026-05-24",
  },
  onClose,
  onSave,
  slot = "Modified",
}) => {
  const [leadName, setLeadName] = useState(initialData.leadName ?? "");
  const [companyName, setCompanyName] = useState(initialData.companyName ?? "");
  const [phoneNumber, setPhoneNumber] = useState(initialData.phoneNumber ?? "");
  const [nextFollowup, setNextFollowup] = useState(initialData.nextFollowup ?? "");

  const isSaveEnabled =
    leadName.trim() !== "" &&
    companyName.trim() !== "" &&
    phoneNumber.trim() !== "" &&
    nextFollowup.trim() !== "";

  const handleSave = () => {
    if (!isSaveEnabled) return;
    if (onSave) {
      onSave({ leadName, companyName, phoneNumber, nextFollowup });
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "#3B5BDB";
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "rgba(212, 213, 216, 1)";
  };

  /* Format ISO date → DD/MM/YYYY for display */
  const formatDate = (iso: string) => {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
  };

  return (
    <div
      className="leads-modal-root"
      style={{
        width: 462,
        height: 587,
        opacity: 1,
        display: "flex",
        flexDirection: "column",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.12)",
      }}
    >
      {/* ── Header ── */}
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
          flexShrink: 0,
        }}
      >
        {/* Left: icon + title + subtitle */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img src={editIcon} alt="Edit Lead Info" width={24} height={24} />
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                fontSize: 19,
                color: "#141414",
                lineHeight: "100%",
              }}
            >
              Edit Lead Info
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

      {/* ── Form Body ── */}
      <div
        className="leads-modal-body"
        style={{
          width: 462,
          height: 496,
          background: "rgba(245, 246, 250, 1)",
          borderBottomRightRadius: 12,
          borderBottomLeftRadius: 12,
          paddingTop: 32,
          paddingLeft: 20,
          paddingRight: 20,
          paddingBottom: 24,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: 422,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
        {/* Lead name */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>
            Lead name<span style={{ color: "var(--Foundation-brand-brand-500, #00236F)" }}>*</span>
          </label>
          <input
            type="text"
            value={leadName}
            onChange={(e) => setLeadName(e.target.value)}
            placeholder="Enter lead name"
            style={inputStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>

        {/* Company name */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>
            Company name<span style={{ color: "var(--Foundation-brand-brand-500, #00236F)" }}>*</span>
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Enter company name"
            style={inputStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>

        {/* Phone number */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>
            Phone number<span style={{ color: "var(--Foundation-brand-brand-500, #00236F)" }}>*</span>
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+20xxxxxxxxxx"
            style={inputStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>

        {/* Next followup */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>
            Next followup<span style={{ color: "var(--Foundation-brand-brand-500, #00236F)" }}>*</span>
          </label>
          <div style={{ position: "relative", width: "100%" }}>
            {/* Display formatted date as read-only overlay */}
            <input
              type="text"
              readOnly
              value={formatDate(nextFollowup)}
              placeholder="DD/MM/YYYY"
              style={{
                ...inputStyle,
                paddingRight: 48,
                caretColor: "transparent",
                cursor: "pointer",
              }}
            />
            {/* Hidden date picker */}
            <input
              type="date"
              value={nextFollowup}
              onChange={(e) => setNextFollowup(e.target.value)}
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0,
                cursor: "pointer",
                width: "100%",
                height: "100%",
              }}
            />
            {/* Calendar icon */}
            <img
              src={calendarPlusIcon}
              alt="Pick date"
              width={22}
              height={22}
              style={{
                position: "absolute",
                right: 14,
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={!isSaveEnabled}
            style={{
              marginTop: 40,
            alignSelf: "center",
            width: 422,
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
        </div>
      </div>
    </div>
  );
};

export default Edit_lead_info;
