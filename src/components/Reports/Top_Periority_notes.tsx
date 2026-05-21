import React from "react";
import closeIcon from "../../assets/x-02.svg";
import "../../styles/leads-modal-mobile.css";

interface TopPriorityNotesProps {
  onClose?: () => void;
  priorityText?: string;
  notesText?: string;
}

const labelStyle: React.CSSProperties = {
  fontFamily: "Inter, sans-serif",
  fontWeight: 400,
  fontSize: 14,
  color: "#4B5563", // Dark grey
  marginBottom: 8,
  display: "block",
};

const readOnlyBoxStyle: React.CSSProperties = {
  width: "100%",
  background: "#D4D5D8", // Grey background matching screenshot
  borderRadius: 8,
  padding: "12px 14px",
  fontFamily: "Inter, sans-serif",
  fontSize: 14,
  color: "#141414",
  boxSizing: "border-box",
};

const Top_Periority_notes: React.FC<TopPriorityNotesProps> = ({
  onClose,
  priorityText = "Closing 5 new deals.",
  notesText = "Lorem ipsum dolor sit amet consectetur. Risus dictumst ullamcorper elementum ac massa morbi. Nunc phasellus in viverra morbi diam aenean risus diam in.",
}) => {
  return (
    <div
      className="leads-modal-root"
      style={{
        width: 462,
        height: 371,
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
          height: 76,
          background: "rgba(245, 246, 250, 1)",
          borderBottom: "1px solid rgba(212, 213, 216, 1)",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          padding: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxSizing: "border-box",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            fontSize: 16,
            color: "#141414",
          }}
        >
          Top Priority and Notes
        </span>
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

      {/* ── Body ── */}
      <div
        className="leads-modal-body"
        style={{
          width: 462,
          height: 295,
          background: "rgba(245, 246, 250, 1)",
          borderBottomRightRadius: 12,
          borderBottomLeftRadius: 12,
          padding: "24px 20px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* Priority Section */}
        <div>
          <label style={labelStyle}>What is your top priority for tomorrow ?</label>
          <div style={{ ...readOnlyBoxStyle, minHeight: 44 }}>
            {priorityText}
          </div>
        </div>

        {/* Notes Section */}
        <div>
          <label style={labelStyle}>Additional Notes</label>
          <div style={{ ...readOnlyBoxStyle, minHeight: 120 }}>
            {notesText}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Top_Periority_notes;
