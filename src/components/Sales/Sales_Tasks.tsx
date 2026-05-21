import React, { useState } from "react";
import closeIcon from "../../assets/x-02.svg";
import checkSquareIcon from "../../assets/check-square-broken.svg";
import checkIcon from "../../assets/check-02.svg";
import starIcon from "../../assets/stars.svg";
import editIcon from "../../assets/edit-03.svg";
import bellIcon from "../../assets/bell-ringing-04.svg";
import calendarIcon from "../../assets/calendar-03.svg";
import infoIcon from "../../assets/information-circle-contained.svg";
import userProfileIcon from "../../assets/user-profile-02.svg";
import "../../styles/sales-modals-mobile.css";

interface SalesTasksProps {
  onClose?: () => void;
  onNewTask?: () => void;
  onEditTask?: (taskData: any) => void;
  salesName?: string;
}

const TaskCard = ({ onEdit, dueDateLabel, dueDateColor }: {
  onEdit?: (data: any) => void;
  dueDateLabel?: string;
  dueDateColor?: string;
}) => {
  const taskData = {
    title: "Call Mohamed Yasser for followup",
    relatedTo: "Lead",
    selectedLead: "Mohamed Yasser",
    description:
      "Lorem ipsum dolor sit amet consectetur. In lacus in odio faucibus pellentesque aliquam metus justo nulla. Sollicitudin est in eros ligula consectetur eu porttitor leo vel.",
    priority: "Low",
    dueDate: "2026-04-01",
    reminderDate: "2026-04-02",
  };

  return (
    <div
      style={{
        display: "flex",
        padding: 16,
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 16,
        alignSelf: "stretch",
        borderRadius: 12,
        background: "rgba(245, 246, 250, 1)",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src={starIcon} alt="Star" width={24} height={24} />
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              fontSize: 16,
              lineHeight: "100%",
              color: "rgba(70, 70, 70, 1)",
            }}
          >
            {taskData.title}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img
            onClick={() => onEdit?.(taskData)}
            src={editIcon}
            alt="Edit"
            width={24}
            height={24}
            style={{ cursor: "pointer" }}
          />
          <img src={checkIcon} alt="Complete" width={24} height={24} style={{ cursor: "pointer" }} />
        </div>
      </div>

      {/* Description */}
      <p
        style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 400,
          fontSize: 13,
          lineHeight: "140%",
          color: "rgba(70, 70, 70, 1)",
          margin: 0,
        }}
      >
        {taskData.description}
      </p>

      {/* Details */}
      <div
        className="st-card-details"
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px solid rgba(212, 213, 216, 1)",
          paddingTop: 12,
          paddingBottom: 12,
          width: "100%",
          boxSizing: "border-box",
        }}
      >
          <div className="st-card-left" style={{ display: "flex", flexDirection: "column", gap: 12, width: 216 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, height: 20 }}>
            <img src={userProfileIcon} alt="User" width={16} height={16} />
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 400, color: "#464646", lineHeight: "140%" }}>Lead Name:</span>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 400, color: "#141414", lineHeight: "140%" }}>{taskData.selectedLead}</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, height: 20 }}>
            <img src={userProfileIcon} alt="User" width={16} height={16} />
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 400, color: "#464646", lineHeight: "140%" }}>Assigned by:</span>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 400, color: "#141414", lineHeight: "140%" }}>Yasser Helmy</span>
            </div>
          </div>
        </div>

          <div className="st-card-right" style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1, paddingLeft: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, height: 20 }}>
            <img src={infoIcon} alt="Info" width={16} height={16} />
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 400, color: "#464646", lineHeight: "140%" }}>Priority:</span>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#141414" }} />
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 400, color: "#141414", lineHeight: "140%" }}>Low</span>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, height: 20 }}>
            <img src={calendarIcon} alt="Calendar" width={16} height={16} />
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 400, color: "#464646", lineHeight: "140%" }}>Due date:</span>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 400, color: dueDateColor ?? "#EF4444", lineHeight: "140%" }}>
                {dueDateLabel ?? "Yesterday"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Sales_Tasks: React.FC<SalesTasksProps> = ({ onClose, onNewTask, onEditTask, salesName = "Sales name" }) => {
  const [activeTab, setActiveTab] = useState("Today");
  const tabs = ["All", "Today", "Overdue", "Completed"];

  return (
    <div
      className="sales-tasks-container"
      style={{
        display: "flex",
        width: 521,
        height: 567,
        flexDirection: "column",
        alignItems: "flex-start",
        background: "rgba(255, 255, 255, 1)",
        borderRadius: 12,
        boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.12)",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* ── Header ── */}
      <div
        className="sales-tasks-header"
        style={{
          width: "100%",
          padding: "20px 24px 0 24px",
          boxSizing: "border-box",
          flexShrink: 0,
        }}
      >
        {/* Title row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img src={checkSquareIcon} alt="Tasks" width={24} height={24} />
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                fontSize: 19,
                color: "#141414",
                lineHeight: "normal",
              }}
            >
              Sales Tasks
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

        {/* Subtitle */}
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 16,
            fontWeight: 400,
            color: "var(--Foundation-neutral-neutral-800, #464646)",
            lineHeight: "normal",
            paddingLeft: 32,
            display: "block",
            marginBottom: 16,
          }}
        >
          for "{salesName}"
        </span>

        {/* Separator */}
        <div style={{ width: "100%", height: 1, background: "rgba(212, 213, 216, 1)", marginBottom: 0 }} />

        {/* Tabs */}
        <div
          className="sales-tasks-tabs"
          style={{
            display: "flex",
            width: "100%",
            height: 35,
            borderBottom: "1px solid rgba(212, 213, 216, 1)",
            boxSizing: "border-box",
          }}
        >
          {tabs.map((tab) => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                height: 35,
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                fontWeight: activeTab === tab ? 700 : 500,
                fontSize: 16,
                lineHeight: "100%",
                color: activeTab === tab ? "rgba(0, 35, 111, 1)" : "#4B5563",
                borderBottom: activeTab === tab ? "2px solid rgba(0, 35, 111, 1)" : "2px solid transparent",
                marginBottom: -1,
                transition: "color 0.2s, border-color 0.2s",
                boxSizing: "border-box",
              }}
            >
              {tab}
            </div>
          ))}
        </div>
      </div>

      {/* ── Task List ── */}
      <div
        className="sales-tasks-list"
        style={{
          flex: 1,
          width: "100%",
          padding: "16px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          overflowY: "auto",
          overflowX: "hidden",
          boxSizing: "border-box",
        }}
      >
        <TaskCard onEdit={(data) => onEditTask?.(data)} dueDateLabel="Yesterday" dueDateColor="#EF4444" />
        <TaskCard onEdit={(data) => onEditTask?.(data)} dueDateLabel="Today" dueDateColor="#00236F" />
      </div>

     
    </div>
  );
};

export default Sales_Tasks;
