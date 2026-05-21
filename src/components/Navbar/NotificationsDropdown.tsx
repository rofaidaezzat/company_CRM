import React from "react";
import taskIcon from "../../assets/notification icons.svg";
import followUpIcon from "../../assets/notification icons (1).svg";
import dailyReportIcon from "../../assets/notification icons (2).svg";

// ── Data ─────────────────────────────────────────────────────────────────────
const notifications = [
  {
    id: 1,
    icon: taskIcon,
    title: "Task",
    description: "You have a new task assigned to you",
    time: "2 min ago",
  },
  {
    id: 2,
    icon: followUpIcon,
    title: "Follow Up Reminder",
    description: "Don't forget to follow up with Ahmed Ali",
    time: "15 min ago",
  },
  {
    id: 3,
    icon: dailyReportIcon,
    title: "Daily Report",
    description: "Your daily sales report is ready to view",
    time: "1 hr ago",
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

interface NotificationsDropdownProps {
  onViewAll?: () => void;
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({
  onViewAll,
}) => {
  return (
    <div
      style={{
        width: "100%",
        boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.11)",
        borderRadius: 12,
        overflow: "hidden",
        background: "rgba(255, 255, 255, 1)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Part 1: Header ── */}
      <div
        style={{
          width: "100%",
          height: 48,
          background: "rgba(255, 255, 255, 1)",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          borderBottom: "1px solid rgba(212, 213, 216, 1)",
          display: "flex",
          alignItems: "center",
          paddingLeft: 20,
          paddingRight: 20,
          boxSizing: "border-box",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: 15,
            color: "#141414",
          }}
        >
          Notifications
        </span>
      </div>

      {/* ── Part 2: Body ── */}
      <div
        style={{
          width: "100%",
          background: "rgba(255, 255, 255, 1)",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        {notifications.map((notif, index) => (
          <div
            key={notif.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "14px 20px",
              borderBottom:
                index < notifications.length - 1
                  ? "1px solid rgba(212, 213, 216, 0.5)"
                  : "none",
              cursor: "pointer",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.background =
                "rgba(245, 246, 250, 1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.background =
                "transparent";
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 99,
                background: "var(--Foundation-brand-brand-50, #E6E9F1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <img
                src={notif.icon}
                alt={notif.title}
                width={24}
                height={24}
                style={{ borderRadius: 0 }}
              />
            </div>

            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                  fontSize: 13,
                  color: "#141414",
                  marginBottom: 3,
                }}
              >
                {notif.title}
              </div>
              <div
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
                  fontSize: 12,
                  color: "#6B7280",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {notif.description}
              </div>
            </div>

            {/* Time */}
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                fontSize: 11,
                color: "#9CA3AF",
                flexShrink: 0,
              }}
            >
              {notif.time}
            </div>
          </div>
        ))}
      </div>

      {/* ── Part 3: View All Footer ── */}
      <div
        onClick={() => {
          if (onViewAll) onViewAll();
        }}
        style={{
          borderTop: "1px solid var(--Foundation-neutral-neutral-100, #D4D5D8)",
          background: "var(--Foundation-neutral-neutral-25, #F5F6FA)",
          display: "flex",
          padding: "9px 12px",
          alignItems: "center",
          alignSelf: "stretch",
          cursor: "pointer",
          flexShrink: 0,
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.background =
            "rgba(237, 239, 242, 1)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.background =
            "var(--Foundation-neutral-neutral-25, #F5F6FA)";
        }}
      >
        <span
          style={{
            color: "var(--Foundation-brand-brand-500, #00236F)",
            fontFamily: "Inter",
            fontSize: 13,
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "140%",
          }}
        >
          View All
        </span>
      </div>
    </div>
  );
};

export default NotificationsDropdown;
