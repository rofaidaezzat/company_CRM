import React, { useState } from "react";
import "../../styles/leads-modal-mobile.css";

interface NewReportModalProps {
  onClose?: () => void;
  onSubmit?: (data: any) => void;
  dateStr?: string;
}

const getDynamicInputStyle = (value: string): React.CSSProperties => ({
  width: "100%",
  height: 48,
  border: "1px solid rgba(212, 213, 216, 1)",
  borderRadius: 8,
  padding: "12px",
  fontFamily: "Inter, sans-serif",
  fontSize: 14,
  color: "#141414",
  background: value ? "#D4D5D8" : "transparent",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s, background 0.2s",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  alignSelf: "stretch",
});

const readOnlyBoxStyle: React.CSSProperties = {
  borderRadius: 8,
  background: "#D4D5D8",
  display: "flex",
  height: 48,
  padding: "20px",
  justifyContent: "space-between",
  alignItems: "center",
  alignSelf: "stretch",
  color: "#141414",
  fontFamily: "Inter, sans-serif",
  fontSize: 14,
  boxSizing: "border-box",
};

const getDynamicTextareaStyle = (value: string): React.CSSProperties => ({
  width: "100%",
  height: 120,
  resize: "none",
  border: "1px solid rgba(212, 213, 216, 1)",
  borderRadius: 8,
  padding: "12px",
  fontFamily: "Inter, sans-serif",
  fontSize: 14,
  color: "#141414",
  background: value ? "#D4D5D8" : "transparent",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s, background 0.2s",
});

const labelStyle: React.CSSProperties = {
  fontFamily: "Inter, sans-serif",
  fontWeight: 400, // They look regular/medium
  fontSize: 14,
  color: "#4B5563", // Dark grey text
  marginBottom: 8,
  display: "block",
};

const New_Report_Modal: React.FC<NewReportModalProps> = ({
  onClose,
  onSubmit,
  dateStr = "dd/mm/yyyy",
}) => {
  const [calls, setCalls] = useState("");
  const [leads, setLeads] = useState("");
  const [followups, setFollowups] = useState("");
  const [meetings, setMeetings] = useState("");
  const [priority, setPriority] = useState("");
  const [notes, setNotes] = useState("");
  const [dealsClosed, setDealsClosed] = useState("");
  const [dealsValue, setDealsValue] = useState("");

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({ calls, leads, followups, meetings, dealsClosed, dealsValue, priority, notes });
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!e.currentTarget.readOnly) {
      e.currentTarget.style.borderColor = "#3B5BDB";
    }
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!e.currentTarget.readOnly) {
      e.currentTarget.style.borderColor = "rgba(212, 213, 216, 1)";
    }
  };

  return (
    <div
      className="leads-modal-root"
      style={{
        width: 762,
        height: 596,
        background: "rgba(245, 246, 250, 1)",
        borderRadius: 12,
        padding: 20,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: 24,
        boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.12)",
      }}
    >
      {/* ── Header ── */}
      <div className="leads-modal-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2
          style={{
            margin: 0,
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            fontSize: 20,
            color: "#00236F", // Dark blue from screenshot
          }}
        >
          New Report
        </h2>
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 14,
            color: "#6B7280",
          }}
        >
          {dateStr}
        </span>
      </div>

      {/* ── Form Body ── */}
      <div
        className="leads-grid-mobile"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          columnGap: 24,
          rowGap: 16,
          flex: 1,
        }}
      >
        {/* Row 1 */}
        <div>
          <label style={labelStyle}>
            How many calls did you make today ?<span style={{ color: "#00236F" }}>*</span>
          </label>
          <input
            type="number"
            value={calls}
            onChange={(e) => setCalls(e.target.value)}
            style={getDynamicInputStyle(calls)}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>
        <div>
          <label style={labelStyle}>
            How many leads did you contact today?<span style={{ color: "#00236F" }}>*</span>
          </label>
          <input
            type="number"
            value={leads}
            onChange={(e) => setLeads(e.target.value)}
            style={getDynamicInputStyle(leads)}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>

        {/* Row 2 */}
        <div>
          <label style={labelStyle}>
            How many follow-ups did you complete today?<span style={{ color: "#00236F" }}>*</span>
          </label>
          <input
            type="number"
            value={followups}
            onChange={(e) => setFollowups(e.target.value)}
            style={getDynamicInputStyle(followups)}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>
        <div>
          <label style={labelStyle}>
            How many meetings or demos did you conduct today<span style={{ color: "#00236F" }}>*</span>
          </label>
          <input
            type="number"
            value={meetings}
            onChange={(e) => setMeetings(e.target.value)}
            style={getDynamicInputStyle(meetings)}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>

        {/* Row 3 */}
        <div>
          <label style={labelStyle}>
            How many deals did you close today ?<span style={{ color: "#00236F" }}>*</span>
          </label>
          <input
            type="number"
            value={dealsClosed}
            onChange={(e) => setDealsClosed(e.target.value)}
            style={getDynamicInputStyle(dealsClosed)}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>
        <div>
          <label style={labelStyle}>
            Total value of deals closed today<span style={{ color: "#00236F" }}>*</span>
          </label>
          <input
            type="text"
            value={dealsValue}
            onChange={(e) => setDealsValue(e.target.value)}
            style={getDynamicInputStyle(dealsValue)}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>

        {/* Row 4 */}
        <div>
          <label style={labelStyle}>
            What is your top priority for tomorrow?<span style={{ color: "#00236F" }}>*</span>
          </label>
          <input
            type="text"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            style={getDynamicInputStyle(priority)}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>
        <div style={{ gridRow: "span 2" }}>
          <label style={labelStyle}>Additional Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={getDynamicTextareaStyle(notes)}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="leads-modal-footer">
        <button
          className="leads-modal-footer-btn"
          onClick={handleSubmit}
          style={{
            background: "rgba(0, 35, 111, 1)",
            width: 158,
            height: 56,
            borderRadius: 12,
            border: "none",
            color: "#fff",
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: 15,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px 24px",
            boxSizing: "border-box",
            transition: "background 0.2s",
          }}
        >
          Submit Report
        </button>
      </div>
    </div>
  );
};

export default New_Report_Modal;
