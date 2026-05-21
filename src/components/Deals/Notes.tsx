import React, { useState } from 'react';
import closeIcon from '../../assets/x-02.svg';
import "../../styles/leads-modal-mobile.css";

const Notes = ({ onClose }: { onClose?: () => void }) => {
  const [noteText, setNoteText] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <div
      className="leads-modal-root"
      style={{
        width: 462,
        height: 528,
        display: "flex",
        flexDirection: "column",
        fontFamily: "Inter, sans-serif",
        boxShadow: "0px 4px 6px -1px rgba(0, 0, 0, 0.1)", // Default shadow for modals
        borderRadius: 12,
      }}
    >
      {/* ── First Part (Header) ── */}
      <div
        className="leads-modal-header"
        style={{
          background: "rgba(245, 246, 250, 1)",
          width: 462,
          height: 91,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          borderBottom: "1px solid rgba(212, 213, 216, 1)",
          padding: 20,
          boxSizing: "border-box",
        }}
      >
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            fontSize: 19,
            color: "#141414",
            lineHeight: "100%",
          }}
        >
          Notes
        </span>

        {/* Close Button */}
        <div
          onClick={onClose}
          style={{
            boxShadow: "0px 1px 3px 0px rgba(0, 0, 0, 0.11)",
            background: "rgba(255, 255, 255, 1)",
            width: 36,
            height: 36,
            borderRadius: 99,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <img src={closeIcon} alt="close" width={20} height={20} />
        </div>
      </div>

      {/* ── Second Section (Body) ── */}
      <div
        className="leads-modal-body"
        style={{
          background: "rgba(245, 246, 250, 1)",
          width: 462,
          height: 437,
          minHeight: 437,
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
          flexDirection: "column",
          boxSizing: "border-box",
          padding: "32px 20px 24px 20px",
          position: "relative",
          display: "flex",
        }}
      >
        {/* Message Card */}
        <div
          style={{
            className: "leads-modal-inner",
            boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.059)", // Approximation of #0000000F
            background: "#FFFFFF",
            width: "100%",
            height: 132,
            borderRadius: 12,
            padding: 12,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            boxSizing: "border-box",
            opacity: 1,
          }}
        >
          {/* Header of card */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {/* Timestamp */}
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                fontSize: 13,
                lineHeight: "140%",
                color: "rgba(116, 116, 116, 1)",
                height: 18,
              }}
            >
              25/03/2026 , 07:22
            </div>

            {/* Action Icons Group */}
            <div style={{ display: "flex", gap: 8, width: 88, height: 24 }}>
              {/* Flag Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ cursor: "pointer" }}>
                <path d="M3 21H7.90909M5.45455 12.3913V3H21L18.5455 7.69565L21 12.3913H5.45455ZM5.45455 12.3913V20.2174" stroke="#141414" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {/* Edit Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ cursor: "pointer" }}>
                <path d="M13.7992 19.5514H19.7992M4.19922 19.5514L8.5652 18.6717C8.79698 18.625 9.0098 18.5109 9.17694 18.3437L18.9506 8.56461C19.4192 8.09576 19.4189 7.33577 18.9499 6.86731L16.8795 4.79923C16.4107 4.33097 15.6511 4.33129 15.1827 4.79995L5.40798 14.58C5.24117 14.7469 5.12727 14.9593 5.08052 15.1906L4.19922 19.5514Z" stroke="#141414" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {/* Trash Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ cursor: "pointer" }}>
                <path d="M4 6.17647H20M10 16.7647V10.4118M14 16.7647V10.4118M16 21H8C6.89543 21 6 20.0519 6 18.8824V7.23529C6 6.65052 6.44772 6.17647 7 6.17647H17C17.5523 6.17647 18 6.65052 18 7.23529V18.8824C18 20.0519 17.1046 21 16 21ZM10 6.17647H14C14.5523 6.17647 15 5.70242 15 5.11765V4.05882C15 3.47405 14.5523 3 14 3H10C9.44772 3 9 3.47405 9 4.05882V5.11765C9 5.70242 9.44772 6.17647 10 6.17647Z" stroke="#A80D0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* Text Content */}
          <div
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              fontSize: 13,
              lineHeight: "140%",
              color: "rgba(70, 70, 70, 1)",
              width: "100%",
              flex: 1,
            }}
          >
            Lorem ipsum dolor sit amet consectetur. Nec enim morbi tristique amet urna. Commodo venenatis libero in id aliquet morbi purus. Interdum commodo at amet eget. Tempor morbi tristique dapibus a dolor blandit.
          </div>
        </div>

        {/* ── Input Box / Success Bar ── */}
        <div
          style={{
            marginTop: "auto",
            width: "100%",
            height: isSubmitted ? 48 : 85,
            boxSizing: "border-box",
            transition: "height 0.2s",
          }}
        >
          {isSubmitted ? (
            <div
              style={{
                borderRadius: 12,
                background: "#00236F",
                display: "flex",
                width: "100%",
                height: 48,
                padding: "8px 24px",
                justifyContent: "center",
                alignItems: "center",
                gap: 8,
                boxSizing: "border-box",
              }}
            >
              <span style={{ color: "#fff", fontFamily: "Inter, sans-serif", fontSize: 14 }}>
                Save
              </span>
            </div>
          ) : (
            <>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add note..."
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: noteText ? 8 : 12,
                  border: noteText ? "1px solid #00236F" : "1px solid rgba(212, 213, 216, 1)",
                  padding: "12px 16px",
                  outline: "none",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 14,
                  resize: "none",
                  boxSizing: "border-box",
                  background: "#fff",
                  transition: "border 0.2s, border-radius 0.2s",
                }}
              />
              {noteText && (
                <div
                  onClick={() => setIsSubmitted(true)}
                  style={{
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                    right: 12,
                    display: "flex",
                    width: 36,
                    height: 36,
                    padding: 6,
                    justifyContent: "center",
                    alignItems: "center",
                    flexShrink: 0,
                    borderRadius: 12,
                    background: "#00236F",
                    boxShadow: "0px 1px 3px 0px rgba(0, 0, 0, 0.11)",
                    cursor: "pointer",
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="7" height="12" viewBox="0 0 7 12" fill="none">
                    <path d="M1 1L6 6L1 11" stroke="#F5F6FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes;
