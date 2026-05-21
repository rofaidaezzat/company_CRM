import React, { useState } from "react";
import closeIcon from "../../assets/x-02.svg";
import eyeClosedIcon from "../../assets/eye-closed.svg";
import "../../styles/leads-modal-mobile.css";

interface ChangePasswordProps {
  onClose?: () => void;
  onSave?: (data: { currentPass: string; newPass: string; confirmPass: string }) => void;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 48,
  border: "1px solid rgba(212, 213, 216, 1)",
  borderRadius: 8,
  padding: "0 40px 0 14px", // right padding for the icon
  fontFamily: "Inter, sans-serif",
  fontSize: 14,
  color: "#141414",
  background: "#fff",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "Inter, sans-serif",
  fontWeight: 500,
  fontSize: 13,
  color: "#4B5563",
  marginBottom: 6,
  display: "block",
};

const PasswordInput = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) => {
  const [show, setShow] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label style={labelStyle}>
        {label}<span style={{ color: "#00236F" }}>*</span>
      </label>
      <div style={{ position: "relative", width: "100%" }}>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={inputStyle}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#3B5BDB")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(212, 213, 216, 1)")}
        />
        <img
          src={eyeClosedIcon}
          alt="Toggle visibility"
          onClick={() => setShow(!show)}
          style={{
            position: "absolute",
            right: 14,
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "pointer",
            width: 20,
            height: 20,
            opacity: show ? 0.5 : 1, // subtle visual difference when open
          }}
        />
      </div>
    </div>
  );
};

const Change_password: React.FC<ChangePasswordProps> = ({ onClose, onSave }) => {
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const handleSave = () => {
    if (onSave) {
      onSave({ currentPass, newPass, confirmPass });
    }
  };

  return (
    <div
      className="leads-modal-root"
      style={{
        width: 462,
        height: 469,
        opacity: 1,
        display: "flex",
        flexDirection: "column",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.12)",
        background: "rgba(245, 246, 250, 1)",
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
          Change Password
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
          flex: 1,
          padding: "24px 20px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <PasswordInput
          label="Current password"
          value={currentPass}
          onChange={setCurrentPass}
        />
        <PasswordInput
          label="New password"
          value={newPass}
          onChange={setNewPass}
        />
        <PasswordInput
          label="Confirm password"
          value={confirmPass}
          onChange={setConfirmPass}
        />

        {/* Actions */}
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            gap: 12,
          }}
        >
          <button
            onClick={onClose}
            style={{
              flex: 1,
              height: 48,
              borderRadius: 12,
              border: "1px solid rgba(212, 213, 216, 1)",
              background: "transparent",
              color: "#141414",
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: 15,
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              flex: 1,
              height: 48,
              borderRadius: 12,
              border: "none",
              background: "rgba(0, 35, 111, 1)",
              color: "#fff",
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: 15,
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Change_password;
