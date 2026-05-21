import React from 'react';
import '../../styles/sales-modals-mobile.css';

interface PauseAccountProps {
  onClose: () => void;
  accountName?: string;
}

export const Pause_Account: React.FC<PauseAccountProps> = ({ onClose, accountName = "Ahmed Mohammed" }) => {
  return (
    <div
      className="sales-modal-container"
      style={{
        borderRadius: 12,
        background: "var(--Foundation-neutral-neutral-25, #F5F6FA)",
        display: "flex",
        width: 462,
        paddingTop: 32,
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 33,
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div
          className="sales-modal-text"
          style={{
            color: "var(--Foundation-neutral-neutral-950, #141414)",
            textAlign: "center",
            fontFamily: "Inter, sans-serif",
            fontSize: 19,
            fontWeight: 500,
            lineHeight: "140%",
            width: 422,
          }}
        >
          Are you sure you want to Pause<br />
          {accountName} ?
        </div>
        <div
          className="sales-modal-text"
          style={{
            color: "var(--Foundation-neutral-neutral-800, #464646)",
            textAlign: "center",
            fontFamily: "Inter, sans-serif",
            fontSize: 16,
            fontWeight: 400,
            lineHeight: "140%",
            width: 422,
          }}
        >
          This action will stop assigning new leads to this<br />
          sales member.
        </div>
      </div>

      <div
        style={{
          borderRadius: "0 0 12px 12px",
          background: "var(--Foundation-neutral-neutral-25, #F5F6FA)",
          display: "flex",
          height: 76,
          padding: "8px 20px 20px 20px",
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
          width: "100%",
          boxSizing: "border-box",
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
            gap: 8,
            flex: "1 0 0",
            background: "transparent",
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            fontSize: 16,
            fontWeight: 600,
            color: "#141414",
          }}
        >
          Cancel
        </button>
        <button
          style={{
            borderRadius: 12,
            background: "var(--Foundation-error-red-700, #A80D0B)",
            border: "none",
            display: "flex",
            height: 48,
            padding: "8px 24px",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
            flex: "1 0 0",
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            fontSize: 16,
            fontWeight: 600,
            color: "#FFF",
          }}
        >
          Pause
        </button>
      </div>
    </div>
  );
};
