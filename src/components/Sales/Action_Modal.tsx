import React from 'react';

interface ActionModalProps {
  onClose: () => void;
  onPause: () => void;
  onEditTarget?: () => void;
  onViewInfo?: () => void;
  onDelete?: () => void;
}

export const Action_Modal: React.FC<ActionModalProps> = ({ onClose, onPause, onEditTarget, onViewInfo, onDelete }) => {
  return (
    <div style={{ position: "absolute", top: "100%", right: 0, zIndex: 10, marginTop: 4 }}>
      <div
        style={{
          borderRadius: 12,
          background: "var(--Foundation-neutral-white, #FFF)",
          boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.17)",
          display: "inline-flex",
          padding: 12,
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 4,
          minWidth: 140,
        }}
      >
        {/* Edit target */}
        <div 
          style={{ display: "flex", width: "100%", height: 40, alignItems: "center", gap: 8, cursor: "pointer", borderRadius: 8, padding: "0 8px", boxSizing: "border-box" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#F3F4F6"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          onClick={() => { onClose(); onEditTarget && onEditTarget(); }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <path d="M12 12V11C11.4477 11 11 11.4477 11 12H12ZM12.0797 12H13.0797C13.0797 11.4477 12.632 11 12.0797 11V12ZM12.0797 12.0721V13.0721C12.632 13.0721 13.0797 12.6244 13.0797 12.0721H12.0797ZM12 12.0721H11C11 12.6244 11.4477 13.0721 12 13.0721V12.0721ZM21 12H20C20 16.4183 16.4183 20 12 20V21V22C17.5228 22 22 17.5228 22 12H21ZM12 21V20C7.58172 20 4 16.4183 4 12H3H2C2 17.5228 6.47715 22 12 22V21ZM3 12H4C4 7.58172 7.58172 4 12 4V3V2C6.47715 2 2 6.47715 2 12H3ZM12 3V4C16.4183 4 20 7.58172 20 12H21H22C22 6.47715 17.5228 2 12 2V3ZM16.5 12H15.5C15.5 13.933 13.933 15.5 12 15.5V16.5V17.5C15.0376 17.5 17.5 15.0376 17.5 12H16.5ZM12 16.5V15.5C10.067 15.5 8.5 13.933 8.5 12H7.5H6.5C6.5 15.0376 8.96243 17.5 12 17.5V16.5ZM7.5 12H8.5C8.5 10.067 10.067 8.5 12 8.5V7.5V6.5C8.96243 6.5 6.5 8.96243 6.5 12H7.5ZM12 7.5V8.5C13.933 8.5 15.5 10.067 15.5 12H16.5H17.5C17.5 8.96243 15.0376 6.5 12 6.5V7.5ZM12 12V13H12.0797V12V11H12V12ZM12.0797 12H11.0797V12.0721H12.0797H13.0797V12H12.0797ZM12.0797 12.0721V11.0721H12V12.0721V13.0721H12.0797V12.0721ZM12 12.0721H13V12H12H11V12.0721H12Z" fill="#464646"/>
          </svg>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#141414", whiteSpace: "nowrap" }}>Edit target</span>
        </div>

        {/* View info */}
        <div 
          style={{ display: "flex", width: "100%", height: 40, alignItems: "center", gap: 8, cursor: "pointer", borderRadius: 8, padding: "0 8px", boxSizing: "border-box" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#F3F4F6"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          onClick={() => { onClose(); onViewInfo && onViewInfo(); }}
        >
          <div style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M2.06202 12.348C1.97868 12.1235 1.97868 11.8765 2.06202 11.652C2.87372 9.68385 4.25153 8.00103 6.02079 6.81689C7.79004 5.63275 9.87106 5.00061 12 5.00061C14.129 5.00061 16.21 5.63275 17.9792 6.81689C19.7485 8.00103 21.1263 9.68385 21.938 11.652C22.0214 11.8765 22.0214 12.1235 21.938 12.348C21.1263 14.3161 19.7485 15.999 17.9792 17.1831C16.21 18.3672 14.129 18.9994 12 18.9994C9.87106 18.9994 7.79004 18.3672 6.02079 17.1831C4.25153 15.999 2.87372 14.3161 2.06202 12.348Z" stroke="#464646" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#464646" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
          </div>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#141414", whiteSpace: "nowrap" }}>View info</span>
        </div>

        {/* Pause lead */}
        <div 
          style={{ display: "flex", width: "100%", height: 40, alignItems: "center", gap: 8, cursor: "pointer", borderRadius: 8, padding: "0 8px", boxSizing: "border-box" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#FEF2F2"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          onClick={() => { onClose(); onPause(); }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <path d="M17.625 3H6.375C4.51104 3 3 4.51104 3 6.375V17.625C3 19.489 4.51104 21 6.375 21H17.625C19.489 21 21 19.489 21 17.625V6.375C21 4.51104 19.489 3 17.625 3Z" stroke="#A80D0B" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M8.625 9.89062C8.625 9.19164 9.19164 8.625 9.89062 8.625H14.1094C14.8084 8.625 15.375 9.19164 15.375 9.89062V14.1094C15.375 14.8084 14.8084 15.375 14.1094 15.375H9.89062C9.19164 15.375 8.625 14.8084 8.625 14.1094V9.89062Z" stroke="#A80D0B" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#A80D0B", whiteSpace: "nowrap" }}>Pause lead</span>
        </div>

        {/* Delete */}
        <div 
          style={{ display: "flex", width: "100%", height: 40, alignItems: "center", gap: 8, cursor: "pointer", borderRadius: 8, padding: "0 8px", boxSizing: "border-box" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#FEF2F2"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          onClick={() => { onClose(); onDelete && onDelete(); }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <path d="M4 6.17647H20M10 16.7647V10.4118M14 16.7647V10.4118M16 21H8C6.89543 21 6 20.0519 6 18.8824V7.23529C6 6.65052 6.44772 6.17647 7 6.17647H17C17.5523 6.17647 18 6.65052 18 7.23529V18.8824C18 20.0519 17.1046 21 16 21ZM10 6.17647H14C14.5523 6.17647 15 5.70242 15 5.11765V4.05882C15 3.47405 14.5523 3 14 3H10C9.44772 3 9 3.47405 9 4.05882V5.11765C9 5.70242 9.44772 6.17647 10 6.17647Z" stroke="#A80D0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#A80D0B", whiteSpace: "nowrap" }}>Delete</span>
        </div>
      </div>
    </div>
  );
};
