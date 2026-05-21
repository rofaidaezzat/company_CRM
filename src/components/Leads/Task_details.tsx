import React from 'react';
import closeIcon from '../../assets/x-02.svg';
import calendarIcon from '../../assets/calendar-03.svg';
import editIcon from '../../assets/edit-03.svg';
import infoIcon from '../../assets/information-circle-contained.svg';
import userIcon from '../../assets/user-profile-02.svg';
import bellIcon from '../../assets/bell-ringing-04.svg';

const Task_details = () => {
  return (
    <div
      style={{
        background: "rgba(245, 246, 250, 1)",
        width: 375,
        height: 382,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          width: 375,
          height: 56,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: 8,
          paddingRight: 16,
          paddingBottom: 8,
          paddingLeft: 16,
          borderBottom: "1px solid rgba(216, 216, 216, 1)",
          boxSizing: "border-box",
        }}
      >
        <span style={{ fontSize: 18, fontWeight: 600, color: "#141414" }}>
          Task title
        </span>
        <img src={closeIcon} alt="close" width={24} height={24} style={{ cursor: "pointer" }} />
      </div>

      {/* ── Content ── */}
      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
        
        {/* Description */}
        <div style={{ fontSize: 14, color: "#4B5563", lineHeight: "140%", paddingBottom: 16, borderBottom: "1px solid rgba(216, 216, 216, 1)" }}>
          Lorem ipsum dolor sit amet Malesuada duis id orci
          pretium sit et laoreet nisl vulputate. Pretium elementum
          accumsan eu accumsan elit lectus.
        </div>

        {/* Details Grid */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          
          {/* Left Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            
            {/* Lead Name */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <img src={userIcon} alt="user" width={20} height={20} />
                <span style={{ fontSize: 14, color: "#6B7280" }}>Lead Name:</span>
              </div>
              <span style={{ fontSize: 14, color: "#141414", paddingLeft: 28 }}>
                Mohammed Mahmoud
              </span>
            </div>

            {/* Assigned By */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <img src={userIcon} alt="user" width={20} height={20} />
                <span style={{ fontSize: 14, color: "#6B7280" }}>Assigned by:</span>
              </div>
              <span style={{ fontSize: 14, color: "#141414", paddingLeft: 28 }}>
                Yasser Helmy
              </span>
            </div>
            
          </div>

          {/* Right Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            
            {/* Priority */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <img src={infoIcon} alt="info" width={20} height={20} />
                <span style={{ fontSize: 14, color: "#6B7280" }}>Priority</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, paddingLeft: 28 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6B7280" }} />
                <span style={{ fontSize: 14, color: "#4B5563" }}>Low</span>
              </div>
            </div>

            {/* Due Date */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <img src={calendarIcon} alt="calendar" width={20} height={20} />
                <span style={{ fontSize: 14, color: "#6B7280" }}>Due date</span>
              </div>
              <span style={{ fontSize: 14, color: "rgba(220, 38, 38, 1)", paddingLeft: 28 }}>
                Yesterday
              </span>
            </div>

          </div>
        </div>

        {/* Reminder text */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
          <img src={bellIcon} alt="bell" width={20} height={20} />
          <span style={{ fontSize: 14, color: "#6B7280" }}>
            We will remind you at 2 Apr
          </span>
        </div>

        {/* Edit Button */}
        <div style={{ marginTop: 8 }}>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              background: "rgba(237, 239, 242, 1)",
              border: "none",
              borderRadius: 12,
              padding: "8px 16px",
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              fontSize: 14,
              fontWeight: 500,
              color: "#141414",
              width: "fit-content"
            }}
          >
            <img src={editIcon} alt="edit" width={16} height={16} />
            Edit
          </button>
        </div>

      </div>
    </div>
  );
};

export default Task_details;
