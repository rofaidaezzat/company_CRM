import React, { useState } from "react";
import closeIcon from "../../assets/x-02.svg";
import "../../styles/leads-modal-mobile.css";

interface EditDealValueProps {
  onClose?: () => void;
  onSave?: (value: string) => void;
  initialValue?: string;
}

const EditDealValue: React.FC<EditDealValueProps> = ({ onClose, onSave, initialValue = "120,000,00" }) => {
  const [value, setValue] = useState(initialValue);

  const handleSave = () => {
    if (onSave) {
      onSave(value);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <div
      className="leads-modal-root"
      style={{
        display: "flex",
        width: 462,
        flexDirection: "column",
        alignItems: "flex-start",
        background: "rgba(245, 246, 250, 1)",
        borderRadius: 12,
        boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.12)",
        overflow: "hidden",
      }}
    >
      {/* ── Header ── */}
      <div
        className="leads-modal-header"
        style={{
          width: "100%",
          height: 91,
          background: "rgba(245, 246, 250, 1)",
          borderBottom: "1px solid rgba(212, 213, 216, 1)",
          padding: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ width: 15.6, height: 15.6 }}>
            <path fillRule="evenodd" clipRule="evenodd" d="M12.1248 1.29303C12.5151 0.902482 13.1481 0.902215 13.5388 1.29244L15.8922 3.6432C16.2831 4.03358 16.2833 4.66691 15.8928 5.05762L5.935 15.0209C5.79572 15.1603 5.61837 15.2554 5.42522 15.2943L1 16.1859L1.89325 11.766C1.9322 11.5732 2.02712 11.3962 2.16613 11.2572L12.1248 1.29303Z" stroke="#464646" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
          <span
            style={{
              color: "#141414",
              fontFamily: "Inter, sans-serif",
              fontSize: 19,
              fontWeight: 700,
              lineHeight: "normal",
            }}
          >
            Edit Deal Value
          </span>
        </div>
        <button
          onClick={onClose}
          style={{
            width: 36,
            height: 36,
            borderRadius: 99,
            background: "#fff",
            border: "none",
            boxShadow: "0px 1px 3px 0px rgba(0, 0, 0, 0.11)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <img src={closeIcon} alt="Close" width={20} height={20} />
        </button>
      </div>

      {/* ── Body ── */}
      <div
        className="leads-modal-body"
        style={{
          width: "100%",
          padding: "32px 20px 24px 20px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <label
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 14,
              color: "#464646",
            }}
          >
            Deal Value*
          </label>
          <input
            type="text"
            className="leads-modal-inner"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            style={{
              width: "100%",
              height: 48,
              borderRadius: 8,
              border: "1px solid #00236F",
              padding: 12,
              display: "flex",
              alignItems: "center",
              gap: 8,
              alignSelf: "stretch",
              boxSizing: "border-box",
              fontFamily: "Inter, sans-serif",
              fontSize: 14,
              color: "#141414",
              outline: "none",
            }}
          />
        </div>

        <button
          className="leads-modal-footer-btn"
          onClick={handleSave}
          style={{
            marginTop: 59,
            width: "100%",
            height: 48,
            borderRadius: 12,
            background: "#00236F",
            display: "flex",
            padding: "8px 24px",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
            color: "#fff",
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: 15,
            border: "none",
            cursor: "pointer",
            boxSizing: "border-box",
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EditDealValue;