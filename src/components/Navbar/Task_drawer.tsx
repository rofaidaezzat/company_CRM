import React, { useState } from "react";
import checkSquareIcon from "../../assets/check-square-broken.svg";
import checkIcon from "../../assets/check-02.svg";
import starIcon from "../../assets/stars.svg";
import editIcon from "../../assets/edit-03.svg";
import bellIcon from "../../assets/bell-ringing-04.svg";
import calendarIcon from "../../assets/calendar-03.svg";
import infoIcon from "../../assets/information-circle-contained.svg";
import userProfileIcon from "../../assets/user-profile-02.svg";
import "../../styles/task-drawer-mobile.css";

interface TaskDrawerProps {
  onClose?: () => void;
  onNewTask?: () => void;
  onEditTask?: (taskData: any) => void;
}

const TaskCard = ({ onEdit }: { onEdit?: (data: any) => void }) => {
  const taskData = {
    title: "Call Mohamed Yasser for followup",
    relatedTo: "Lead",
    selectedLead: "Mohammed Mahmoud",
    description: "Lorem ipsum dolor sit amet consectetur. In lacus in odio faucibus pellentesque aliquam metus justo nulla. Sollicitudin est in eros ligula consectetur eu porttitor leo vel.",
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
      <div className="task-card-header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", width: "100%" }}>
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
        <div className="task-card-header-actions" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img onClick={() => onEdit?.(taskData)} src={editIcon} alt="Edit" width={24} height={24} style={{ cursor: "pointer" }} />
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
        Lorem ipsum dolor sit amet consectetur. In lacus in odio faucibus pellentesque aliquam metus justo nulla. Sollicitudin est in eros ligula consectetur eu porttitor leo vel.
      </p>

      {/* Details Container */}
      <div className="task-card-details" style={{
        display: "flex",
        justifyContent: "space-between",
        borderTop: "1px solid rgba(212, 213, 216, 1)",
        paddingTop: 12,
        paddingBottom: 12,
        width: "100%",
        boxSizing: "border-box"
      }}>
        {/* The left */}
        <div className="task-card-details-left" style={{ display: "flex", flexDirection: "column", gap: 12, width: 216 }}>
          {/* Lead Name */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, height: 20 }}>
            <img src={userProfileIcon} alt="User" width={16} height={16} />
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 400, color: "#464646", lineHeight: "140%" }}>Lead Name:</span>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 400, color: "#141414", lineHeight: "140%" }}>{taskData.selectedLead}</span>
            </div>
          </div>
          {/* Assigned by */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, height: 20 }}>
            <img src={userProfileIcon} alt="User" width={16} height={16} />
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 400, color: "#464646", lineHeight: "140%" }}>Assigned by:</span>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 400, color: "#141414", lineHeight: "140%" }}>Yasser Helmy</span>
            </div>
          </div>
          {/* Reminder */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, height: 20 }}>
            <img src={bellIcon} alt="Bell" width={16} height={16} />
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 400, color: "#141414", lineHeight: "140%" }}>We will remind you at 2 Apr</span>
          </div>
        </div>

        {/* The right */}
        <div className="task-card-details-right" style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1, paddingLeft: 16 }}>
          {/* Priority */}
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
          {/* Due date */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, height: 20 }}>
            <img src={calendarIcon} alt="Calendar" width={16} height={16} />
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 400, color: "#464646", lineHeight: "140%" }}>Due date:</span>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 400, color: "#EF4444", lineHeight: "140%" }}>Yesterday</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Task_drawer: React.FC<TaskDrawerProps> = ({ onClose, onNewTask, onEditTask }) => {
  const [activeTab, setActiveTab] = useState("Today");
  const tabs = ["All", "Today", "Overdue", "Completed"];

  return (
    <div
      className="task-drawer-container"
      style={{
        width: 521,
        height: "100%",
        background: "rgba(255, 255, 255, 1)",
        boxShadow: "-1px 0px 4px 0px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        padding: "16px 24px",
        boxSizing: "border-box",
      }}
    >
      {/* ── Header ── */}
      <div style={{ padding: "16px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src={checkSquareIcon} alt="Tasks" width={24} height={24} />
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                fontSize: 20,
                color: "#141414",
              }}
            >
              Tasks
            </span>
          </div>
          <button 
            className="task-drawer-close-btn" 
            onClick={onClose}
            style={{ 
              background: "transparent", 
              border: "none", 
              cursor: "pointer", 
              padding: 4, 
              display: "none", // Hidden on desktop
              alignItems: "center", 
              justifyContent: "center" 
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#141414" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div
          className="task-drawer-tabs-wrapper"
          style={{
            display: "flex",
            width: 473,
            height: 35,
            borderBottom: "1px solid rgba(212, 213, 216, 1)",
          }}
        >
          {tabs.map((tab) => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="task-drawer-tab"
              style={{
                width: 118.25,
                height: 35,
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                fontWeight: activeTab === tab ? 700 : 500,
                fontSize: 16,
                lineHeight: "100%",
                color: activeTab === tab ? "rgba(0, 35, 111, 1)" : "#4B5563",
                borderBottom: activeTab === tab ? "1px solid rgba(0, 35, 111, 1)" : "1px solid transparent",
                marginBottom: -1, // Overlaps container border seamlessly
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
        className="task-drawer-list"
        style={{
          width: 470, // Includes space for scrollbar
          flex: 1,
          padding: "16px 0",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <TaskCard onEdit={(data) => onEditTask?.(data)} />
        <TaskCard onEdit={(data) => onEditTask?.(data)} />
        <TaskCard onEdit={(data) => onEditTask?.(data)} />
      </div>

      {/* ── Footer ── */}
      <div
        style={{
          padding: "24px 8px",
          background: "#fff",
          borderTop: "1px solid rgba(212, 213, 216, 0.5)",
          display: "flex",
          justifyContent: "center", // Center the button horizontally
        }}
      >
        <button
          onClick={() => onNewTask?.()}
          className="task-drawer-footer-btn"
          style={{
            background: "rgba(0, 35, 111, 1)",
            width: 505,
            height: 48,
            borderRadius: 12,
            border: "none",
            color: "#fff",
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: 16,
            padding: "8px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            cursor: "pointer",
            transition: "background 0.2s",
            boxSizing: "border-box",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M5 12H19" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          New Task
        </button>
      </div>
    </div>
  );
};

export default Task_drawer;
