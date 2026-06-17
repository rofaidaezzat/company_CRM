import React, { useState, useRef, useEffect } from "react";
import checkSquareIcon from "../assets/check-square-broken.svg";
import notificationIcon from "../assets/icon btn.svg";
import NotificationsDropdown from "./Navbar/NotificationsDropdown";
import NotificationDrawer from "./Navbar/NotificationDrawer";
import Report_Bug from "./Support/Support";

interface NavbarProps {
  onSearch?: (query: string) => void;
  onTasksClick?: () => void;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
  onMenuClick?: () => void;
}
const Navbar: React.FC<NavbarProps> = ({
  onSearch,
  onTasksClick,
  onProfileClick,
  onMenuClick,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showBugReport, setShowBugReport] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close notification dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications]);

  // Close search dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false);
      }
    };
    if (showSearch) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSearch]);

  return (
    <>
    <div
      className="layout-navbar"
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: 72,
        background: "rgba(255, 255, 255, 1)",
        boxShadow: "0px 1px 3px 0px rgba(0, 0, 0, 0.11)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        boxSizing: "border-box",
        zIndex: 10,
      }}
    >
      
      {/* ── Hamburger (Mobile Only) ── */}
      <button className="mobile-hamburger" onClick={onMenuClick}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(70, 70, 70, 1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      {/* ── Center: Search Bar + Dropdown ── */}
      <div ref={searchRef} className="navbar-search" style={{ position: "relative", width: 406 }}>
        {/* Search Input */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            height: 40,
            border: "1px solid rgba(0, 35, 111, 1)",
            borderRadius: 12,
            padding: "8px 12px",
            gap: 8,
            boxSizing: "border-box",
            background: "rgba(255, 255, 255, 1)",
          }}
        >
          {/* Search Icon */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ flexShrink: 0 }}
          >
            <path
              d="M21 21L15.0001 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
              stroke="rgba(70, 70, 70, 1)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onFocus={() => setShowSearch(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              onSearch && onSearch(e.target.value);
              setShowSearch(true);
            }}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              fontSize: 16,
              lineHeight: "100%",
              letterSpacing: "0%",
              color: "rgba(70, 70, 70, 1)",
              background: "transparent",
              width: "100%",
            }}
          />
        </div>

        {/* Search Dropdown */}
        {showSearch && (
          <div
            style={{
              position: "absolute",
              top: 48,
              left: 0,
              width: 406,
              background: "rgba(255, 255, 255, 1)",
              border: "1px solid rgba(212, 213, 216, 1)",
              borderRadius: 12,
              paddingTop: 12,
              paddingBottom: 12,
              boxSizing: "border-box",
              zIndex: 200,
              display: "flex",
              flexDirection: "column",
              gap: 0,
            }}
          >
            {/* Result rows */}
            {[
              {
                name: "Wael Metwally",
                type: "Lead",
                avatarBg: "#4CAF50",
                initials: "WM",
              },
              {
                name: "Wael Metwally",
                type: "Deal",
                avatarBg: "#F59E0B",
                initials: "WM",
              },
              {
                name: "Wael Metwally",
                type: "Assigned task",
                avatarBg: "rgba(0, 35, 111, 1)",
                initials: "WM",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "12px 16px",
                  cursor: "pointer",
                  background: idx === 1 ? "rgba(237, 239, 242, 1)" : "transparent",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = "rgba(237, 239, 242, 1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background =
                    idx === 1 ? "rgba(237, 239, 242, 1)" : "transparent";
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: item.avatarBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 700,
                    fontSize: 14,
                    flexShrink: 0,
                  }}
                >
                  {item.initials}
                </div>
                {/* Text */}
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 600,
                      fontSize: 15,
                      color: "#141414",
                    }}
                  >
                    {item.name}
                  </span>
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 400,
                      fontSize: 13,
                      color: "#6B7280",
                    }}
                  >
                    {item.type}
                  </span>
                </div>
              </div>
            ))}

            {/* Show more results */}
            <div
              style={{
                padding: "10px 16px 0",
                borderTop: "1px solid rgba(212, 213, 216, 1)",
                marginTop: 4,
              }}
            >
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
                  fontSize: 14,
                  color: "rgba(0, 35, 111, 1)",
                  cursor: "pointer",
                }}
              >
                Show more results for {searchQuery || "..."}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Right: Actions & Profile ── */}
      <div className="navbar-right" style={{ display: "flex", alignItems: "center", gap: 24 }}>
        {/* Notification Button + Dropdown */}
        <div ref={notifRef} style={{ position: "relative" }}>
          <img
            src={notificationIcon}
            alt="Notifications"
            width={40}
            height={40}
            onClick={() => setShowNotifications((prev) => !prev)}
            style={{ cursor: "pointer", display: "block", borderRadius: 99 }}
          />

          {showNotifications && (
            <div
              className="navbar-notifications-dropdown"
              style={{
                position: "fixed",
                top: 62,
                right: 74,
                width: 432,
                zIndex: 1000,
              }}
            >
              {/* ── Triangle pointer ── */}
              <div
                className="navbar-notifications-pointer"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 354,
                  width: 22,
                  height: 19,
                  opacity: 1,
                  transform: "rotate(0deg)",
                  filter: "drop-shadow(0px -3px 4px rgba(0, 0, 0, 0.06))",
                  zIndex: 2,
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 19,
                    background: "rgba(255, 255, 255, 1)",
                    clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                  }}
                />
              </div>

              {/* ── Modal content box ── */}
              <div
                className="navbar-notifications-box"
                style={{
                  position: "absolute",
                  top: 14,
                  left: 0,
                  width: 432,
                  boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.11)",
                  borderRadius: 12,
                  overflow: "hidden",
                  zIndex: 1,
                }}
              >
                <NotificationsDropdown
                  onViewAll={() => {
                    setShowNotifications(false);
                    setShowDrawer(true);
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Tasks (Check Square) */}
        <img
          src={checkSquareIcon}
          alt="Tasks"
          width={24}
          height={24}
          onClick={onTasksClick}
          style={{ cursor: "pointer" }}
        />

        {/* Info / Feedback bubble SVG */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none"
          onClick={() => setShowBugReport(true)}
          style={{
            width: 24,
            height: 24,
            flexShrink: 0,
            cursor: "pointer"
          }}
        >
          <path 
            d="M11.9991 15.375V12M11.9991 8.625V8.70959M20.9983 12C20.9983 13.2938 20.7253 14.5238 20.2338 15.6356L21 20.9991L16.4039 19.85C15.1019 20.5823 13.5993 21 11.9991 21C7.02906 21 3 16.9706 3 12C3 7.02944 7.02906 3 11.9991 3C16.9692 3 20.9983 7.02944 20.9983 12Z" 
            stroke="#464646" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>

        {/* Vertical Divider */}
        <div style={{ width: 1, height: 32, background: "rgba(212, 213, 216, 0.5)" }} />

        {/* Profile Avatar */}
        <div
          onClick={onProfileClick}
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "rgba(0, 35, 111, 1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          MS
        </div>
      </div>
    </div>

    {/* ── Notification Drawer (portal-like, fixed) ── */}
    <NotificationDrawer
      open={showDrawer}
      onClose={() => setShowDrawer(false)}
    />

    {/* ── Report Bug Modal ── */}
    <Report_Bug
      isOpen={showBugReport}
      onClose={() => setShowBugReport(false)}
    />
    </>
  );
};

export default Navbar;
