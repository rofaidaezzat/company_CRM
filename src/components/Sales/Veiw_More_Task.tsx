import React from "react";
import closeIcon from "../../assets/x-02.svg";
import starIcon from "../../assets/stars.svg";
import editIcon from "../../assets/edit-03.svg";
import checkIcon from "../../assets/check-02.svg";
import calendarIcon from "../../assets/calendar-03.svg";
import userProfileIcon from "../../assets/user-profile-02.svg";
import infoIcon from "../../assets/information-circle-contained.svg";

interface VeiwMoreTaskProps {
  onClose: () => void;
}

const Veiw_More_Task: React.FC<VeiwMoreTaskProps> = ({ onClose }) => {
  const tasks = [
    {
      id: 1,
      title: "Call Mohamed Yasser for followup",
      lead: "Mohamed Yasser",
      assignedBy: "Yasser Helmy",
      priority: "High",
      dueDate: "Today",
      description: "Lorem ipsum dolor sit amet consectetur. In lacus in odio faucibus pellentesque aliquam metus justo nulla.",
    },
    {
      id: 2,
      title: "Send proposal to Cairo Real Estate",
      lead: "Ahmed Ali",
      assignedBy: "Yasser Helmy",
      priority: "Medium",
      dueDate: "Tomorrow",
      description: "Prepare and email the updated sales commission proposal based on the agreed rates.",
    },
    {
      id: 3,
      title: "Meeting with Amr Abdelaziz",
      lead: "Amr Abdelaziz",
      assignedBy: "Self",
      priority: "Low",
      dueDate: "28 Apr 2026",
      description: "F2F meeting at the Giza office to discuss commercial terms and contract signature.",
    }
  ];

  return (
    <div
      style={{
        display: "flex",
        width: 521,
        maxHeight: "90vh",
        flexDirection: "column",
        alignItems: "flex-start",
        background: "#FFFFFF",
        borderRadius: 16,
        boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.12)",
        overflow: "hidden",
        boxSizing: "border-box",
        padding: 24,
        position: "relative",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: 20, fontWeight: 700, color: "#141414" }}>
          Tasks List
        </h2>
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
          }}
        >
          <img src={closeIcon} alt="Close" width={14} height={14} />
        </button>
      </div>

      {/* Task List container */}
      <div
        className="custom-scrollbar"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          width: "100%",
          overflowY: "auto",
          maxHeight: "60vh",
          paddingRight: 4,
          boxSizing: "border-box",
        }}
      >
        {tasks.map((task) => (
          <div
            key={task.id}
            style={{
              display: "flex",
              padding: 16,
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 16,
              alignSelf: "stretch",
              borderRadius: 12,
              background: "#F8F9FC",
              border: "1px solid #EDEFF2",
              boxSizing: "border-box",
            }}
          >
            {/* Title row */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", width: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <img src={starIcon} alt="Star" width={20} height={20} />
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 600,
                    fontSize: 15,
                    color: "#141414",
                  }}
                >
                  {task.title}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <img src={editIcon} alt="Edit" width={20} height={20} style={{ cursor: "pointer" }} />
                <img src={checkIcon} alt="Complete" width={20} height={20} style={{ cursor: "pointer" }} />
              </div>
            </div>

            {/* Description */}
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                fontSize: 13,
                lineHeight: "140%",
                color: "#464646",
                margin: 0,
              }}
            >
              {task.description}
            </p>

            {/* Divider */}
            <div style={{ width: "100%", height: 1, background: "#EDEFF2" }} />

            {/* Metadata grid */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, width: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 160 }}>
                <img src={userProfileIcon} alt="User" width={14} height={14} />
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#747474" }}>
                  Lead: <strong style={{ color: "#141414", fontWeight: 500 }}>{task.lead}</strong>
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 160 }}>
                <img src={infoIcon} alt="Priority" width={14} height={14} />
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#747474" }}>
                  Priority:{" "}
                  <span
                    style={{
                      color:
                        task.priority === "High"
                          ? "#EF4444"
                          : task.priority === "Medium"
                          ? "#F59E0B"
                          : "#10B981",
                      fontWeight: 600,
                    }}
                  >
                    {task.priority}
                  </span>
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 160 }}>
                <img src={calendarIcon} alt="Due" width={14} height={14} />
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#747474" }}>
                  Due: <strong style={{ color: "#00236F", fontWeight: 500 }}>{task.dueDate}</strong>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Veiw_More_Task;
