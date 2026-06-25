import React, { useState, useRef } from "react";
import plusIcon from "../../assets/plus-02.svg";
import closeIcon from "../../assets/x-02.svg";
import calendarPlusIcon from "../../assets/calendar-plus.svg";
import "../../styles/leads-modal-mobile.css";
import { useCreateLeadMutation } from "../../app/service/crudleads";
import { useGetSalesMembersQuery } from "../../app/service/crudsales";
import { useAssignLeadMutation } from "../../app/service/crudAssignment_lead";

interface AddNewLeadProps {
  onClose?: () => void;
  onSave?: (data: {
    leadName: string;
    companyName: string;
    phoneNumber: string;
    leadSource: string;
    status?: string;
    assignedToId?: string;
    nextFollowup?: string;
  }) => void;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 48,
  border: "1px solid var(--Foundation-brand-brand-500, #D4D5D8)",
  borderRadius: 8,
  padding: "0 14px",
  fontFamily: "Inter, sans-serif",
  fontSize: 14,
  color: "#141414",
  background: "transparent",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s, background 0.2s",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "Inter, sans-serif",
  fontWeight: 500,
  fontSize: 13,
  color: "#141414",
  marginBottom: 6,
  display: "block",
};

const STATUS_UI_TO_API: Record<string, string> = {
  "Fresh": "FRESH",
  "Follow up": "FOLLOW_UP",
  "Interested": "INTERESTED",
  "Not interested": "NOT_INTERESTED",
  "Meeting": "MEETING",
  "After meeting followup": "FOLLOW_UP_AFTER_MEETING",
  "Wrong number": "WRONG_NUMBER",
  "No answer": "NO_ANSWER",
};

const STATUS_OPTIONS = [
  "Fresh",
  "Follow up",
  "Interested",
  "Not interested",
  "Meeting",
  "After meeting followup",
  "Wrong number",
  "No answer",
];

const LEAD_SOURCE_OPTIONS = ["Organic", "Referral", "Ads", "Website", "Farmer"];

const Add_new_lead: React.FC<AddNewLeadProps> = ({ onClose, onSave }) => {
  const [leadName, setLeadName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  
  // Custom dropdown states
  const [leadSource, setLeadSource] = useState("");
  const [isSourceOpen, setIsSourceOpen] = useState(false);

  const [leadStatus, setLeadStatus] = useState("Fresh");
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const [assignTo, setAssignTo] = useState(""); // Stores sales member ID
  const [assignName, setAssignName] = useState(""); // Stores sales member name
  const [isAssignOpen, setIsAssignOpen] = useState(false);

  const [nextFollowup, setNextFollowup] = useState(""); // YYYY-MM-DD
  const dateInputRef = useRef<HTMLInputElement>(null);

  const [createLead, { isLoading: isSaving }] = useCreateLeadMutation();
  const [assignLead] = useAssignLeadMutation();
  const { data: salesMembersResponse } = useGetSalesMembersQuery();
  const salesMembers = salesMembersResponse?.data || [];

  const isSaveEnabled =
    leadName.trim() !== "" &&
    companyName.trim() !== "" &&
    phoneNumber.trim() !== "" &&
    leadSource.trim() !== "" &&
    assignTo.trim() !== "" &&
    nextFollowup.trim() !== "";

  const getTodayDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleDatePickerClick = () => {
    try {
      dateInputRef.current?.showPicker();
    } catch (e) {
      console.warn("showPicker is not supported or failed", e);
    }
  };

  const formatDate = (iso: string) => {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
  };

  const handleSave = async () => {
    if (!isSaveEnabled || isSaving) return;
    try {
      const res = await createLead({
        name: leadName,
        company_name: companyName,
        phone: phoneNumber,
        source: leadSource.toUpperCase(),
        status: STATUS_UI_TO_API[leadStatus] || "FRESH",
        next_follow_up: nextFollowup ? `${nextFollowup}T00:00:00.000Z` : null,
      }).unwrap();

      const createdLeadId = res.data?.id;
      if (createdLeadId && assignTo) {
        try {
          await assignLead({
            lead_id: createdLeadId,
            sales_id: assignTo,
          }).unwrap();
        } catch (assignErr) {
          console.error("Failed to assign lead after creation:", assignErr);
        }
      }

      if (onSave) {
        onSave({
          leadName,
          companyName,
          phoneNumber,
          leadSource,
          status: leadStatus,
          assignedToId: assignTo,
          nextFollowup,
        });
      }
      onClose?.();
    } catch (err) {
      console.error("Failed to add new lead:", err);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "var(--Foundation-brand-brand-500, #00236F)";
    e.currentTarget.style.background = "#fff";
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "var(--Foundation-brand-brand-500, #D4D5D8)";
    e.currentTarget.style.background = "transparent";
  };

  return (
    <div
      className="leads-modal-root"
      style={{
        width: 462,
        height: 650,
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
        style={{
          width: 462,
          height: 72,
          background: "rgba(245, 246, 250, 1)",
          borderBottom: "1px solid rgba(212, 213, 216, 1)",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          padding: "20px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxSizing: "border-box",
          flexShrink: 0,
        }}
      >
        {/* Left: icon + title */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img src={plusIcon} alt="Add New Lead" width={24} height={24} />
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              fontSize: 19,
              color: "#141414",
              lineHeight: "100%",
            }}
          >
            Add New Lead
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
          flex: 1,
          background: "rgba(245, 246, 250, 1)",
          borderBottomRightRadius: 12,
          borderBottomLeftRadius: 12,
          padding: "24px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          overflowY: "auto",
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
            style={inputStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>

        {/* Status */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>Status</label>
          <div style={{ position: "relative", width: "100%" }}>
            <div
              onClick={() => setIsStatusOpen(!isStatusOpen)}
              style={{
                ...inputStyle,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: leadStatus ? "#141414" : "#6B7280",
                cursor: "pointer",
                userSelect: "none",
                borderColor: "var(--Foundation-brand-brand-500, #D4D5D8)",
              }}
            >
              <span>{leadStatus || "Choose a status"}</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  transform: isStatusOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                  flexShrink: 0,
                }}
              >
                <path d="M6 9L12 15L18 9" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            {isStatusOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  marginTop: 8,
                  background: "#fff",
                  border: "1px solid rgba(212, 213, 216, 1)",
                  borderRadius: 8,
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
                  zIndex: 10,
                  padding: "8px 0",
                  display: "flex",
                  flexDirection: "column",
                  maxHeight: 200,
                  overflowY: "auto",
                }}
              >
                {STATUS_OPTIONS.map((option) => (
                  <div
                    key={option}
                    onClick={() => {
                      setLeadStatus(option);
                      setIsStatusOpen(false);
                    }}
                    style={{
                      padding: "12px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      cursor: "pointer",
                      background: leadStatus === option ? "rgba(245, 246, 250, 1)" : "#fff",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(245, 246, 250, 1)")}
                    onMouseLeave={(e) => {
                      if (leadStatus !== option) {
                        e.currentTarget.style.background = "#fff";
                      }
                    }}
                  >
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        border: leadStatus === option ? "5px solid #00236F" : "2px solid #8B909A",
                        boxSizing: "border-box",
                        transition: "border 0.2s",
                      }}
                    />
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#141414" }}>
                      {option}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Assign to */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>
            Assign to<span style={{ color: "var(--Foundation-brand-brand-500, #00236F)" }}>*</span>
          </label>
          <div style={{ position: "relative", width: "100%" }}>
            <div
              onClick={() => setIsAssignOpen(!isAssignOpen)}
              style={{
                ...inputStyle,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: assignName ? "#141414" : "#6B7280",
                cursor: "pointer",
                userSelect: "none",
                borderColor: "var(--Foundation-brand-brand-500, #D4D5D8)",
              }}
            >
              <span>{assignName || "Select sales name"}</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  transform: isAssignOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                  flexShrink: 0,
                }}
              >
                <path d="M6 9L12 15L18 9" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            {isAssignOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  marginTop: 8,
                  background: "#fff",
                  border: "1px solid rgba(212, 213, 216, 1)",
                  borderRadius: 8,
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
                  zIndex: 10,
                  padding: "8px 0",
                  display: "flex",
                  flexDirection: "column",
                  maxHeight: 200,
                  overflowY: "auto",
                }}
              >
                {salesMembers.map((member) => {
                  const fullName = `${member.first_name} ${member.last_name}`;
                  const isSelected = assignTo === member.id;
                  return (
                    <div
                      key={member.id}
                      onClick={() => {
                        setAssignTo(member.id);
                        setAssignName(fullName);
                        setIsAssignOpen(false);
                      }}
                      style={{
                        padding: "12px 16px",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        cursor: "pointer",
                        background: isSelected ? "rgba(245, 246, 250, 1)" : "#fff",
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(245, 246, 250, 1)")}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = "#fff";
                        }
                      }}
                    >
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          border: isSelected ? "5px solid #00236F" : "2px solid #8B909A",
                          boxSizing: "border-box",
                          transition: "border 0.2s",
                        }}
                      />
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#141414" }}>
                        {fullName}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Lead Source */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>
            Lead Source<span style={{ color: "var(--Foundation-brand-brand-500, #00236F)" }}>*</span>
          </label>
          <div style={{ position: "relative", width: "100%" }}>
            {/* Custom Select Box */}
            <div
              onClick={() => setIsSourceOpen(!isSourceOpen)}
              style={{
                ...inputStyle,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: leadSource ? "#141414" : "#6B7280",
                cursor: "pointer",
                userSelect: "none",
                borderColor: "var(--Foundation-brand-brand-500, #D4D5D8)",
              }}
            >
              <span>{leadSource || "Choose a lead source"}</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  transform: isSourceOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                  flexShrink: 0,
                }}
              >
                <path d="M6 9L12 15L18 9" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* Dropdown Menu */}
            {isSourceOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  marginTop: 8,
                  background: "#fff",
                  border: "1px solid rgba(212, 213, 216, 1)",
                  borderRadius: 8,
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
                  zIndex: 10,
                  padding: "8px 0",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {LEAD_SOURCE_OPTIONS.map((option) => (
                  <div
                    key={option}
                    onClick={() => {
                      setLeadSource(option);
                      setIsSourceOpen(false);
                    }}
                    style={{
                      padding: "12px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      cursor: "pointer",
                      background: leadSource === option ? "rgba(245, 246, 250, 1)" : "#fff",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(245, 246, 250, 1)")}
                    onMouseLeave={(e) => {
                      if (leadSource !== option) {
                        e.currentTarget.style.background = "#fff";
                      }
                    }}
                  >
                    {/* Radio Button */}
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        border: leadSource === option ? "5px solid #00236F" : "2px solid #8B909A",
                        boxSizing: "border-box",
                        transition: "border 0.2s",
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: 14,
                        color: "#141414",
                      }}
                    >
                      {option}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Next followup */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>
            Next followup<span style={{ color: "var(--Foundation-brand-brand-500, #00236F)" }}>*</span>
          </label>
          <div
            onClick={handleDatePickerClick}
            style={{ position: "relative", width: "100%", cursor: "pointer" }}
          >
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
                borderColor: "var(--Foundation-brand-brand-500, #D4D5D8)",
              }}
            />
            <input
              ref={dateInputRef}
              type="date"
              value={nextFollowup}
              min={getTodayDateString()}
              onChange={(e) => setNextFollowup(e.target.value)}
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0,
                cursor: "pointer",
                width: "100%",
                height: "100%",
                zIndex: 1,
              }}
            />
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
                zIndex: 2,
              }}
            />
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={!isSaveEnabled || isSaving}
          style={{
            marginTop: "auto",
            alignSelf: "center",
            width: "100%",
            height: 48,
            borderRadius: 12,
            border: "none",
            background: (isSaveEnabled && !isSaving)
              ? "rgba(0, 35, 111, 1)"
              : "rgba(212, 213, 216, 1)",
            color: (isSaveEnabled && !isSaving) ? "#fff" : "#9CA3AF",
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: 15,
            cursor: (isSaveEnabled && !isSaving) ? "pointer" : "not-allowed",
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
            flexShrink: 0,
          }}
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default Add_new_lead;
