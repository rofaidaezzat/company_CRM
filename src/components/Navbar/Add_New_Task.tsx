import React, { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import "../../styles/task-modal-mobile.css";
import plusIcon from "../../assets/plus-02.svg";
import closeIcon from "../../assets/x-02.svg";
import calendarPlusIcon from "../../assets/calendar-plus.svg";
import { useCreateTaskMutation } from "../../app/service/crudtasks";
import { useGetLeadsQuery } from "../../app/service/crudleads";
import { toast } from "sonner";
import { validateTask } from "../../validation";
import { getCookie } from "../../app/service/baseQuery";


interface AddNewTaskProps {
  onClose?: () => void;
  onSave?: (data: any) => void;
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
  color: "#4B5563",
  marginBottom: 6,
  display: "block",
};

const errorTextStyle: React.CSSProperties = {
  fontFamily: "Cairo, sans-serif",
  fontSize: 14,
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "100%",
  color: "var(--Foundation-error-red-700, #A80D0B)",
  marginTop: 4,
  display: "flex",
  alignItems: "center",
  gap: 4,
};

const Add_New_Task: React.FC<AddNewTaskProps> = ({ onClose, onSave }) => {
  const errorIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="13.333" height="13.333" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <path d="M7.66667 5V7.66667M7.66667 10.3333H7.67333M14.3333 7.66667C14.3333 11.3486 11.3486 14.3333 7.66667 14.3333C3.98477 14.3333 1 11.3486 1 7.66667C1 3.98477 3.98477 1 7.66667 1C11.3486 1 14.3333 3.98477 14.3333 7.66667Z" stroke="var(--Foundation-error-red-700, #A80D0B)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  const isSalesManager = getCookie("user_type") === "SALES_MANAGER";

  const [title, setTitle] = useState("");
  const [relatedTo, setRelatedTo] = useState<"Lead" | "Deal">("Lead");
  const [selectedLead, setSelectedLead] = useState("");
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [isLeadDropdownOpen, setIsLeadDropdownOpen] = useState(false);
  const [leadSearchText, setLeadSearchText] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Assign to (Sales Manager only)
  const [selectedSalesName, setSelectedSalesName] = useState("");
  const [selectedSalesId, setSelectedSalesId] = useState("");
  const [isSalesDropdownOpen, setIsSalesDropdownOpen] = useState(false);
  const [salesSearchText, setSalesSearchText] = useState("");

  const { data: leadsResponse, isLoading: isLoadingLeads } = useGetLeadsQuery();
  const leads = leadsResponse?.data || [];
  const filteredLeads = leads.filter((lead) =>
    lead.name.toLowerCase().includes(leadSearchText.toLowerCase())
  );

  const isLoadingSales = false;
  const salesMembers = [
    { id: "1", first_name: "Yasser", last_name: "Abdelhameed", email: "yasser@architectcrm.com" },
    { id: "2", first_name: "Ahmed", last_name: "Galaal", email: "ahmedgalaal@architectcrm.com" },
  ];
  const filteredSales = salesMembers.filter((s) =>
    `${s.first_name} ${s.last_name}`.toLowerCase().includes(salesSearchText.toLowerCase())
  );

  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High" | "">("" );
  const [dueDate, setDueDate] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createTask] = useCreateTaskMutation();

  const isSaveEnabled =
    title.trim() !== "" &&
    description.trim() !== "" &&
    priority !== "" &&
    dueDate.trim() !== "";

  const handleSave = async () => {
    if (isSubmitting) return;
    
    // Perform robust backend-compatible validation
    const validation = validateTask({
      title,
      description,
      due_date: dueDate || undefined,
      lead_id: selectedLeadId || undefined,
    });

    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const priorityMap: Record<string, "LOW" | "MEDIUM" | "HIGH"> = {
        Low: "LOW", Medium: "MEDIUM", High: "HIGH",
      };
      await createTask({
        title: title.trim(),
        description: description.trim(),
        lead_id: selectedLeadId || undefined,
        sales_id: isSalesManager && selectedSalesId ? selectedSalesId : undefined,
        due_date: new Date(dueDate).toISOString(),
        reminder_at: reminderDate ? new Date(reminderDate).toISOString() : undefined,
        priority: priorityMap[priority as string] ?? "MEDIUM",
      }).unwrap();
      onSave?.({ title, relatedTo, selectedLead, description, priority, dueDate, reminderDate });
      onClose?.();
    } catch (err: any) {
      console.error("Failed to create task:", err);
      let errMsg = err?.data?.message || err?.message || "Failed to create task.";
      if (Array.isArray(errMsg)) {
        errMsg = errMsg.join(", ");
      }
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "#3B5BDB";
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "rgba(212, 213, 216, 1)";
  };

  const formatDate = (iso: string) => {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
  };

  return (
    <div
      className="task-modal-container"
      style={{
        display: "flex",
        width: 462,
        height: 824,
        flexDirection: "column",
        alignItems: "flex-start",
        background: "rgba(245, 246, 250, 1)",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.12)",
        position: "relative",
      }}
    >
      {/* ── Header ── */}
      <div
        className="task-modal-header"
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
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img src={plusIcon} alt="Add New Task" width={24} height={24} />
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              fontSize: 16,
              color: "#141414",
              lineHeight: "24px",
            }}
          >
            Add New Task
          </span>
        </div>
        <button
          onClick={onClose}
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
        className="task-modal-body"
        style={{
          width: 462,
          height: 748,
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
        }}
      >
        {/* Form Container */}
        <div
          className="task-modal-form"
          style={{
            width: 422,
            height: 600,
            marginTop: 32,
            marginLeft: 20,
            display: "flex",
            flexDirection: "column",
            gap: 16,
            boxSizing: "border-box",
          }}
        >
          {/* Title */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={labelStyle}>
              Title<span style={{ color: "#00236F" }}>*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setFormErrors((prev) => ({ ...prev, title: undefined }));
              }}
              style={{ ...inputStyle, borderColor: formErrors.title ? "#E03131" : undefined }}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            {formErrors.title && <span style={errorTextStyle}>{errorIcon}{formErrors.title}</span>}
          </div>

          {/* Assign To */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={labelStyle}>Assign to</label>
              <div style={{ position: "relative", width: "100%" }}>
                <div
                  onClick={() => setIsSalesDropdownOpen(!isSalesDropdownOpen)}
                  style={{
                    ...inputStyle,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ color: selectedSalesName ? "#141414" : "#9CA3AF" }}>
                    {selectedSalesName || "Select sales name"}
                  </span>
                  <ChevronDown size={16} color="#6B7280" />
                </div>
                {isSalesDropdownOpen && (
                  <div
                    className="task-modal-dropdown"
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      marginTop: 4,
                      width: 425,
                      height: 280,
                      background: "rgba(255, 255, 255, 1)",
                      borderRadius: 12,
                      boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.17)",
                      padding: 12,
                      display: "flex",
                      flexDirection: "column",
                      gap: 16,
                      zIndex: 100,
                      boxSizing: "border-box",
                    }}
                  >
                    {/* Search */}
                    <div className="task-modal-dropdown-inner" style={{ position: "relative", width: 401, height: 40, flexShrink: 0 }}>
                      <Search size={18} color="#9CA3AF" style={{ position: "absolute", left: 12, top: 11 }} />
                      <input
                        type="text"
                        placeholder="Search by sales name"
                        value={salesSearchText}
                        onChange={(e) => setSalesSearchText(e.target.value)}
                        style={{
                          width: "100%",
                          height: "100%",
                          border: "1px solid rgba(212, 213, 216, 1)",
                          borderRadius: 12,
                          padding: "8px 12px 8px 38px",
                          fontFamily: "Inter, sans-serif",
                          fontSize: 14,
                          outline: "none",
                          boxSizing: "border-box",
                          background: "transparent",
                          color: "#141414",
                        }}
                      />
                    </div>
                    {/* List */}
                    <div
                      className="task-modal-dropdown-inner"
                      style={{
                        width: 401,
                        flex: 1,
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                      }}
                    >
                      {isLoadingSales ? (
                        <div style={{ padding: "12px", textAlign: "center", color: "#6B7280", fontFamily: "Inter, sans-serif", fontSize: 13 }}>
                          Loading...
                        </div>
                      ) : filteredSales.length === 0 ? (
                        <div style={{ padding: "12px", textAlign: "center", color: "#6B7280", fontFamily: "Inter, sans-serif", fontSize: 13 }}>
                          No sales members found
                        </div>
                      ) : (
                        filteredSales.map((member) => {
                          const fullName = `${member.first_name} ${member.last_name}`;
                          const isSelected = selectedSalesId === member.id;
                          return (
                            <div
                              key={member.id}
                              onClick={() => {
                                setSelectedSalesName(fullName);
                                setSelectedSalesId(member.id);
                                setIsSalesDropdownOpen(false);
                                setSalesSearchText("");
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--Foundation-brand-brand-50, #E6E9F1)")}
                              onMouseLeave={(e) => (e.currentTarget.style.background = isSelected ? "var(--Foundation-brand-brand-50, #E6E9F1)" : "transparent")}
                              style={{
                                display: "flex",
                                padding: 8,
                                alignItems: "center",
                                gap: 8,
                                background: isSelected ? "var(--Foundation-brand-brand-50, #E6E9F1)" : "transparent",
                                cursor: "pointer",
                                borderRadius: 8,
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                                <path d="M1 19.1124C1 15.3369 4.15429 12.2762 10.6 12.2762C17.0457 12.2762 20.2 15.3369 20.2 19.1124C20.2 19.7131 19.7618 20.2 19.2212 20.2H1.97882C1.43823 20.2 1 19.7131 1 19.1124Z" stroke="#464646" strokeWidth="2"/>
                                <path d="M14.2 4.6C14.2 6.58822 12.5882 8.2 10.6 8.2C8.61177 8.2 7 6.58822 7 4.6C7 2.61177 8.61177 1 10.6 1C12.5882 1 14.2 2.61177 14.2 4.6Z" stroke="#464646" strokeWidth="2"/>
                              </svg>
                              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#141414", fontWeight: 400 }}>{fullName}</span>
                                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#6B7280", marginTop: -2 }}>{member.email}</span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

          {/* Related To */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={labelStyle}>Related to</label>
            <div style={{ position: "relative", width: "100%" }}>
              <div
                onClick={() => setIsLeadDropdownOpen(!isLeadDropdownOpen)}
                style={{
                  ...inputStyle,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderColor: formErrors.lead_id ? "#E03131" : undefined,
                }}
              >
                <span style={{ color: selectedLead ? "#141414" : "#9CA3AF" }}>
                  {selectedLead || "Select lead"}
                </span>
                <ChevronDown size={16} color="#6B7280" />
              </div>
              {isLeadDropdownOpen && (
                <div
                  className="task-modal-dropdown"
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    marginTop: 4,
                    width: 425,
                    height: 340,
                    background: "rgba(255, 255, 255, 1)",
                    borderRadius: 12,
                    boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.17)",
                    padding: 12,
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                    zIndex: 100,
                    boxSizing: "border-box"
                  }}
                >
                  <div className="task-modal-dropdown-inner" style={{ position: "relative", width: 401, height: 40, flexShrink: 0 }}>
                    <Search size={18} color="#9CA3AF" style={{ position: "absolute", left: 12, top: 11 }} />
                    <input
                      type="text"
                      placeholder="Search by lead name"
                      value={leadSearchText}
                      onChange={(e) => setLeadSearchText(e.target.value)}
                      style={{
                        width: "100%",
                        height: "100%",
                        border: "1px solid rgba(212, 213, 216, 1)",
                        borderRadius: 12,
                        padding: "8px 12px 8px 38px",
                        fontFamily: "Inter, sans-serif",
                        fontSize: 14,
                        outline: "none",
                        boxSizing: "border-box",
                        background: "transparent",
                        color: "#141414"
                      }}
                    />
                  </div>
                  <div
                    className="task-modal-dropdown-inner"
                    style={{
                      width: 401,
                      height: 260,
                      overflowY: "auto",
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                    }}
                  >
                    {isLoadingLeads ? (
                      <div style={{ padding: "12px", textAlign: "center", color: "#6B7280", fontFamily: "Inter, sans-serif", fontSize: 13 }}>
                        Loading leads...
                      </div>
                    ) : (
                      <>
                        {filteredLeads.map((lead) => (
                          <div
                            key={lead.id}
                            onClick={() => {
                              setSelectedLead(lead.name);
                              setSelectedLeadId(lead.id);
                              setIsLeadDropdownOpen(false);
                              setFormErrors((prev) => ({ ...prev, lead_id: undefined }));
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--Foundation-brand-brand-50, #E6E9F1)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = selectedLead === lead.name ? "var(--Foundation-brand-brand-50, #E6E9F1)" : "transparent")}
                            style={{
                              display: "flex",
                              padding: 8,
                              alignItems: "center",
                              gap: 8,
                              background: selectedLead === lead.name ? "var(--Foundation-brand-brand-50, #E6E9F1)" : "transparent",
                              cursor: "pointer",
                              borderRadius: 8,
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                              <path d="M1 19.1124C1 15.3369 4.15429 12.2762 10.6 12.2762C17.0457 12.2762 20.2 15.3369 20.2 19.1124C20.2 19.7131 19.7618 20.2 19.2212 20.2H1.97882C1.43823 20.2 1 19.7131 1 19.1124Z" stroke="#464646" strokeWidth="2"/>
                              <path d="M14.2 4.6C14.2 6.58822 12.5882 8.2 10.6 8.2C8.61177 8.2 7 6.58822 7 4.6C7 2.61177 8.61177 1 10.6 1C12.5882 1 14.2 2.61177 14.2 4.6Z" stroke="#464646" strokeWidth="2"/>
                            </svg>
                            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#141414", fontWeight: 400 }}>{lead.name}</span>
                              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#6B7280", marginTop: -2 }}>{lead.phone}</span>
                            </div>
                          </div>
                        ))}
                        {(!leadSearchText || "none".includes(leadSearchText.toLowerCase())) && (
                          <div
                            onClick={() => {
                              setSelectedLead("None");
                              setSelectedLeadId("");
                              setIsLeadDropdownOpen(false);
                              setFormErrors((prev) => ({ ...prev, lead_id: undefined }));
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--Foundation-brand-brand-50, #E6E9F1)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = selectedLead === "None" ? "var(--Foundation-brand-brand-50, #E6E9F1)" : "transparent")}
                            style={{
                              display: "flex",
                              padding: 8,
                              alignItems: "center",
                              gap: 8,
                              background: selectedLead === "None" ? "var(--Foundation-brand-brand-50, #E6E9F1)" : "transparent",
                              cursor: "pointer",
                              borderRadius: 8,
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#464646" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"></circle>
                              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                            </svg>
                            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#141414", fontWeight: 400 }}>None</span>
                            </div>
                          </div>
                        )}
                        {filteredLeads.length === 0 && leadSearchText && !"none".includes(leadSearchText.toLowerCase()) && (
                          <div style={{ padding: "12px", textAlign: "center", color: "#6B7280", fontFamily: "Inter, sans-serif", fontSize: 13 }}>
                            No leads found
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
            {formErrors.lead_id && <span style={errorTextStyle}>{errorIcon}{formErrors.lead_id}</span>}
          </div>

          {/* Description */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={labelStyle}>
              Description<span style={{ color: "#00236F" }}>*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setFormErrors((prev) => ({ ...prev, description: undefined }));
              }}
              style={{ ...textareaStyle, borderColor: formErrors.description ? "#E03131" : undefined }}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            {formErrors.description && <span style={errorTextStyle}>{errorIcon}{formErrors.description}</span>}
          </div>

          {/* Priority */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={labelStyle}>
              Priority<span style={{ color: "#00236F" }}>*</span>
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              {["Low", "Medium", "High"].map((p) => {
                const isSelected = priority === p;
                return (
                  <button
                    key={p}
                    onClick={() => setPriority(p as any)}
                    style={{
                      background: isSelected ? "rgba(0, 35, 111, 0.08)" : "transparent",
                      border: `1px solid ${isSelected ? "rgba(0, 35, 111, 1)" : "rgba(212, 213, 216, 1)"}`,
                      borderRadius: 12,
                      padding: "6px 16px",
                      fontFamily: "Inter, sans-serif",
                      fontSize: 13,
                      fontWeight: 500,
                      color: isSelected ? "rgba(0, 35, 111, 1)" : "#4B5563",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Due date */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={labelStyle}>
              Due date<span style={{ color: "#00236F" }}>*</span>
            </label>
            <div style={{ position: "relative", width: "100%" }}>
              <input
                type="text"
                readOnly
                value={formatDate(dueDate)}
                placeholder="dd/mm/yyyy"
                style={{
                  ...inputStyle,
                  color: dueDate ? "#141414" : "#9CA3AF",
                  paddingRight: 48,
                  caretColor: "transparent",
                  cursor: "pointer",
                  borderColor: formErrors.due_date ? "#E03131" : undefined,
                }}
              />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => {
                  setDueDate(e.target.value);
                  setFormErrors((prev) => ({ ...prev, due_date: undefined }));
                }}
                onClick={(e) => {
                  try {
                    e.currentTarget.showPicker();
                  } catch (err) {
                    console.warn("showPicker not supported", err);
                  }
                }}
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0,
                  cursor: "pointer",
                  width: "100%",
                  height: "100%",
                }}
              />
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
            {formErrors.due_date && <span style={errorTextStyle}>{errorIcon}{formErrors.due_date}</span>}
          </div>

          {/* Reminder date */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={labelStyle}>Reminder date</label>
            <div style={{ position: "relative", width: "100%" }}>
              <input
                type="text"
                readOnly
                value={formatDate(reminderDate)}
                placeholder="dd/mm/yyyy"
                style={{
                  ...inputStyle,
                  color: reminderDate ? "#141414" : "#9CA3AF",
                  paddingRight: 48,
                  caretColor: "transparent",
                  cursor: "pointer",
                }}
              />
              <input
                type="date"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
                onClick={(e) => {
                  try {
                    e.currentTarget.showPicker();
                  } catch (err) {
                    console.warn("showPicker not supported", err);
                  }
                }}
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0,
                  cursor: "pointer",
                  width: "100%",
                  height: "100%",
                }}
              />
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
        </div>

        {/* ── Footer ── */}
        <div
          className="task-modal-footer"
          style={{
            position: "absolute",
            bottom: 0,
            width: 462,
            height: 76,
            background: "rgba(245, 246, 250, 1)",
            borderBottomRightRadius: 12,
            borderBottomLeftRadius: 12,
            display: "flex",
            alignItems: "center",
            padding: "8px 20px",
            boxSizing: "border-box",
          }}
        >
          <button
            className="task-modal-footer-btn"
            onClick={handleSave}
            disabled={!isSaveEnabled || isSubmitting}
            style={{
              width: 422,
              height: 48,
              borderRadius: 12,
              padding: "8px 24px",
              gap: 8,
              border: "none",
              background: isSaveEnabled ? "rgba(0, 35, 111, 1)" : "rgba(212, 213, 216, 1)",
              color: isSaveEnabled ? "#fff" : "#9CA3AF",
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: 15,
              cursor: isSaveEnabled ? "pointer" : "not-allowed",
              transition: "background 0.2s, color 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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

export default Add_New_Task;
