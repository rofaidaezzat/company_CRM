import React, { useState, useEffect, useRef } from "react";
import { useGetLeadQuery, useUpdateLeadMutation } from "../../app/service/crudleads";
import { useGetSalesMembersQuery } from "../../app/service/crudsales";
import { toast } from "sonner";
import editIcon from "../../assets/edit-contained.svg";
import closeIcon from "../../assets/x-02.svg";
import calendarPlusIcon from "../../assets/calendar-plus.svg";
import "../../styles/leads-modal-mobile.css";
import { validateLead } from "../../validation";
import { useTranslation } from "../../context/LanguageContext";

interface EditLeadInfoProps {
  leadId?: string;
  initialData?: {
    id?: string;
    leadName?: string;
    companyName?: string;
    phoneNumber?: string;
    nextFollowup?: string;
  };
  leadsName?: string;
  onClose?: () => void;
  onSave?: () => void;
  slot?: string;
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

const labelStyle: React.CSSProperties = {
  fontFamily: "Inter, sans-serif",
  fontWeight: 500,
  fontSize: 13,
  color: "#141414",
  marginBottom: 6,
  display: "block",
};

const SOURCE_OPTIONS: { label: string; value: string }[] = [
  { label: "Organic",   value: "ORGANIC" },
  { label: "Referral",  value: "REFERRAL" },
  { label: "Ads",       value: "ADS" },
  { label: "Website",   value: "WEBSITE" },
  { label: "Farmer",    value: "FARMER" },
  { label: "Facebook",  value: "FACEBOOK" },
  { label: "TikTok",    value: "TIKTOK" },
  { label: "Instagram", value: "INSTAGRAM" },
  { label: "WhatsApp",  value: "WHATSAPP" },
  { label: "Telegram",  value: "TELEGRAM" },
  { label: "LinkedIn",  value: "LINKEDIN" },
  { label: "Twitter",   value: "TWITTER" },
  { label: "YouTube",   value: "YOUTUBE" },
  { label: "Other",     value: "OTHER" },
];

const Edit_lead_info: React.FC<EditLeadInfoProps> = ({
  leadId,
  initialData,
  leadsName,
  onClose,
  onSave,
  slot = "Modified",
}) => {
  const { t } = useTranslation();
  const effectiveLeadId = leadId || initialData?.id;
  const { data: leadResponse, isLoading: isGetLoading } = useGetLeadQuery(effectiveLeadId || "", { skip: !effectiveLeadId });
  const [updateLead, { isLoading: isUpdateLoading }] = useUpdateLeadMutation();
  const { data: salesMembersResponse } = useGetSalesMembersQuery();
  const salesMembers = salesMembersResponse?.data || [];

  const [leadName, setLeadName] = useState(initialData?.leadName || "");
  const [companyName, setCompanyName] = useState(initialData?.companyName || "");
  const [phoneNumber, setPhoneNumber] = useState(initialData?.phoneNumber || "");
  const [leadSource, setLeadSource] = useState("");
  const [nextFollowup, setNextFollowup] = useState(initialData?.nextFollowup || "");
  const [assignedToId, setAssignedToId] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAssignDropdownOpen, setIsAssignDropdownOpen] = useState(false);

  const dateInputRef = useRef<HTMLInputElement>(null);

  const getTodayDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleDatePickerClick = () => {
    try {
      dateInputRef.current?.showPicker();
    } catch (e) {
      console.warn("showPicker is not supported or failed", e);
    }
  };

  useEffect(() => {
    if (leadResponse?.data) {
      const lead = leadResponse.data;
      setLeadName(lead.name || "");
      setCompanyName(lead.company_name || "");
      setPhoneNumber(lead.phone || "");
      setLeadSource(lead.source || "");
      setAssignedToId(lead.assigned_to?.id || "");
      if (lead.next_follow_up) {
        setNextFollowup(lead.next_follow_up.substring(0, 10));
      } else {
        setNextFollowup("");
      }
    }
  }, [leadResponse]);

  const isSaveEnabled =
    leadName.trim() !== "" &&
    phoneNumber.trim() !== "" &&
    leadSource.trim() !== "" &&
    !isUpdateLoading &&
    !isGetLoading;

  const handleSave = async () => {
    if (isUpdateLoading || isGetLoading || !effectiveLeadId) return;
    
    // Perform robust backend-compatible validation
    const validation = validateLead({
      name: leadName,
      phone: phoneNumber,
      source: leadSource,
      next_follow_up: nextFollowup || null,
      assigned_to_id: assignedToId || null,
    });

    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      toast.error(firstError);
      return;
    }

    if (nextFollowup) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(nextFollowup);
      selectedDate.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        toast.error("Next follow-up date cannot be in the past");
        return;
      }
    }

    try {
      await updateLead({
        id: effectiveLeadId,
        body: {
          name: leadName,
          company_name: companyName,
          phone: phoneNumber,
          next_follow_up: nextFollowup || null,
          source: leadSource,
          assigned_to_id: assignedToId || null,
        },
      }).unwrap();

      toast.success("Lead updated successfully!");
      if (onSave) onSave();
      if (onClose) onClose();
    } catch (err: any) {
      console.error("Failed to update lead:", err);
      const errMsg = err?.data?.message || err?.message || "Failed to update lead.";
      toast.error(errMsg);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "#3B5BDB";
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "rgba(212, 213, 216, 1)";
  };

  /* Format ISO date → DD/MM/YYYY for display */
  const formatDate = (iso: string) => {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
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
        slot={slot}
        style={{
          width: 462,
          height: 91,
          background: "rgba(245, 246, 250, 1)",
          borderBottom: "1px solid rgba(212, 213, 216, 1)",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          padding: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          boxSizing: "border-box",
          flexShrink: 0,
        }}
      >
        {/* Left: icon + title + subtitle */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img src={editIcon} alt="Edit Lead Info" width={24} height={24} />
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                fontSize: 19,
                color: "#141414",
                lineHeight: "100%",
              }}
            >
              {t('modal.editLeadTitle')}
            </span>
          </div>
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              fontSize: 13,
              color: "#6B7280",
              lineHeight: "18px",
              paddingLeft: 2,
            }}
          >
            {t('modal.forLead')} &quot;{leadResponse?.data?.name || leadsName || t('modal.leadName')}&quot;
          </span>
        </div>

        {/* Close button */}
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
          height: 559,
          background: "rgba(245, 246, 250, 1)",
          borderBottomRightRadius: 12,
          borderBottomLeftRadius: 12,
          paddingTop: 24,
          paddingLeft: 20,
          paddingRight: 20,
          paddingBottom: 24,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {isGetLoading ? (
          <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif", color: "#6B7280" }}>
            {t('modal.loadingLeadInfo')}
          </div>
        ) : (
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              boxSizing: "border-box",
            }}
          >
            {/* Lead name */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={labelStyle}>
                {t('modal.leadName')}<span style={{ color: "var(--Foundation-brand-brand-500, #00236F)" }}>*</span>
              </label>
              <input
                type="text"
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                placeholder={t('modal.enterLeadName')}
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            {/* Company name */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={labelStyle}>
                {t('modal.companyName')}<span style={{ color: "var(--Foundation-brand-brand-500, #00236F)" }}>*</span>
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder={t('modal.enterCompanyName')}
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            {/* Phone number */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={labelStyle}>
                {t('modal.phoneNumberLabel')}<span style={{ color: "var(--Foundation-brand-brand-500, #00236F)" }}>*</span>
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder={t('modal.enterPhoneNumber')}
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            {/* Lead Source */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={labelStyle}>
                {t('modal.leadSource')}<span style={{ color: "var(--Foundation-brand-brand-500, #00236F)" }}>*</span>
              </label>
              <div style={{ position: "relative", width: "100%" }}>
                {/* Custom Select Box */}
                <div
                  onClick={() => {
                    setIsDropdownOpen(!isDropdownOpen);
                    setIsAssignDropdownOpen(false);
                  }}
                  style={{
                    ...inputStyle,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    color: leadSource ? "#141414" : "#6B7280",
                    cursor: "pointer",
                    userSelect: "none",
                    borderColor: "rgba(212, 213, 216, 1)",
                  }}
                >
                  <span>{SOURCE_OPTIONS.find(o => o.value === leadSource)?.label || t('modal.chooseSource')}</span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s",
                      flexShrink: 0,
                    }}
                  >
                    <path d="M6 9L12 15L18 9" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
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
                    {SOURCE_OPTIONS.map(({ label, value }) => (
                      <div
                        key={value}
                        onClick={() => {
                          setLeadSource(value);
                          setIsDropdownOpen(false);
                        }}
                        style={{
                          padding: "12px 16px",
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          cursor: "pointer",
                          background: leadSource === value ? "rgba(245, 246, 250, 1)" : "#fff",
                          transition: "background 0.2s",
                          boxSizing: "border-box",
                          width: "100%",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(245, 246, 250, 1)")}
                        onMouseLeave={(e) => {
                          if (leadSource !== value) {
                            e.currentTarget.style.background = "#fff";
                          }
                        }}
                      >
                        {/* Radio Button */}
                        <div
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: "50%",
                            border: leadSource === value ? "5px solid #00236F" : "2px solid #8B909A",
                            boxSizing: "border-box",
                            flexShrink: 0,
                            transition: "border 0.2s",
                          }}
                        />
                        <span
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: 14,
                            color: leadSource === value ? "#00236F" : "#141414",
                            fontWeight: leadSource === value ? 500 : 400,
                          }}
                        >
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Assign to */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={labelStyle}>
                Assign to
              </label>
              <div style={{ position: "relative", width: "100%" }}>
                {/* Custom Select Box */}
                <div
                  onClick={() => {
                    setIsAssignDropdownOpen(!isAssignDropdownOpen);
                    setIsDropdownOpen(false);
                  }}
                  style={{
                    ...inputStyle,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    color: assignedToId ? "#141414" : "#6B7280",
                    cursor: "pointer",
                    userSelect: "none",
                    borderColor: "rgba(212, 213, 216, 1)",
                  }}
                >
                  <span>
                    {salesMembers.find(m => m.id === assignedToId)
                      ? `${salesMembers.find(m => m.id === assignedToId)?.first_name} ${salesMembers.find(m => m.id === assignedToId)?.last_name}`
                      : "Select sales name"}
                  </span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      transform: isAssignDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s",
                      flexShrink: 0,
                    }}
                  >
                    <path d="M6 9L12 15L18 9" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                {/* Dropdown Menu */}
                {isAssignDropdownOpen && (
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
                    {/* Option for unassigned / Select sales name */}
                    <div
                      onClick={() => {
                        setAssignedToId("");
                        setIsAssignDropdownOpen(false);
                      }}
                      style={{
                        padding: "12px 16px",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        cursor: "pointer",
                        background: !assignedToId ? "rgba(245, 246, 250, 1)" : "#fff",
                        transition: "background 0.2s",
                        boxSizing: "border-box",
                        width: "100%",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(245, 246, 250, 1)")}
                      onMouseLeave={(e) => {
                        if (assignedToId) {
                          e.currentTarget.style.background = "#fff";
                        }
                      }}
                    >
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          border: !assignedToId ? "5px solid #00236F" : "2px solid #8B909A",
                          boxSizing: "border-box",
                          flexShrink: 0,
                          transition: "border 0.2s",
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: 14,
                          color: !assignedToId ? "#00236F" : "#141414",
                          fontWeight: !assignedToId ? 500 : 400,
                        }}
                      >
                        Select sales name
                      </span>
                    </div>

                    {salesMembers.map((member) => {
                      const fullName = `${member.first_name} ${member.last_name}`;
                      const isSelected = assignedToId === member.id;
                      return (
                        <div
                          key={member.id}
                          onClick={() => {
                            setAssignedToId(member.id);
                            setIsAssignDropdownOpen(false);
                          }}
                          style={{
                            padding: "12px 16px",
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            cursor: "pointer",
                            background: isSelected ? "rgba(245, 246, 250, 1)" : "#fff",
                            transition: "background 0.2s",
                            boxSizing: "border-box",
                            width: "100%",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(245, 246, 250, 1)")}
                          onMouseLeave={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.background = "#fff";
                            }
                          }}
                        >
                          <div
                            style={{
                              width: 18,
                              height: 18,
                              borderRadius: "50%",
                              border: isSelected ? "5px solid #00236F" : "2px solid #8B909A",
                              boxSizing: "border-box",
                              flexShrink: 0,
                              transition: "border 0.2s",
                            }}
                          />
                          <span
                            style={{
                              fontFamily: "Inter, sans-serif",
                              fontSize: 14,
                              color: isSelected ? "#00236F" : "#141414",
                              fontWeight: isSelected ? 500 : 400,
                            }}
                          >
                            {fullName}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Next followup */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={labelStyle}>
                {t('modal.nextFollowup')}<span style={{ color: "var(--Foundation-brand-brand-500, #00236F)" }}>*</span>
              </label>
              <div 
                onClick={handleDatePickerClick}
                style={{ position: "relative", width: "100%", cursor: "pointer" }}
              >
                {/* Display formatted date as read-only overlay */}
                <input
                  type="text"
                  readOnly
                  value={formatDate(nextFollowup)}
                  placeholder="DD/MM/YYYY"
                  style={{
                    ...inputStyle,
                    paddingRight: 48,
                    caretColor: "transparent",
                    cursor: "pointer",
                  }}
                />
                {/* Hidden date picker */}
                <input
                  ref={dateInputRef}
                  type="date"
                  value={nextFollowup}
                  min={getTodayDateString()}
                  onChange={(e) => setNextFollowup(e.target.value)}
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0,
                    cursor: "pointer",
                    width: "100%",
                    height: "100%",
                    zIndex: -1,
                  }}
                />
                {/* Calendar icon */}
                <img
                  src={calendarPlusIcon}
                  alt="Pick date"
                  width={22}
                  height={22}
                  style={{
                    position: "absolute",
                    right: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                  }}
                />
              </div>
            </div>

            {/* Save button */}
            <button
              onClick={handleSave}
              disabled={!isSaveEnabled}
              style={{
                marginTop: 40,
                alignSelf: "center",
                width: "100%",
                height: 48,
                borderRadius: 12,
                border: "none",
                background: isSaveEnabled
                  ? "rgba(0, 35, 111, 1)"
                  : "rgba(212, 213, 216, 1)",
                color: isSaveEnabled ? "#fff" : "#9CA3AF",
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                fontSize: 15,
                cursor: isSaveEnabled ? "pointer" : "not-allowed",
                transition: "background 0.2s, color 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                paddingTop: 8,
                paddingBottom: 8,
                paddingLeft: 24,
                paddingRight: 24,
                boxSizing: "border-box",
              }}
            >
              {isUpdateLoading ? t('modal.saving') : t('common.save')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Edit_lead_info;
