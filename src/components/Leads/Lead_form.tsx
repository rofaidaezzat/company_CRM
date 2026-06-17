import React, { useState, useEffect } from "react";
import filePlusIcon from "../../assets/file-plus-01.svg";
import closeIcon from "../../assets/x-02.svg";
import "../../styles/leads-modal-mobile.css";
import {
  useGetLeadResponsesQuery,
  useSubmitLeadResponsesMutation,
} from "../../app/service/crudQuestions";

interface LeadFormProps {
  leadId: string;
  leadsName?: string;
  onClose?: () => void;
  onSave?: (data: Record<string, string>) => void;
  slot?: string;
}

const Lead_form: React.FC<LeadFormProps> = ({
  leadId,
  leadsName = "leads name",
  onClose,
  onSave,
  slot = "Modified",
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSaved, setIsSaved] = useState(false);

  // Fetch lead responses (returns all active questions + existing answers)
  const { data: responsesData, isLoading } = useGetLeadResponsesQuery(leadId, {
    skip: !leadId,
    refetchOnMountOrArgChange: true,
  });

  const [submitResponses, { isLoading: isSubmitting }] = useSubmitLeadResponsesMutation();

  const responsesList = responsesData?.data ?? [];

  // Populate local answers state when API response loads
  useEffect(() => {
    if (responsesData?.data) {
      const initialAnswers: Record<string, string> = {};
      let hasAnswers = false;
      responsesData.data.forEach((item) => {
        initialAnswers[item.question_id] = item.answer || "";
        if (item.answer !== null) {
          hasAnswers = true;
        }
      });
      setAnswers(initialAnswers);
      if (hasAnswers) {
        setIsSaved(true);
      }
    }
  }, [responsesData]);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // Determine if save is allowed (all required questions must be answered)
  const isSaveEnabled =
    responsesList.length > 0 &&
    responsesList.every((item) => {
      if (!item.question.is_required) return true;
      const answerVal = answers[item.question_id] || "";
      return answerVal.trim() !== "";
    });

  // Styles
  const savedTextareaStyle: React.CSSProperties = {
    width: "100%",
    height: 85,
    resize: "none",
    border: "none",
    borderRadius: 8,
    padding: 12,
    fontFamily: "Inter, sans-serif",
    fontSize: 14,
    color: "#141414",
    background: "rgba(212, 213, 216, 1)",
    outline: "none",
    boxSizing: "border-box",
    transition: "all 0.25s ease",
    cursor: "default",
  };

  const defaultTextareaStyle: React.CSSProperties = {
    width: "100%",
    height: 85,
    resize: "none",
    border: "1px solid rgba(0, 35, 111, 1)",
    borderRadius: 8,
    padding: "12px",
    fontFamily: "Inter, sans-serif",
    fontSize: 14,
    color: "#141414",
    background: "transparent",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s, background 0.25s, height 0.25s",
  };

  const defaultInputStyle: React.CSSProperties = {
    width: "100%",
    height: 42,
    border: "1px solid rgba(0, 35, 111, 1)",
    borderRadius: 8,
    paddingLeft: 12,
    paddingRight: 12,
    fontFamily: "Inter, sans-serif",
    fontSize: 14,
    color: "#141414",
    background: "transparent",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s, background 0.25s",
  };

  const savedInputStyle: React.CSSProperties = {
    width: "100%",
    height: 42,
    border: "none",
    borderRadius: 8,
    paddingLeft: 12,
    paddingRight: 12,
    fontFamily: "Inter, sans-serif",
    fontSize: 14,
    color: "#141414",
    background: "rgba(212, 213, 216, 1)",
    outline: "none",
    boxSizing: "border-box",
    cursor: "default",
  };

  const defaultSelectStyle: React.CSSProperties = {
    width: "100%",
    height: 42,
    border: "1px solid rgba(0, 35, 111, 1)",
    borderRadius: 8,
    paddingLeft: 12,
    paddingRight: 12,
    fontFamily: "Inter, sans-serif",
    fontSize: 14,
    color: "#141414",
    background: "transparent",
    outline: "none",
    boxSizing: "border-box",
    cursor: "pointer",
  };

  const savedSelectStyle: React.CSSProperties = {
    width: "100%",
    height: 42,
    border: "none",
    borderRadius: 8,
    paddingLeft: 12,
    paddingRight: 12,
    fontFamily: "Inter, sans-serif",
    fontSize: 14,
    color: "#141414",
    background: "rgba(212, 213, 216, 1)",
    outline: "none",
    boxSizing: "border-box",
    cursor: "default",
  };

  const handleSave = async () => {
    if (!leadId) return;
    try {
      const responsesPayload = Object.entries(answers).map(([question_id, answer]) => ({
        question_id,
        answer: answer.trim(),
      }));
      await submitResponses({
        lead_id: leadId,
        responses: responsesPayload,
      }).unwrap();
      setIsSaved(true);
      if (onSave) {
        onSave(answers);
      }
    } catch (err) {
      console.error("Failed to submit lead responses:", err);
    }
  };

  const sortedResponses = [...responsesList].sort((a, b) => a.question.order - b.question.order);

  // Render specific input controls based on question type
  const renderQuestionInput = (q: any, val: string) => {
    const type = q.question_type;

    if (type === "BOOLEAN") {
      return (
        <select
          value={val}
          onChange={(e) => handleAnswerChange(q.id, e.target.value)}
          disabled={isSaved}
          style={isSaved ? savedSelectStyle : defaultSelectStyle}
        >
          <option value="" disabled hidden>Select Yes / No</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      );
    }

    if (type === "SINGLE_CHOICE") {
      return (
        <select
          value={val}
          onChange={(e) => handleAnswerChange(q.id, e.target.value)}
          disabled={isSaved}
          style={isSaved ? savedSelectStyle : defaultSelectStyle}
        >
          <option value="" disabled hidden>Select an option</option>
          {q.options?.map((opt: string) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      );
    }

    if (type === "MULTIPLE_CHOICE") {
      const selectedOptions = val ? val.split(", ").map(s => s.trim()) : [];
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%", paddingLeft: 4 }}>
          {q.options?.map((opt: string) => {
            const isChecked = selectedOptions.includes(opt);
            const handleCheckboxChange = (checked: boolean) => {
              let newSelected = [...selectedOptions];
              if (checked) {
                newSelected.push(opt);
              } else {
                newSelected = newSelected.filter(item => item !== opt);
              }
              handleAnswerChange(q.id, newSelected.join(", "));
            };
            return (
              <label
                key={opt}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 14,
                  fontFamily: "Inter, sans-serif",
                  color: "#141414",
                  cursor: isSaved ? "default" : "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  disabled={isSaved}
                  onChange={(e) => handleCheckboxChange(e.target.checked)}
                  style={{
                    width: 16,
                    height: 16,
                    accentColor: "rgba(0, 35, 111, 1)",
                    cursor: isSaved ? "default" : "pointer",
                  }}
                />
                {opt}
              </label>
            );
          })}
        </div>
      );
    }

    if (type === "NUMBER") {
      return (
        <input
          type="text"
          value={val}
          onChange={(e) => {
            const value = e.target.value;
            // Only allow digits / decimals
            if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
              handleAnswerChange(q.id, value);
            }
          }}
          readOnly={isSaved}
          placeholder="Enter number (e.g. 123)"
          style={isSaved ? savedInputStyle : defaultInputStyle}
          onFocus={(e) => { if (!isSaved) e.currentTarget.style.borderColor = "#3B5BDB"; }}
          onBlur={(e) => { if (!isSaved) e.currentTarget.style.borderColor = "rgba(0, 35, 111, 1)"; }}
        />
      );
    }

    // Default TEXT
    return (
      <textarea
        value={val}
        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
        readOnly={isSaved}
        placeholder="Input text"
        style={isSaved ? savedTextareaStyle : defaultTextareaStyle}
        onFocus={(e) => { if (!isSaved) e.currentTarget.style.borderColor = "#3B5BDB"; }}
        onBlur={(e) => { if (!isSaved) e.currentTarget.style.borderColor = "rgba(0, 35, 111, 1)"; }}
      />
    );
  };

  return (
    <div
      className="leads-modal-root"
      style={{
        width: 462,
        maxHeight: 607,
        height: "auto",
        opacity: 1,
        display: "flex",
        flexDirection: "column",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.12)",
      }}
    >
      {/* Header */}
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
        }}
      >
        {/* Left: icon + title + subtitle */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img
              src={filePlusIcon}
              alt="Lead Form Icon"
              width={24}
              height={24}
            />
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                fontSize: 19,
                color: "#141414",
                lineHeight: "100%",
              }}
            >
              Lead Form
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
            for &quot;{leadsName}&quot;
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

      {/* Form Body */}
      <div
        className="leads-modal-body"
        style={{
          width: 462,
          flex: 1,
          background: "rgba(245, 246, 250, 1)",
          borderBottomRightRadius: 12,
          borderBottomLeftRadius: 12,
          paddingTop: 32,
          paddingLeft: 20,
          paddingRight: 20,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {isLoading ? (
          <div
            className="leads-modal-inner"
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <style>{`
              @keyframes skeletonPulse {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
              }
              .skeleton-bar {
                background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 50%, #f2f2f2 75%);
                background-size: 200% 100%;
                animation: skeletonPulse 1.5s infinite ease-in-out;
                border-radius: 6px;
              }
            `}</style>

            {/* Slot 1 */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
              <div className="skeleton-bar" style={{ width: 140, height: 16 }} />
              <div className="skeleton-bar" style={{ width: "100%", height: 42 }} />
            </div>

            {/* Slot 2 */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
              <div className="skeleton-bar" style={{ width: 110, height: 16 }} />
              <div className="skeleton-bar" style={{ width: "100%", height: 42 }} />
            </div>

            {/* Slot 3 */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
              <div className="skeleton-bar" style={{ width: 160, height: 16 }} />
              <div className="skeleton-bar" style={{ width: "100%", height: 42 }} />
            </div>
          </div>
        ) : sortedResponses.length === 0 ? (
          <div style={{ fontFamily: "Inter, sans-serif", color: "#6B7280", fontSize: 14, margin: "auto" }}>
            No questions available for this lead.
          </div>
        ) : (
          <div
            className="leads-modal-inner"
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              maxHeight: "340px",
              overflowY: "auto",
              paddingRight: "6px",
            }}
          >
            {sortedResponses.map((item) => {
              const q = item.question;
              const val = answers[q.id] || "";
              return (
                <div key={q.id} style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
                  <label
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 500,
                      fontSize: 13,
                      color: "#141414",
                    }}
                  >
                    {q.question_text}
                    {q.is_required && <span style={{ color: "rgba(0, 35, 111, 1)" }}>*</span>}
                  </label>
                  {renderQuestionInput(q, val)}
                </div>
              );
            })}
          </div>
        )}

        {/* Save / Edit Button */}
        {sortedResponses.length > 0 && (
          !isSaved ? (
            <button
              className="leads-modal-footer-btn"
              onClick={handleSave}
              disabled={!isSaveEnabled || isSubmitting}
              style={{
                marginTop: 40,
                marginBottom: 24,
                alignSelf: "center",
                width: "100%",
                height: 48,
                borderRadius: 12,
                border: "none",
                background: isSaveEnabled && !isSubmitting
                  ? "rgba(0, 35, 111, 1)"
                  : "rgba(212, 213, 216, 1)",
                color: isSaveEnabled && !isSubmitting ? "#fff" : "#9CA3AF",
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                fontSize: 15,
                cursor: isSaveEnabled && !isSubmitting ? "pointer" : "not-allowed",
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
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          ) : (
            <button
              className="leads-modal-footer-btn"
              onClick={() => setIsSaved(false)}
              style={{
                marginTop: 40,
                marginBottom: 24,
                alignSelf: "center",
                width: "100%",
                height: 48,
                borderRadius: 12,
                border: "1.5px solid rgba(0, 35, 111, 1)",
                background: "#fff",
                color: "rgba(0, 35, 111, 1)",
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                fontSize: 15,
                cursor: "pointer",
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
              {/* Pencil icon */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
                  stroke="rgba(0, 35, 111, 1)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.43741 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z"
                  stroke="rgba(0, 35, 111, 1)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Edit
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default Lead_form;
