import React, { useState } from "react";
import checkSquareIcon from "../../assets/check-square-broken.svg";
import closeIcon from "../../assets/x-02.svg";
import "../../styles/leads-modal-mobile.css";
import { useUpdateLeadMutation, useGetLeadQuery } from "../../app/service/crudleads";
import { toast } from "sonner";
import { useTranslation } from "../../context/LanguageContext";

import addressIcon from "../../assets/Address.svg";
import searchIcon from "../../assets/search-01.svg";

interface ConvertToDealProps {
  onClose?: () => void;
  onConvert?: (data: { value: string; city: string; serviceDetails: string }) => void;
  leadName?: string;
  companyName?: string;
  leadId?: any;
  currentStatus?: any;
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
  background: "transparent",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  height: 120,
  resize: "none",
  border: "1px solid rgba(212, 213, 216, 1)",
  borderRadius: 8,
  padding: "10px 14px",
  fontFamily: "Inter, sans-serif",
  fontSize: 14,
  color: "#141414",
  background: "transparent",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "Inter, sans-serif",
  fontWeight: 500,
  fontSize: 13,
  color: "#141414",
  marginBottom: 6,
  display: "block",
};

const Convert_to_deal: React.FC<ConvertToDealProps> = ({
  onClose,
  onConvert,
  leadName = "John Dorghamasadsad",
  companyName = "Elshayeeb inc.",
  leadId,
}) => {
  const { t } = useTranslation();
  const { data: leadResponse, isLoading: isLeadLoading } = useGetLeadQuery(leadId, { skip: !leadId });
  const [updateLead, { isLoading: isLeadUpdating }] = useUpdateLeadMutation();

  const leadData = leadResponse?.data;

  const [value, setValue] = useState("");
  const [city, setCity] = useState("");
  const [serviceDetails, setServiceDetails] = useState("");
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [citySearch, setCitySearch] = useState("");

  const isMutationLoading = isLeadUpdating;

  const isConvertEnabled =
    !isMutationLoading &&
    !isLeadLoading &&
    value.trim() !== "" && city.trim() !== "" && serviceDetails.trim() !== "";

  const handleConvert = async () => {
    if (!isConvertEnabled) return;
    if (!leadId) {
      toast.error("Lead ID is missing.");
      return;
    }
    try {
      const numericValue = Number(value);

      if (isNaN(numericValue) || numericValue <= 0) {
        toast.error("Value must be a valid positive number.");
        return;
      }

      // Normalize city to match the backend enum ("CAIRO", "GIZA", "ALEXANDRIA")
      const normalizedCity = (() => {
        const lower = city.trim().toLowerCase();
        if (lower === "cairo") return "CAIRO";
        if (lower === "giza") return "GIZA";
        if (lower === "alexandria") return "ALEXANDRIA";
        return "CAIRO";
      })();

      // Single call: PATCH /api/v1/leads/:id?status=DEAL
      // The backend requires value + city in the body to auto-create the deal record.
      await updateLead({
        id: leadId,
        status: "DEAL",
        body: {
          status: "DEAL",
          value: String(numericValue),
          city: normalizedCity,
        },
      }).unwrap();

      toast.success(t('modal.conversionSuccess'));

      if (onConvert) {
        onConvert({ value, city, serviceDetails });
      }
      if (onClose) onClose();
    } catch (err: any) {
      console.error("Conversion failed:", err);
      const raw = err?.data?.message ?? err?.message ?? t('modal.conversionFailed');
      const errMsg = Array.isArray(raw) ? raw.join("\n") : raw;
      toast.error(errMsg);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "#3B5BDB";
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "rgba(212, 213, 216, 1)";
  };

  // Backend enum only accepts CAIRO, GIZA, ALEXANDRIA
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

  return (
    <div
      className="leads-modal-root"
      style={{
        width: 462,
        height: 637,
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
          height: 72,
          background: "rgba(245, 246, 250, 1)",
          borderBottom: "1px solid rgba(212, 213, 216, 1)",
          padding: "20px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxSizing: "border-box",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img src={checkSquareIcon} alt="Convert to Deal" width={24} height={24} />
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              fontSize: 19,
              color: "#141414",
              lineHeight: "100%",
            }}
          >
            {t('modal.convertToDealTitle')}
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
          flex: 1,
          padding: "24px 20px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {/* Info Box */}
        <div
          style={{
            background: "rgba(240, 241, 245, 1)",
            borderRadius: 8,
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#141414", fontWeight: 500 }}>
              {leadName}
            </span>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#6B7280" }}>
              {companyName}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                background: "rgba(229, 231, 235, 1)",
                color: "#4B5563",
                fontSize: 12,
                fontWeight: 500,
                fontFamily: "Inter, sans-serif",
                padding: "4px 8px",
                borderRadius: 4,
              }}
            >
              Interested
            </div>
            {/* Arrow */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 12H18M18 12L14 8M18 12L14 16" stroke="#D4D5D8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div
              style={{
                background: "rgba(209, 250, 229, 1)",
                color: "#065F46",
                fontSize: 12,
                fontWeight: 500,
                fontFamily: "Inter, sans-serif",
                padding: "4px 8px",
                borderRadius: 4,
              }}
            >
              Deal
            </div>
          </div>
        </div>

        {/* Value */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>
            {t('modal.dealValue')}<span style={{ color: "#EF4444" }}>*</span>
          </label>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            style={inputStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>

        {/* City Dropdown */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>
            {t('modal.cityLabel')}<span style={{ color: "#EF4444" }}>*</span>
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
                borderColor: isCityOpen ? "#3B5BDB" : "rgba(212, 213, 216, 1)",
              }}
            >
              <span>{city || t('modal.chooseCity')}</span>
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
                <path d="M6 9L12 15L18 9" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {isCityOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  width: 422,
                  height: 252,
                  marginTop: 8,
                  background: "rgba(255, 255, 255, 1)",
                  borderRadius: 12,
                  boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.17)",
                  zIndex: 10,
                  padding: 12,
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  boxSizing: "border-box",
                }}
              >
                {/* Search Input */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    border: "1px solid rgba(212, 213, 216, 1)",
                    borderRadius: 8,
                    padding: "8px 12px",
                    background: "#fff",
                    marginBottom: 16,
                  }}
                  onClick={(e) => e.stopPropagation()} // Prevent closing when clicking search
                >
                  <img src={searchIcon} alt="Search" width={20} height={20} />
                  <input
                    type="text"
                    placeholder={t('navbar.searchPlaceholder')}
                    value={citySearch}
                    onChange={(e) => setCitySearch(e.target.value)}
                    style={{
                      border: "none",
                      outline: "none",
                      fontFamily: "Inter, sans-serif",
                      fontSize: 14,
                      color: "#141414",
                      width: "100%",
                      background: "transparent",
                    }}
                  />
                </div>

                {/* City Options List */}
                <div style={{ display: "flex", flexDirection: "column", gap: 4, overflowY: "auto", flex: 1 }}>
                  {cities
                    .filter((c) => c.toLowerCase().includes(citySearch.toLowerCase()))
                    .map((option) => (
                      <div
                        key={option}
                        onClick={() => {
                          setCity(option);
                          setIsCityOpen(false);
                          setCitySearch(""); // Reset search on select
                        }}
                        style={{
                          padding: "10px 12px",
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          cursor: "pointer",
                          background: city === option ? "rgba(245, 246, 250, 1)" : "#fff",
                          borderRadius: 6,
                          transition: "background 0.2s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(245, 246, 250, 1)")}
                        onMouseLeave={(e) => {
                          if (city !== option) {
                            e.currentTarget.style.background = "#fff";
                          }
                        }}
                      >
                        <img src={addressIcon} alt="Address" width={20} height={20} />
                        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#141414" }}>
                          {option}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Service Details */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>
            {t('modal.serviceDetailsLabel')}<span style={{ color: "#EF4444" }}>*</span>
          </label>
          <textarea
            value={serviceDetails}
            onChange={(e) => setServiceDetails(e.target.value)}
            style={textareaStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>

        {/* Convert button */}
        <button
          onClick={handleConvert}
          disabled={!isConvertEnabled}
          style={{
            marginTop: "auto",
            alignSelf: "center",
            width: 422,
            height: 48,
            borderRadius: 12,
            border: "none",
            background: isConvertEnabled ? "rgba(0, 35, 111, 1)" : "rgba(212, 213, 216, 1)",
            color: isConvertEnabled ? "#fff" : "#9CA3AF",
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: 15,
            cursor: isConvertEnabled ? "pointer" : "not-allowed",
            transition: "background 0.2s, color 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "8px 24px",
            boxSizing: "border-box",
          }}
        >
          {isMutationLoading ? t('modal.converting') : t('modal.convertButton')}
        </button>
      </div>
    </div>
  );
};

export default Convert_to_deal;
