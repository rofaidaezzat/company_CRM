import React, { useState } from "react";
import closeIcon from "../../assets/x-02.svg";
import cameraIcon from "../../assets/carbon_camera.svg";
import "../../styles/leads-modal-mobile.css";

interface EditProfileProps {
  onClose?: () => void;
  onSave?: (data: { fullName: string; phoneNumber: string }) => void;
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

const Edit_Profile: React.FC<EditProfileProps> = ({ onClose, onSave }) => {
  const [fullName, setFullName] = useState("Mahmoud Eldawly");
  const [phoneNumber, setPhoneNumber] = useState("01122334455");

  const handleSave = () => {
    if (onSave) {
      onSave({ fullName, phoneNumber });
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "#3B5BDB";
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "rgba(212, 213, 216, 1)";
  };

  return (
    <div
      className="leads-modal-root"
      style={{
        width: 462,
        height: 540,
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
          Edit Profile
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
          flex: 1, // takes remaining height
          background: "rgba(245, 246, 250, 1)",
          padding: "24px 20px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: 20,
          overflowY: "auto",
        }}
      >
        {/* Avatar Section */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{ position: "relative" }}>
            {/* Avatar Box */}
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: 16,
                background: "#8FA0C0", // grayish blue matching screenshot
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                fontSize: 28,
              }}
            >
              MS
            </div>
            {/* Camera Icon Badge */}
            <div
              style={{
                position: "absolute",
                bottom: -4,
                right: -4,
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "rgba(0, 35, 111, 1)", // Navy blue
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                border: "2px solid #fff", // slight white border to make it pop
              }}
            >
              <img src={cameraIcon} alt="Change Photo" width={16} height={16} />
            </div>
          </div>
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 13,
              color: "#6B7280",
              cursor: "pointer",
            }}
          >
            Tap to change photo
          </span>
        </div>

        {/* Form Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 8 }}>
          <div>
            <label style={labelStyle}>
              Full name<span style={{ color: "#00236F" }}>*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={inputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>
          <div>
            <label style={labelStyle}>
              Phone number<span style={{ color: "#00236F" }}>*</span>
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
        </div>

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

export default Edit_Profile;
