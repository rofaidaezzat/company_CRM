import React, { useState } from "react";
import "../../styles/notification-drawer-mobile.css";

// ── Icon config per type ─────────────────────────────────────────────────────
const iconConfig: Record<string, { bg: string; svg: React.ReactNode }> = {
  task: {
    bg: "#546C9F",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 17 17" fill="none">
        <path
          d="M10.375 1H3.8125C2.2592 1 1 2.25919 1 3.81248V13.1875C1 14.7408 2.2592 16 3.8125 16H13.1875C14.7408 16 16 14.7408 16 13.1875V8.03121M15.0625 3.34374L8.5 9.9062L6.625 8.03121"
          stroke="#F5F6FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
    ),
  },
  followup: {
    bg: "#76AFC5",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="14.167" height="14.167" viewBox="0 0 17 17" fill="none">
        <path
          d="M10.5428 11.625L12.5104 9.41146L10.5428 7.19792M12.5104 9.41146H4.54167M4.54167 4.09939H11.9201M15.1667 3.65625V12.5104C15.1667 13.9774 13.9774 15.1667 12.5104 15.1667H3.65625C2.18924 15.1667 1 13.9774 1 12.5104V3.65625C1 2.18924 2.18924 1 3.65625 1H12.5104C13.9774 1 15.1667 2.18924 15.1667 3.65625Z"
          stroke="#F5F6FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
    ),
  },
};

// ── Data ─────────────────────────────────────────────────────────────────────
const allNotifications = [
  {
    id: 1,
    iconType: "task",
    title: "New task assigned",
    description: "Call client Ahmed at 3:00 PM.",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: 2,
    iconType: "followup",
    title: "Followup with Yasser Fathalla",
    description: "Call client Ahmed at 3:00 PM.",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: 3,
    iconType: "task",
    title: "New lead assigned",
    description: "Call client Ahmed at 3:00 PM.",
    time: "1 hour ago",
    unread: false,
  },
  {
    id: 4,
    iconType: "followup",
    title: "Daily report not yet submitted",
    description: "Call client Ahmed at 3:00 PM.",
    time: "1 hour ago",
    unread: false,
  },
  {
    id: 5,
    iconType: "followup",
    title: "New deal created",
    description: "Call client Ahmed at 3:00 PM.",
    time: "1 hour ago",
    unread: false,
  },
];

// ── Props ─────────────────────────────────────────────────────────────────────
interface NotificationDrawerProps {
  open: boolean;
  onClose: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────
const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  open,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"Unread" | "Read">("Unread");

  const filtered = allNotifications.filter((n) =>
    activeTab === "Unread" ? n.unread : !n.unread
  );

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1100,
            background: "transparent",
          }}
        />
      )}

      {/* Drawer */}
      <div
        className="notification-drawer-container"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          zIndex: 1200,
          // Exact styles from spec
          background: "var(--Foundation-neutral-white, #FFF)",
          boxShadow: "-1px 0 4px 0 rgba(0, 0, 0, 0.10)",
          display: "flex",
          width: 521,
          padding: "34px 24px 218px 24px",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 24,
          boxSizing: "border-box",
          overflowY: "auto",
          // Slide animation
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            alignSelf: "stretch",
          }}
        >
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: 18,
              color: "#141414",
            }}
          >
            Notifications
          </span>

          {/* Close button */}
          <div
            onClick={onClose}
            style={{
              borderRadius: 99,
              background: "var(--Foundation-neutral-white, #FFF)",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.11)",
              display: "flex",
              width: 36,
              height: 36,
              padding: 6,
              justifyContent: "center",
              alignItems: "center",
              aspectRatio: "1 / 1",
              cursor: "pointer",
              boxSizing: "border-box",
              flexShrink: 0,
              transition: "box-shadow 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.boxShadow =
                "0 2px 6px 0 rgba(0, 0, 0, 0.18)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.boxShadow =
                "0 1px 3px 0 rgba(0, 0, 0, 0.11)";
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 5L5 15M5 5L15 15"
                stroke="#464646"
                strokeWidth="1.67"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* ── Tabs: Unread / Read ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            alignSelf: "stretch",
          }}
        >
          {/* Tab pill container */}
          <div
            style={{
              borderRadius: 12,
              border: "1px solid var(--Foundation-neutral-neutral-100, #D4D5D8)",
              display: "flex",
              height: 32,
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            {(["Unread", "Read"] as const).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <div
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    borderRadius: 12,
                    background: isActive
                      ? "var(--Foundation-brand-brand-50, #E6E9F1)"
                      : "transparent",
                    display: "flex",
                    height: 32,
                    padding: "0 8px",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 8,
                    cursor: "pointer",
                    transition: "background 0.15s",
                    boxSizing: "border-box",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: isActive ? 600 : 400,
                      fontSize: 13,
                      color: isActive ? "#00236F" : "#6B7280",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {tab}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Mark all as read */}
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              fontSize: 13,
              color: "var(--Foundation-brand-brand-500, #00236F)",
              cursor: "pointer",
            }}
          >
            Mark all as read
          </span>
        </div>

        {/* ── Notification list ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignSelf: "stretch",
            gap: 0,
          }}
        >
          {filtered.map((notif) => (
            <div
              key={notif.id}
              className="notification-drawer-item"
              style={{
                background: notif.unread
                  ? "var(--Foundation-brand-brand-50, #E6E9F1)"
                  : "transparent",
                display: "flex",
                width: notif.unread ? 473 : "100%",
                padding: "8px 12px",
                alignItems: "flex-start",
                gap: 12,
                borderRadius: 8,
                marginBottom: 8,
                cursor: "pointer",
                boxSizing: "border-box",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.opacity = "0.85";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.opacity = "1";
              }}
            >
              {/* Icon */}
              <div
                style={{
                  borderRadius: 99,
                  background: iconConfig[notif.iconType]?.bg ?? "#546C9F",
                  display: "flex",
                  width: 32,
                  height: 32,
                  padding: 6,
                  justifyContent: "center",
                  alignItems: "center",
                  flexShrink: 0,
                  boxSizing: "border-box",
                }}
              >
                {iconConfig[notif.iconType]?.svg}
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 600,
                    fontSize: 14,
                    color: "#141414",
                  }}
                >
                  {notif.title}
                </span>
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 400,
                    fontSize: 13,
                    color: "#464646",
                  }}
                >
                  {notif.description}
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginTop: 2,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 400,
                      fontSize: 11,
                      color: "#9CA3AF",
                    }}
                  >
                    {notif.time}
                  </span>
                  {notif.unread && (
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#00236F",
                        display: "inline-block",
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default NotificationDrawer;
