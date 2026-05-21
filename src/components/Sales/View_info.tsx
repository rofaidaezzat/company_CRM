import React, { useState } from 'react';
import { X, ChevronDown, User } from 'lucide-react';

interface ViewInfoProps {
  salesId: number;
  initialFirstName: string;
  initialLastName: string;
  initialEmail: string;
  initialWhatsapp: string;
  initialCountry: string;
  initialCity: string;
  onClose: () => void;
  onSave?: (updatedData: {
    firstName: string;
    lastName: string;
    email: string;
    whatsapp: string;
    country: string;
    city: string;
  }) => void;
}

export const View_info: React.FC<ViewInfoProps> = ({
  salesId,
  initialFirstName,
  initialLastName,
  initialEmail,
  initialWhatsapp,
  initialCountry,
  initialCity,
  onClose,
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [email, setEmail] = useState(initialEmail);
  const [whatsapp, setWhatsapp] = useState(initialWhatsapp);
  const [country, setCountry] = useState(initialCountry);
  const [city, setCity] = useState(initialCity);

  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

  const countries = ['Egypt', 'Saudi Arabia', 'UAE', 'USA'];
  const cities = ['Cairo', 'Giza', 'Riyadh', 'Dubai', 'New York'];

  const handleSave = () => {
    if (onSave) {
      onSave({
        firstName,
        lastName,
        email,
        whatsapp,
        country,
        city,
      });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFirstName(initialFirstName);
    setLastName(initialLastName);
    setEmail(initialEmail);
    setWhatsapp(initialWhatsapp);
    setCountry(initialCountry);
    setCity(initialCity);
    setIsEditing(false);
  };

  const inputWrapperStyle = {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-start",
    gap: 8,
    alignSelf: "stretch",
    boxSizing: "border-box" as const,
  };

  const labelStyle = {
    fontFamily: "Inter, sans-serif",
    fontSize: 14,
    fontWeight: 500,
    color: "#464646",
  };

  const asteriskStyle = {
    color: "#00236F",
  };

  const getInputStyle = (editable: boolean) => ({
    width: "100%",
    height: 48,
    padding: "0 12px",
    borderRadius: 8,
    boxSizing: "border-box" as const,
    fontFamily: "Inter, sans-serif",
    fontSize: 14,
    color: "#141414",
    border: editable ? "1px solid var(--Foundation-neutral-neutral-100, #D4D5D8)" : "none",
    background: editable ? "transparent" : "var(--Foundation-neutral-neutral-100, #D4D5D8)",
    outline: "none",
  });

  return (
    <div
      style={{
        display: "flex",
        width: 536,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        background: "#FFF",
        borderRadius: 12,
        boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
        overflow: "visible",
      }}
    >
      {/* ── First Part (Header) ── */}
      <div
        style={{
          borderRadius: "12px 12px 0 0",
          borderBottom: "1px solid var(--Foundation-neutral-neutral-100, #D4D5D8)",
          background: "var(--Foundation-neutral-neutral-25, #F5F6FA)",
          display: "flex",
          padding: "20px",
          justifyContent: "space-between",
          alignItems: "center",
          alignSelf: "stretch",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <User size={20} color="#141414" />
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 20,
              fontWeight: 700,
              color: "#141414",
            }}
          >
            Sales Info
          </span>
        </div>

        <button
          onClick={onClose}
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "#FFF",
            border: "1px solid #D4D5D8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0px 1px 2px rgba(0,0,0,0.05)",
          }}
        >
          <X size={18} color="#464646" />
        </button>
      </div>

      {/* ── Second Part (Body) ── */}
      <div
        style={{
          borderRadius: "0 0 12px 12px",
          background: "var(--Foundation-neutral-neutral-25, #F5F6FA)",
          display: "flex",
          padding: "24px 20px",
          alignItems: "flex-start",
          gap: 12,
          alignSelf: "stretch",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 496,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-end",
            gap: 16,
            boxSizing: "border-box",
          }}
        >
          {/* Edit Info Trigger Button (Only when not editing) */}
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 0,
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                fontWeight: 600,
                color: "#00236F",
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M9.19976 13.0344H13.1998M2.7998 13.0344L5.71046 12.4479C5.86498 12.4168 6.00686 12.3407 6.11828 12.2292L12.6341 5.70982C12.9465 5.39725 12.9463 4.8906 12.6336 4.57829L11.2533 3.19957C10.9408 2.88739 10.4344 2.88761 10.1221 3.20005L3.60565 9.72008C3.49444 9.83135 3.4185 9.97294 3.38734 10.1271L2.7998 13.0344Z" stroke="#00236F" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Edit info
            </button>
          )}

          {/* First Name & Last Name */}
          <div style={{ display: "flex", gap: 16, width: "100%", boxSizing: "border-box" }}>
            <div style={{ ...inputWrapperStyle, flex: "1 0 0" }}>
              <span style={labelStyle}>
                First Name<span style={asteriskStyle}>*</span>
              </span>
              <input
                type="text"
                value={firstName}
                disabled={!isEditing}
                onChange={(e) => setFirstName(e.target.value)}
                style={getInputStyle(isEditing)}
              />
            </div>
            <div style={{ ...inputWrapperStyle, flex: "1 0 0" }}>
              <span style={labelStyle}>
                Last Name<span style={asteriskStyle}>*</span>
              </span>
              <input
                type="text"
                value={lastName}
                disabled={!isEditing}
                onChange={(e) => setLastName(e.target.value)}
                style={getInputStyle(isEditing)}
              />
            </div>
          </div>

          {/* Email Address */}
          <div style={{ ...inputWrapperStyle, width: "100%" }}>
            <span style={labelStyle}>
              Email Address<span style={asteriskStyle}>*</span>
            </span>
            <input
              type="email"
              value={email}
              disabled={!isEditing}
              onChange={(e) => setEmail(e.target.value)}
              style={getInputStyle(isEditing)}
            />
          </div>

          {/* Whatsapp Number */}
          <div style={{ ...inputWrapperStyle, width: "100%" }}>
            <span style={labelStyle}>
              Whatsapp Number<span style={asteriskStyle}>*</span>
            </span>
            <input
              type="text"
              value={whatsapp}
              disabled={!isEditing}
              onChange={(e) => setWhatsapp(e.target.value)}
              style={getInputStyle(isEditing)}
            />
          </div>

          {/* Country & City Select */}
          <div style={{ display: "flex", gap: 16, width: "100%", boxSizing: "border-box" }}>
            <div style={{ ...inputWrapperStyle, flex: "1 0 0", position: "relative" }}>
              <span style={labelStyle}>
                Country<span style={asteriskStyle}>*</span>
              </span>
              <div
                onClick={() => isEditing && setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                style={{
                  ...getInputStyle(isEditing),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: isEditing ? "pointer" : "default",
                }}
              >
                <span>{country || 'Select country'}</span>
                <ChevronDown size={18} color="#747474" />
              </div>

              {/* Country custom options */}
              {isEditing && isCountryDropdownOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: 80,
                    left: 0,
                    right: 0,
                    zIndex: 999,
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    padding: "8px",
                    borderRadius: 12,
                    background: "#FFF",
                    boxShadow: "0px 2px 4px rgba(0,0,0,0.17)",
                    boxSizing: "border-box",
                  }}
                >
                  {countries.map((c) => {
                    const selected = country === c;
                    return (
                      <div
                        key={c}
                        onClick={() => {
                          setCountry(c);
                          setIsCountryDropdownOpen(false);
                        }}
                        style={{
                          display: "flex",
                          padding: 12,
                          alignItems: "center",
                          gap: 8,
                          borderRadius: 8,
                          background: selected ? "#F0F4FF" : "transparent",
                          cursor: "pointer",
                          boxSizing: "border-box",
                        }}
                      >
                        {selected ? (
                          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="10" cy="10" r="9" stroke="#00236F" strokeWidth="2"/>
                            <circle cx="10" cy="10" r="5" fill="#00236F"/>
                          </svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="10" cy="10" r="9" stroke="#9CA3AF" strokeWidth="2"/>
                          </svg>
                        )}
                        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#141414" }}>{c}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div style={{ ...inputWrapperStyle, flex: "1 0 0", position: "relative" }}>
              <span style={labelStyle}>
                City<span style={asteriskStyle}>*</span>
              </span>
              <div
                onClick={() => isEditing && setIsCityDropdownOpen(!isCityDropdownOpen)}
                style={{
                  ...getInputStyle(isEditing),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: isEditing ? "pointer" : "default",
                }}
              >
                <span>{city || 'Select city'}</span>
                <ChevronDown size={18} color="#747474" />
              </div>

              {/* City custom options */}
              {isEditing && isCityDropdownOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: 80,
                    left: 0,
                    right: 0,
                    zIndex: 999,
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    padding: "8px",
                    borderRadius: 12,
                    background: "#FFF",
                    boxShadow: "0px 2px 4px rgba(0,0,0,0.17)",
                    boxSizing: "border-box",
                  }}
                >
                  {cities.map((ct) => {
                    const selected = city === ct;
                    return (
                      <div
                        key={ct}
                        onClick={() => {
                          setCity(ct);
                          setIsCityDropdownOpen(false);
                        }}
                        style={{
                          display: "flex",
                          padding: 12,
                          alignItems: "center",
                          gap: 8,
                          borderRadius: 8,
                          background: selected ? "#F0F4FF" : "transparent",
                          cursor: "pointer",
                          boxSizing: "border-box",
                        }}
                      >
                        {selected ? (
                          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="10" cy="10" r="9" stroke="#00236F" strokeWidth="2"/>
                            <circle cx="10" cy="10" r="5" fill="#00236F"/>
                          </svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="10" cy="10" r="9" stroke="#9CA3AF" strokeWidth="2"/>
                          </svg>
                        )}
                        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#141414" }}>{ct}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Action buttons (only when editing) */}
          {isEditing && (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 16,
                alignSelf: "stretch",
                width: "100%",
                marginTop: 16,
                boxSizing: "border-box",
              }}
            >
              <button
                onClick={handleCancel}
                style={{
                  flex: "1 0 0",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#00236F",
                  display: "flex",
                  height: 48,
                  padding: "8px 24px",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 8,
                  fontFamily: "Inter, sans-serif",
                  fontSize: 15,
                  fontWeight: 600,
                  boxSizing: "border-box",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                style={{
                  borderRadius: 12,
                  background: "var(--Foundation-brand-brand-500, #00236F)",
                  display: "flex",
                  height: 48,
                  padding: "8px 24px",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 8,
                  border: "none",
                  cursor: "pointer",
                  color: "#FFF",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 15,
                  fontWeight: 600,
                  flex: "1 0 0",
                  boxSizing: "border-box",
                }}
              >
                Save
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
