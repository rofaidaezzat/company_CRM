import React, { useState } from 'react';
import { X, ChevronDown, UserPlus } from 'lucide-react';

interface AddNewSalesProps {
  onClose: () => void;
  onSave?: (data: {
    firstName: string;
    lastName: string;
    email: string;
    whatsapp: string;
    gender: string;
    country: string;
    city: string;
    role: string;
    password: string;
  }) => void;
}

export const Add_New_Sales: React.FC<AddNewSalesProps> = ({ onClose, onSave }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');

  const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const genders = ['Male', 'Female'];
  const countries = ['Egypt', 'Saudi Arabia', 'UAE', 'USA'];
  const cities = [
    "Cairo",
    "Giza",
    "Alexandria",
    "Qalyubia",
    "Sharqia",
    "Gharbia",
    "Monufia",
    "Beheira",
    "Dakahlia",
    "Damietta",
    "Port Said",
    "Ismailia",
    "Suez",
    "North Sinai",
    "South Sinai",
    "Kafr El Sheikh",
    "Fayoum",
    "Beni Suef",
    "Minya",
    "Assiut",
    "Sohag",
    "Qena",
    "Luxor",
    "Aswan",
    "Red Sea",
    "New Valley",
    "Matrouh",
    "Other",
  ];
  const roles = ['Sales member', 'Sales manager'];

  const isFormValid =
    firstName.trim() !== '' &&
    lastName.trim() !== '' &&
    email.trim() !== '' &&
    whatsapp.trim() !== '' &&
    gender !== '' &&
    country !== '' &&
    city !== '' &&
    role !== '' &&
    password.trim() !== '';

  const handleSave = () => {
    if (!isFormValid) return;
    if (onSave) {
      onSave({
        firstName,
        lastName,
        email,
        whatsapp,
        gender,
        country,
        city,
        role,
        password,
      });
    }
    onClose();
  };

  const inputWrapperStyle = {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-start",
    gap: 6,
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

  const inputStyle = {
    width: "100%",
    height: 42,
    padding: "0 12px",
    borderRadius: 8,
    boxSizing: "border-box" as const,
    fontFamily: "Inter, sans-serif",
    fontSize: 14,
    color: "#141414",
    border: "1px solid var(--Foundation-neutral-neutral-100, #D4D5D8)",
    background: "transparent",
    outline: "none",
  };

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
          <UserPlus size={20} color="#141414" />
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 20,
              fontWeight: 700,
              color: "#141414",
            }}
          >
            Add New Sales
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
          padding: "20px 20px",
          alignItems: "flex-start",
          gap: 12,
          alignSelf: "stretch",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            height: 500,
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 16,
            alignSelf: "stretch",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {/* Scrollable form fields area */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              width: "100%",
              flex: 1,
              overflowY: "auto",
              paddingRight: 4,
              boxSizing: "border-box",
            }}
          >
            {/* First Name & Last Name */}
            <div style={{ display: "flex", gap: 12, width: "100%", boxSizing: "border-box", flexShrink: 0 }}>
              <div style={{ ...inputWrapperStyle, flex: "1 0 0" }}>
                <span style={labelStyle}>
                  First Name<span style={asteriskStyle}>*</span>
                </span>
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={{ ...inputWrapperStyle, flex: "1 0 0" }}>
                <span style={labelStyle}>
                  Last Name<span style={asteriskStyle}>*</span>
                </span>
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Email Address */}
            <div style={{ ...inputWrapperStyle, width: "100%", flexShrink: 0 }}>
              <span style={labelStyle}>
                Email Address<span style={asteriskStyle}>*</span>
              </span>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
              />
            </div>

            {/* Whatsapp Number */}
            <div style={{ ...inputWrapperStyle, width: "100%", flexShrink: 0 }}>
              <span style={labelStyle}>
                Whatsapp Number<span style={asteriskStyle}>*</span>
              </span>
              <input
                type="text"
                placeholder="Whatsapp Number"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                style={inputStyle}
              />
            </div>

            {/* Gender Dropdown */}
            <div style={{ ...inputWrapperStyle, width: "100%", flexShrink: 0, position: "relative" }}>
              <span style={labelStyle}>
                Gender<span style={asteriskStyle}>*</span>
              </span>
              <div
                onClick={() => {
                  setIsGenderDropdownOpen(!isGenderDropdownOpen);
                  setIsCountryDropdownOpen(false);
                  setIsCityDropdownOpen(false);
                  setIsRoleDropdownOpen(false);
                }}
                style={{
                  ...inputStyle,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                }}
              >
                <span style={{ color: gender ? "#141414" : "#9CA3AF" }}>
                  {gender || 'Choose gender'}
                </span>
                <ChevronDown size={18} color="#747474" />
              </div>

              {/* Gender custom options */}
              {isGenderDropdownOpen && (
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
                  {genders.map((g) => {
                    const selected = gender === g;
                    return (
                      <div
                        key={g}
                        onClick={() => {
                          setGender(g);
                          setIsGenderDropdownOpen(false);
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
                        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#141414" }}>{g}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Country & City Select */}
            <div style={{ display: "flex", gap: 12, width: "100%", boxSizing: "border-box", flexShrink: 0 }}>
              <div style={{ ...inputWrapperStyle, flex: "1 0 0", position: "relative" }}>
                <span style={labelStyle}>
                  Country<span style={asteriskStyle}>*</span>
                </span>
                <div
                  onClick={() => {
                    setIsCountryDropdownOpen(!isCountryDropdownOpen);
                    setIsGenderDropdownOpen(false);
                    setIsCityDropdownOpen(false);
                    setIsRoleDropdownOpen(false);
                  }}
                  style={{
                    ...inputStyle,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ color: country ? "#141414" : "#9CA3AF" }}>
                    {country || 'Select country'}
                  </span>
                  <ChevronDown size={18} color="#747474" />
                </div>

                {/* Country custom options */}
                {isCountryDropdownOpen && (
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
                  onClick={() => {
                    setIsCityDropdownOpen(!isCityDropdownOpen);
                    setIsGenderDropdownOpen(false);
                    setIsCountryDropdownOpen(false);
                    setIsRoleDropdownOpen(false);
                  }}
                  style={{
                    ...inputStyle,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ color: city ? "#141414" : "#9CA3AF" }}>
                    {city || 'Select city'}
                  </span>
                  <ChevronDown size={18} color="#747474" />
                </div>

                {/* City custom options */}
                {isCityDropdownOpen && (
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
                      maxHeight: 200,
                      overflowY: "auto",
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

            {/* Sales Role */}
            <div style={{ ...inputWrapperStyle, width: "100%", flexShrink: 0, position: "relative" }}>
              <span style={labelStyle}>
                Sales Role<span style={asteriskStyle}>*</span>
              </span>
              <div
                onClick={() => {
                  setIsRoleDropdownOpen(!isRoleDropdownOpen);
                  setIsGenderDropdownOpen(false);
                  setIsCountryDropdownOpen(false);
                  setIsCityDropdownOpen(false);
                }}
                style={{
                  ...inputStyle,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                }}
              >
                <span style={{ color: role ? "#141414" : "#9CA3AF" }}>
                  {role || 'Select sales role'}
                </span>
                <ChevronDown size={18} color="#747474" />
              </div>

              {/* Role custom options */}
              {isRoleDropdownOpen && (
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
                  {roles.map((r) => {
                    const selected = role === r;
                    return (
                      <div
                        key={r}
                        onClick={() => {
                          setRole(r);
                          setIsRoleDropdownOpen(false);
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
                        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#141414" }}>{r}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Password */}
            <div style={{ ...inputWrapperStyle, width: "100%", flexShrink: 0 }}>
              <span style={labelStyle}>
                Password<span style={asteriskStyle}>*</span>
              </span>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
              flex: "none",
              alignSelf: "stretch",
              width: "100%",
              marginTop: 8,
              boxSizing: "border-box",
            }}
          >
            <button
              onClick={handleSave}
              disabled={!isFormValid}
              style={{
                borderRadius: 12,
                background: isFormValid
                  ? "var(--Foundation-brand-brand-500, #00236F)"
                  : "var(--Foundation-neutral-neutral-100, #D4D5D8)",
                display: "flex",
                height: 44,
                padding: "8px 24px",
                justifyContent: "center",
                alignItems: "center",
                gap: 8,
                alignSelf: "stretch",
                border: "none",
                cursor: isFormValid ? "pointer" : "not-allowed",
                color: isFormValid ? "#FFF" : "#9CA3AF",
                fontFamily: "Inter, sans-serif",
                fontSize: 16,
                fontWeight: 600,
                boxSizing: "border-box",
                transition: "background-color 0.2s, color 0.2s",
              }}
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
