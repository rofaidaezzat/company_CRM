import React, { useState } from "react";
import closeIcon from "../../assets/x-02.svg";
import plusIcon from "../../assets/plus-02.svg";
import "../../styles/leads-modal-mobile.css";
import { useCreateDealMutation } from "../../app/service/cruddeals";
import { toast } from "sonner";

interface AddNewDealProps {
  onClose?: () => void;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 48,
  border: "1px solid var(--Foundation-brand-brand-500, #D4D5D8)",
  borderRadius: 8,
  padding: "0 14px",
  fontFamily: "Inter, sans-serif",
  fontSize: 14,
  color: "#141414",
  background: "transparent",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s, background 0.2s",
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  height: 96,
  border: "1px solid var(--Foundation-brand-brand-500, #D4D5D8)",
  borderRadius: 8,
  padding: "12px 14px",
  fontFamily: "Inter, sans-serif",
  fontSize: 14,
  color: "#141414",
  background: "transparent",
  outline: "none",
  boxSizing: "border-box",
  resize: "none",
  transition: "border-color 0.2s, background 0.2s",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "Inter, sans-serif",
  fontWeight: 500,
  fontSize: 13,
  color: "#141414",
  marginBottom: 6,
  display: "block",
};

const SOURCE_OPTIONS = [
  "Organic",
  "Referral",
  "Ads",
  "Website",
  "Farmer",
  "Facebook",
  "TikTok",
  "Instagram",
  "WhatsApp",
  "Telegram",
  "LinkedIn",
  "Twitter",
  "YouTube",
  "Other"
];

const CITY_OPTIONS = [
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
  "Other"
];

const Add_new_deal: React.FC<AddNewDealProps> = ({ onClose }) => {
  const [customerName, setCustomerName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [customerSource, setCustomerSource] = useState("");
  const [isSourceOpen, setIsSourceOpen] = useState(false);

  const [city, setCity] = useState("");
  const [isCityOpen, setIsCityOpen] = useState(false);

  const [value, setValue] = useState("");
  const [serviceDetails, setServiceDetails] = useState("");

  const [createDeal, { isLoading: isSubmitting }] = useCreateDealMutation();

  const isSaveEnabled =
    customerName.trim() !== "" &&
    companyName.trim() !== "" &&
    phoneNumber.trim() !== "" &&
    customerSource.trim() !== "" &&
    city.trim() !== "" &&
    value.trim() !== "" &&
    serviceDetails.trim() !== "";

  const handleSave = async () => {
    if (!isSaveEnabled || isSubmitting) return;

    try {
      // Normalize city enum to match backend expectations
      const normalizedCity = (() => {
        const lower = city.trim().toLowerCase();
        if (lower === "cairo") return "CAIRO";
        if (lower === "giza") return "GIZA";
        if (lower === "alexandria") return "ALEXANDRIA";
        return "CAIRO";
      })();

      await createDeal({
        phone: phoneNumber.trim(),
        name: customerName.trim(),
        company_name: companyName.trim(),
        source: customerSource.toUpperCase(),
        city: normalizedCity,
        value: Number(value),
        deals_details: serviceDetails.trim(),
      }).unwrap();

      toast.success("Deal created successfully");
      if (onClose) onClose();
    } catch (err: any) {
      console.error("Failed to save deal:", err);
      const errMsg = err?.data?.message || err?.message || "An error occurred";
      toast.error(Array.isArray(errMsg) ? errMsg.join(", ") : errMsg);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "var(--Foundation-brand-brand-500, #00236F)";
    e.currentTarget.style.background = "#fff";
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "var(--Foundation-brand-brand-500, #D4D5D8)";
    e.currentTarget.style.background = "transparent";
  };

  return (
    <div
      className="leads-modal-root"
      style={{
        width: 462,
        height: 650,
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
          height: 72,
          background: "rgba(245, 246, 250, 1)",
          borderBottom: "1px solid rgba(212, 213, 216, 1)",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          padding: "20px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxSizing: "border-box",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img src={plusIcon} alt="Add New Deal" width={24} height={24} />
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              fontSize: 19,
              color: "#141414",
              lineHeight: "100%",
            }}
          >
            Add New Deal
          </span>
        </div>

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

      {/* ── Form Body ── */}
      <div
        className="leads-modal-body"
        style={{
          width: 462,
          flex: 1,
          background: "rgba(245, 246, 250, 1)",
          borderBottomRightRadius: 12,
          borderBottomLeftRadius: 12,
          padding: "24px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          overflowY: "auto",
        }}
      >
        {/* Customer Name */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>
            Customer name<span style={{ color: "var(--Foundation-brand-brand-500, #00236F)" }}>*</span>
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            style={inputStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>

        {/* Company Name */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>
            Company name<span style={{ color: "var(--Foundation-brand-brand-500, #00236F)" }}>*</span>
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            style={inputStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>

        {/* Phone Number */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>
            Phone number<span style={{ color: "var(--Foundation-brand-brand-500, #00236F)" }}>*</span>
          </label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            style={inputStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>

        {/* Customer Source */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>
            Customer Source<span style={{ color: "var(--Foundation-brand-brand-500, #00236F)" }}>*</span>
          </label>
          <div style={{ position: "relative", width: "100%" }}>
            <div
              onClick={() => setIsSourceOpen(!isSourceOpen)}
              style={{
                ...inputStyle,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: customerSource ? "#141414" : "#6B7280",
                cursor: "pointer",
                userSelect: "none",
                borderColor: "var(--Foundation-brand-brand-500, #D4D5D8)",
              }}
            >
              <span>{customerSource || "Choose a lead source"}</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  transform: isSourceOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                  flexShrink: 0,
                }}
              >
                <path d="M6 9L12 15L18 9" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {isSourceOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  marginTop: 8,
                  background: "#fff",
                  border: "1px solid rgba(212, 213, 216, 1)",
                  borderRadius: 8,
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
                  zIndex: 10,
                  padding: "8px 0",
                  display: "flex",
                  flexDirection: "column",
                  maxHeight: 200,
                  overflowY: "auto",
                }}
              >
                {SOURCE_OPTIONS.map((option) => (
                  <div
                    key={option}
                    onClick={() => {
                      setCustomerSource(option);
                      setIsSourceOpen(false);
                    }}
                    style={{
                      padding: "12px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      cursor: "pointer",
                      background: customerSource === option ? "rgba(245, 246, 250, 1)" : "#fff",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(245, 246, 250, 1)")}
                    onMouseLeave={(e) => {
                      if (customerSource !== option) {
                        e.currentTarget.style.background = "#fff";
                      }
                    }}
                  >
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        border: customerSource === option ? "5px solid #00236F" : "2px solid #8B909A",
                        boxSizing: "border-box",
                        transition: "border 0.2s",
                      }}
                    />
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#141414" }}>
                      {option}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* City */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>
            City<span style={{ color: "var(--Foundation-brand-brand-500, #00236F)" }}>*</span>
          </label>
          <div style={{ position: "relative", width: "100%" }}>
            <div
              onClick={() => setIsCityOpen(!isCityOpen)}
              style={{
                ...inputStyle,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: city ? "#141414" : "#6B7280",
                cursor: "pointer",
                userSelect: "none",
                borderColor: "var(--Foundation-brand-brand-500, #D4D5D8)",
              }}
            >
              <span>{city || "Choose a city"}</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  transform: isCityOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                  flexShrink: 0,
                }}
              >
                <path d="M6 9L12 15L18 9" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {isCityOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  marginTop: 8,
                  background: "#fff",
                  border: "1px solid rgba(212, 213, 216, 1)",
                  borderRadius: 8,
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
                  zIndex: 10,
                  padding: "8px 0",
                  display: "flex",
                  flexDirection: "column",
                  maxHeight: 200,
                  overflowY: "auto",
                }}
              >
                {CITY_OPTIONS.map((option) => (
                  <div
                    key={option}
                    onClick={() => {
                      setCity(option);
                      setIsCityOpen(false);
                    }}
                    style={{
                      padding: "12px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      cursor: "pointer",
                      background: city === option ? "rgba(245, 246, 250, 1)" : "#fff",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(245, 246, 250, 1)")}
                    onMouseLeave={(e) => {
                      if (city !== option) {
                        e.currentTarget.style.background = "#fff";
                      }
                    }}
                  >
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        border: city === option ? "5px solid #00236F" : "2px solid #8B909A",
                        boxSizing: "border-box",
                        transition: "border 0.2s",
                      }}
                    />
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#141414" }}>
                      {option}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Value */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>
            Value<span style={{ color: "var(--Foundation-brand-brand-500, #00236F)" }}>*</span>
          </label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            style={inputStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>

        {/* Service Details */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>
            Service Details<span style={{ color: "var(--Foundation-brand-brand-500, #00236F)" }}>*</span>
          </label>
          <textarea
            value={serviceDetails}
            onChange={(e) => setServiceDetails(e.target.value)}
            style={textareaStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>

        {/* Submit Button Container */}
        <div style={{ marginTop: 8, flexShrink: 0 }}>
          <button
            onClick={handleSave}
            disabled={!isSaveEnabled || isSubmitting}
            style={{
              background: isSaveEnabled && !isSubmitting ? "var(--Foundation-brand-brand-500, #00236F)" : "rgba(212, 213, 216, 1)",
              width: "100%",
              height: 48,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              cursor: isSaveEnabled && !isSubmitting ? "pointer" : "not-allowed",
              color: isSaveEnabled && !isSubmitting ? "#fff" : "#9CA3AF",
              fontFamily: "Inter, sans-serif",
              fontSize: 16,
              fontWeight: 500,
              boxSizing: "border-box",
            }}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Add_new_deal;
