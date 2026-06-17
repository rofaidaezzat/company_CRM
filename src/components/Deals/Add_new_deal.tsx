import React, { useState } from "react";
import closeIcon from "../../assets/x-02.svg";
import plusIcon from "../../assets/plus-02.svg";
import "../../styles/leads-modal-mobile.css";
import { useCreateDealMutation } from "../../app/service/cruddeals";
import { toast } from "sonner";

const Add_new_deal = ({ onClose }: { onClose?: () => void }) => {
  const [customerName, setCustomerName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [customerSource, setCustomerSource] = useState("");
  const [city, setCity] = useState("");
  const [value, setValue] = useState("");
  const [serviceDetails, setServiceDetails] = useState("");

  const [createDeal] = useCreateDealMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);

    try {
      // 1. Normalize city enum
      const normalizedCity = (() => {
        const lower = city.trim().toLowerCase();
        if (lower === "cairo") return "CAIRO";
        if (lower === "giza") return "GIZA";
        if (lower === "alexandria") return "ALEXANDRIA";
        return "CAIRO";
      })();

      // 2. Create the deal directly
      await createDeal({
        phone: phoneNumber.trim(),
        name: customerName.trim(),
        company_name: companyName.trim(),
        source: customerSource,
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="leads-modal-root"
      style={{
        width: 462,
        maxHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Inter, sans-serif",
        boxShadow: "0px 4px 6px -1px rgba(0, 0, 0, 0.1)", // Default shadow for modals
        position: "relative",
      }}
    >
      {/* ── First Part (Header) ── */}
      <div
        className="leads-modal-header"
        style={{
          background: "rgba(245, 246, 250, 1)",
          width: 462,
          height: 76,
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
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img src={plusIcon} alt="add" width={20} height={20} />
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

      {/* ── Second Part (Body) ── */}
      <div
        className="leads-modal-body"
        style={{
          background: "rgba(245, 246, 250, 1)",
          width: 462,
          flex: 1,
          minHeight: 0,
          borderBottomRightRadius: 12,
          borderBottomLeftRadius: 12,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ── Form Container ── */}
        <div
          style={{
            width: "calc(100% - 40px)",
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            gap: 16,
            marginTop: 32,
            marginLeft: 20,
            marginRight: 20,
            boxSizing: "border-box",
            overflowY: "auto", // In case it overflows
          }}
        >
          {/* Customer Name */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ fontSize: 14, fontWeight: 500, color: "#4B5563" }}>
              Customer name
              <span style={{ color: "rgba(0, 35, 111, 1)" }}>*</span>
            </label>
            <input
              type="text"
              placeholder="Input text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              style={{
                width: "100%",
                height: 44,
                borderRadius: 12,
                border: "1px solid rgba(212, 213, 216, 1)",
                padding: "0 16px",
                outline: "none",
                fontFamily: "Inter",
                fontSize: 14,
                boxSizing: "border-box",
                background: "transparent",
              }}
            />
          </div>

          {/* Company Name */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ fontSize: 14, fontWeight: 500, color: "#4B5563" }}>
              Company name
              <span style={{ color: "rgba(0, 35, 111, 1)" }}>*</span>
            </label>
            <input
              type="text"
              placeholder="Input text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              style={{
                width: "100%",
                height: 44,
                borderRadius: 12,
                border: "1px solid rgba(212, 213, 216, 1)",
                padding: "0 16px",
                outline: "none",
                fontFamily: "Inter",
                fontSize: 14,
                boxSizing: "border-box",
                background: "transparent",
              }}
            />
          </div>

          {/* Phone Number */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ fontSize: 14, fontWeight: 500, color: "#4B5563" }}>
              Phone number
              <span style={{ color: "rgba(0, 35, 111, 1)" }}>*</span>
            </label>
            <input
              type="text"
              placeholder="Input text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              style={{
                width: "100%",
                height: 44,
                borderRadius: 12,
                border: "1px solid rgba(212, 213, 216, 1)",
                padding: "0 16px",
                outline: "none",
                fontFamily: "Inter",
                fontSize: 14,
                boxSizing: "border-box",
                background: "transparent",
              }}
            />
          </div>

          {/* Customer Source */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ fontSize: 14, fontWeight: 500, color: "#4B5563" }}>
              Customer Source
              <span style={{ color: "rgba(0, 35, 111, 1)" }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <select
                value={customerSource}
                onChange={(e) => setCustomerSource(e.target.value)}
                style={{
                  width: "100%",
                  height: 44,
                  borderRadius: 12,
                  border: "1px solid rgba(212, 213, 216, 1)",
                  padding: "0 16px",
                  outline: "none",
                  fontFamily: "Inter",
                  fontSize: 14,
                  boxSizing: "border-box",
                  appearance: "none",
                  color: customerSource ? "#141414" : "#6B7280",
                  background: "transparent",
                }}
              >
                <option value="" disabled>
                  Choose a lead source
                </option>
                <option value="ORGANIC">Organic</option>
                <option value="REFERRAL">Referral</option>
                <option value="ADS">Ads</option>
                <option value="WEBSITE">Website</option>
                <option value="FARMER">Farmer</option>
                <option value="FACEBOOK">Facebook</option>
                <option value="TIKTOK">TikTok</option>
                <option value="INSTAGRAM">Instagram</option>
                <option value="WHATSAPP">WhatsApp</option>
                <option value="TELEGRAM">Telegram</option>
                <option value="LINKEDIN">LinkedIn</option>
                <option value="TWITTER">Twitter</option>
                <option value="YOUTUBE">YouTube</option>
                <option value="OTHER">Other</option>
              </select>
              {/* Custom dropdown arrow */}
              <div
                style={{
                  position: "absolute",
                  right: 16,
                  top: 18,
                  pointerEvents: "none",
                }}
              >
                <svg
                  width="12"
                  height="8"
                  viewBox="0 0 12 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 1.5L6 6.5L11 1.5"
                    stroke="#141414"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* City */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ fontSize: 14, fontWeight: 500, color: "#4B5563" }}>
              City
              <span style={{ color: "rgba(0, 35, 111, 1)" }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                style={{
                  width: "100%",
                  height: 44,
                  borderRadius: 12,
                  border: "1px solid rgba(212, 213, 216, 1)",
                  padding: "0 16px",
                  outline: "none",
                  fontFamily: "Inter",
                  fontSize: 14,
                  boxSizing: "border-box",
                  appearance: "none",
                  color: city ? "#141414" : "#6B7280",
                  background: "transparent",
                }}
              >
                <option value="" disabled>
                  Choose a lead source
                </option>
                <option value="Cairo">Cairo</option>
                <option value="Giza">Giza</option>
                <option value="Alexandria">Alexandria</option>
              </select>
              {/* Custom dropdown arrow */}
              <div
                style={{
                  position: "absolute",
                  right: 16,
                  top: 18,
                  pointerEvents: "none",
                }}
              >
                <svg
                  width="12"
                  height="8"
                  viewBox="0 0 12 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 1.5L6 6.5L11 1.5"
                    stroke="#141414"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Value */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ fontSize: 14, fontWeight: 500, color: "#4B5563" }}>
              Value
              <span style={{ color: "rgba(0, 35, 111, 1)" }}>*</span>
            </label>
            <input
              type="number"
              placeholder="Input text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              style={{
                width: "100%",
                height: 44,
                borderRadius: 12,
                border: "1px solid rgba(212, 213, 216, 1)",
                padding: "0 16px",
                outline: "none",
                fontFamily: "Inter",
                fontSize: 14,
                boxSizing: "border-box",
                background: "transparent",
              }}
            />
          </div>

          {/* Service Details */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ fontSize: 14, fontWeight: 500, color: "#4B5563" }}>
              Service Details
              <span style={{ color: "rgba(0, 35, 111, 1)" }}>*</span>
            </label>
            <textarea
              value={serviceDetails}
              onChange={(e) => setServiceDetails(e.target.value)}
              style={{
                width: "100%",
                height: 96,
                borderRadius: 12,
                border: "1px solid rgba(212, 213, 216, 1)",
                padding: "12px 16px",
                outline: "none",
                fontFamily: "Inter",
                fontSize: 14,
                boxSizing: "border-box",
                resize: "none",
                background: "transparent",
              }}
            />
          </div>
        </div>

        {/* ── Submit Button Container ── */}
        <div
          style={{
            marginTop: 48,
            marginLeft: 20,
            marginRight: 20,
            width: "calc(100% - 40px)",
            paddingBottom: 32,
            flexShrink: 0,
          }}
        >
          <button
            onClick={handleSave}
            disabled={!isSaveEnabled || isSubmitting}
            style={{
              background: isSaveEnabled && !isSubmitting ? "rgba(0, 35, 111, 1)" : "rgba(212, 213, 216, 1)",
              width: "100%",
              height: 48,
              borderRadius: 12,
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
