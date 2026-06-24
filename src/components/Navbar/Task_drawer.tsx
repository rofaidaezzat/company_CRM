import React, { useState } from "react";
import checkSquareIcon from "../../assets/check-square-broken.svg";
import checkIcon from "../../assets/check-02.svg";
import editIcon from "../../assets/edit-03.svg";
import bellIcon from "../../assets/bell-ringing-04.svg";
import calendarIcon from "../../assets/calendar-03.svg";
import infoIcon from "../../assets/information-circle-contained.svg";
import userProfileIcon from "../../assets/user-profile-02.svg";
import "../../styles/task-drawer-mobile.css";
import {
  useGetTasksQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  Task,
} from "../../app/service/crudtasks";
import { toast } from "sonner";

interface TaskDrawerProps {
  onClose?: () => void;
  onNewTask?: () => void;
  onEditTask?: (taskData: any) => void;
}

// ── Priority colour helper ────────────────────────────────────────────────────
const priorityColor = (p: string) => {
  if (p === "HIGH")   return "#EF4444";
  if (p === "MEDIUM") return "#D97706";
  return "#6B7280";
};

// ── Due-date label helper ─────────────────────────────────────────────────────
const dueDateLabel = (iso: string) => {
  const due  = new Date(iso);
  const now  = new Date();
  const diff = Math.floor((due.getTime() - now.getTime()) / 86400000);
  if (diff < 0)  return { label: "Overdue",   color: "#EF4444" };
  if (diff === 0) return { label: "Today",     color: "#D97706" };
  if (diff === 1) return { label: "Tomorrow",  color: "#6B7280" };
  return {
    label: due.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    color: "#6B7280",
  };
};

// ── Single task card ──────────────────────────────────────────────────────────
const TaskCard = ({
  task,
  onEdit,
}: {
  task: Task;
  onEdit?: (data: Task) => void;
}) => {
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const handleComplete = async () => {
    try {
      const newStatus = task.status === "COMPLETED" ? "OPEN" : "COMPLETED";
      await updateTask({ id: task.id, body: { status: newStatus } }).unwrap();
    } catch (err: any) {
      console.error("Failed to mark task complete:", err);
      let errMsg = err?.data?.message || err?.message || "Failed to mark task complete.";
      if (Array.isArray(errMsg)) {
        errMsg = errMsg.join(", ");
      }
      toast.error(errMsg);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(task.id).unwrap();
    } catch (err: any) {
      console.error("Failed to delete task:", err);
      let errMsg = err?.data?.message || err?.message || "Failed to delete task.";
      if (Array.isArray(errMsg)) {
        errMsg = errMsg.join(", ");
      }
      toast.error(errMsg);
    }
  };

  const due = dueDateLabel(task.due_date);

  const labelStyle: React.CSSProperties = {
    fontFamily: "Inter, sans-serif",
    fontSize: "13px",
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: "140%",
    color: "var(--Foundation-neutral-neutral-800, #464646)",
  };

  const dataStyle: React.CSSProperties = {
    fontFamily: "Inter, sans-serif",
    fontSize: "13px",
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: "140%",
    color: "var(--Foundation-neutral-neutral-950, #141414)",
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
        background: task.status === "COMPLETED" ? "rgba(240,253,244,1)" : "rgba(245, 246, 250, 1)",
        boxSizing: "border-box",
        opacity: task.status === "COMPLETED" ? 0.75 : 1,
      }}
    >
      {/* Header */}
      <div className="task-card-header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M9.57912 2.26159C9.75126 1.9128 10.2486 1.9128 10.4208 2.26159L12.6491 6.77669C12.7174 6.9152 12.8496 7.0112 13.0024 7.03341L17.9851 7.75744C18.3701 7.81337 18.5237 8.28639 18.2452 8.55788L14.6397 12.0724C14.5291 12.1802 14.4786 12.3355 14.5047 12.4878L15.3559 17.4504C15.4216 17.8337 15.0193 18.126 14.675 17.9451L10.2183 15.602C10.0816 15.5302 9.91828 15.5302 9.78156 15.602L5.32489 17.9451C4.98062 18.126 4.57824 17.8337 4.64399 17.4504L5.49514 12.4878C5.52125 12.3355 5.47078 12.1802 5.36018 12.0724L1.75466 8.55788C1.47613 8.28639 1.62982 7.81337 2.01474 7.75744L6.99745 7.03341C7.1503 7.0112 7.28243 6.9152 7.35078 6.77669L9.57912 2.26159Z" stroke="#464646" strokeWidth="1.66667" strokeLinejoin="round"/>
          </svg>
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              fontSize: 16,
              lineHeight: "100%",
              color: "rgba(70, 70, 70, 1)",
              textDecoration: task.status === "COMPLETED" ? "line-through" : "none",
            }}
          >
            {task.title}
          </span>
        </div>
        <div className="task-card-header-actions" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {task.status !== "COMPLETED" && (
            <img
              onClick={() => onEdit?.(task)}
              src={editIcon}
              alt="Edit"
              width={24}
              height={24}
              style={{ cursor: "pointer" }}
            />
          )}
          <img
            src={checkIcon}
            alt="Complete"
            width={24}
            height={24}
            style={{
              cursor: "pointer",
              opacity: task.status === "COMPLETED" ? 0.4 : 1,
              filter: task.status === "COMPLETED" ? "grayscale(1)" : "none",
            }}
            onClick={handleComplete}
          />
          {/* Delete */}
          <svg
            onClick={handleDelete}
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            style={{ cursor: "pointer" }}
          >
            <path
              d="M4 6.17647H20M10 16.7647V10.4118M14 16.7647V10.4118M16 21H8C6.89543 21 6 20.0519 6 18.8824V7.23529C6 6.65052 6.44772 6.17647 7 6.17647H17C17.5523 6.17647 18 6.65052 18 7.23529V18.8824C18 20.0519 17.1046 21 16 21ZM10 6.17647H14C14.5523 6.17647 15 5.70242 15 5.11765V4.05882C15 3.47405 14.5523 3 14 3H10C9.44772 3 9 3.47405 9 4.05882V5.11765C9 5.70242 9.44772 6.17647 10 6.17647Z"
              stroke="#A80D0B"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
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
        {task.description}
      </p>

      {/* Details */}
      <div
        className="task-card-details"
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
        {/* Left */}
        <div className="task-card-details-left" style={{ display: "flex", flexDirection: "column", gap: 12, width: 216 }}>
          {/* Lead name */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, height: 20 }}>
            <img src={userProfileIcon} alt="User" width={16} height={16} />
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={labelStyle}>Lead Name:</span>
              <span style={dataStyle}>
                {task.lead?.name ?? "—"}
              </span>
            </div>
          </div>
          {/* Assigned to */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, height: 20 }}>
            <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
              <path d="M0.833374 16.8333L0.833711 13.833C0.833898 12.1763 2.17699 10.8333 3.83371 10.8333H9.83325M12.8334 12.6905L14.8334 14.8333L16.8334 12.6905M14.8334 14.8333V9.33333M10.8334 3.83334C10.8334 5.49019 9.49023 6.83333 7.83337 6.83333C6.17652 6.83333 4.83337 5.49019 4.83337 3.83334C4.83337 2.17648 6.17652 0.833336 7.83337 0.833336C9.49023 0.833336 10.8334 2.17648 10.8334 3.83334Z" stroke="var(--Foundation-neutral-neutral-800, #464646)" strokeWidth={1.66667} strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={labelStyle}>Assigned by:</span>
              <span style={dataStyle}>
                {task.sales ? `${task.sales.first_name} ${task.sales.last_name}` : "—"}
              </span>
            </div>
          </div>
          {/* Reminder */}
          {task.reminder_at && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, height: 20 }}>
              <img src={bellIcon} alt="Bell" width={16} height={16} />
              <span style={labelStyle}>
                We will remind you at {new Date(task.reminder_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
              </span>
            </div>
          )}
        </div>

        {/* Right */}
        <div className="task-card-details-right" style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1, paddingLeft: 16 }}>
          {/* Priority */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, height: 20 }}>
            <img src={infoIcon} alt="Info" width={16} height={16} />
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={labelStyle}>Priority:</span>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: priorityColor(task.priority) }} />
                <span style={{ ...dataStyle, color: priorityColor(task.priority) }}>
                  {task.priority.charAt(0) + task.priority.slice(1).toLowerCase()}
                </span>
              </div>
            </div>
          </div>
          {/* Due date */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, height: 20 }}>
            <img src={calendarIcon} alt="Calendar" width={16} height={16} />
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={labelStyle}>Due date:</span>
              <span style={{ ...dataStyle, color: due.color }}>
                {due.label}
              </span>
            </div>
          </div>
          {/* Status badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span
              style={{
                fontSize: 11,
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                padding: "2px 8px",
                borderRadius: 20,
                background:
                  task.status === "COMPLETED" ? "#D1FAE5" :
                  task.status === "IN_PROGRESS" ? "#DBEAFE" :
                  task.status === "CANCELLED" ? "#FEE2E2" : "#F3F4F6",
                color:
                  task.status === "COMPLETED" ? "#065F46" :
                  task.status === "IN_PROGRESS" ? "#1E40AF" :
                  task.status === "CANCELLED" ? "#991B1B" : "#374151",
              }}
            >
              {task.status.replace("_", " ")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Drawer ────────────────────────────────────────────────────────────────────
const Task_drawer: React.FC<TaskDrawerProps> = ({ onClose, onNewTask, onEditTask }) => {
  const [activeTab, setActiveTab] = useState("All");
  const tabs = ["All", "Today", "Overdue", "Completed"];

  const { data: tasksResponse, isLoading } = useGetTasksQuery();

  const allTasks = tasksResponse?.data ?? [];

  const filteredTasks = allTasks.filter((task) => {
    if (activeTab === "All")       return task.status !== "CANCELLED";
    if (activeTab === "Completed") return task.status === "COMPLETED";
    if (activeTab === "Overdue")   return task.status !== "COMPLETED" && new Date(task.due_date) < new Date();
    if (activeTab === "Today") {
      const d = new Date(task.due_date);
      const now = new Date();
      return d.toDateString() === now.toDateString();
    }
    return true;
  });

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
        position: "relative",
      }}
    >
      {/* ── Header ── */}
      <div style={{ padding: "16px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src={checkSquareIcon} alt="Tasks" width={24} height={24} />
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 20, color: "#141414" }}>
              Tasks
            </span>
            {!isLoading && (
              <span
                style={{
                  background: "rgba(0,35,111,0.08)",
                  color: "rgba(0,35,111,1)",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  borderRadius: 20,
                  padding: "2px 8px",
                }}
              >
                {allTasks.length}
              </span>
            )}
          </div>
          <button
            className="task-drawer-close-btn"
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 4,
              display: "none",
              alignItems: "center",
              justifyContent: "center",
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
          style={{ display: "flex", width: 473, height: 35, borderBottom: "1px solid rgba(212, 213, 216, 1)" }}
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
        className="task-drawer-list"
        style={{
          width: 470,
          flex: 1,
          padding: "16px 0 80px 0",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {isLoading && (
          <div style={{ textAlign: "center", color: "#9CA3AF", fontFamily: "Inter, sans-serif", fontSize: 14, marginTop: 40 }}>
            Loading tasks...
          </div>
        )}
        {!isLoading && filteredTasks.length === 0 && (
          <div style={{ textAlign: "center", color: "#9CA3AF", fontFamily: "Inter, sans-serif", fontSize: 14, marginTop: 40 }}>
            No tasks found.
          </div>
        )}
        {filteredTasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={(data) => onEditTask?.(data)} />
        ))}
      </div>

      {/* ── New Task Button (Absolutely Positioned Bottom-Right) ── */}
      <button
        onClick={() => onNewTask?.()}
        className="task-drawer-footer-btn"
        style={{
          position: "absolute",
          bottom: "24px",
          right: "24px",
          zIndex: 10,
          background: "#00236F",
          width: "151px",
          height: "48px",
          borderRadius: "12px",
          border: "none",
          boxShadow: "0px 2px 3px 0px #0000001C",
          padding: "8px 24px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          cursor: "pointer",
          opacity: 1,
          transition: "background 0.2s, opacity 0.2s",
          boxSizing: "border-box",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 5V19M5 12H19"
            stroke="var(--Foundation-neutral-neutral-25, #F5F6FA)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span
          style={{
            color: "var(--Foundation-neutral-neutral-25, #F5F6FA)",
            textAlign: "center",
            fontFamily: "Inter, sans-serif",
            fontSize: "16px",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "normal",
          }}
        >
          New Task
        </span>
      </button>
    </div>
  );
};

export default Task_drawer;
