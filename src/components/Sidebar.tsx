import React, { useState } from "react";
import Logout from "./Logout";
import { useTranslation } from "../context/LanguageContext";

interface SidebarProps {
  onNavigate?: (page: string) => void;
  currentPage?: string;
}

// ── Inline SVG Icons ──────────────────────────────────────────────────────────

const OverviewIcon = ({ color }: { color: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none" style={{ color }}>
    <path
      d="M10.6 2.20855V19.0006M1 10.6046H20.2M17.56 20.2L3.16 18.4009C1.96 18.2809 1 17.3214 1 16.1219V5.08718C1 3.88775 1.96 2.92821 3.16 2.80826L17.56 1.00912C19 0.889176 20.2 1.96866 20.2 3.28804V17.8011C20.2 19.2405 18.88 20.3199 17.56 20.0801V20.2Z"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

const LeadsIcon = ({ color }: { color: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none" style={{ color }}>
    <path
      d="M1 20.2L1.0004 16.5996C1.00063 14.6115 2.61234 13 4.6004 13H11.7999M15.4 15.2286L17.8 17.8L20.2 15.2286M17.8 17.8V11.2M13 4.6C13 6.58822 11.3882 8.2 9.4 8.2C7.41177 8.2 5.8 6.58822 5.8 4.6C5.8 2.61177 7.41177 1 9.4 1C11.3882 1 13 2.61177 13 4.6Z"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

const DealsIcon = ({ color }: { color: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ color }}>
    <path
      d="M7.85737 7.63627C8.63242 4.62496 11.366 2.3999 14.6192 2.3999C18.4752 2.3999 21.601 5.52577 21.601 9.38172C21.601 12.4559 19.6142 15.0661 16.8545 15.9981M7.85737 17.1256H9.38123M9.38123 17.1256H10.7994M9.38123 17.1256V11.5619C9.38123 11.5619 8.31742 12.2933 7.63578 12.7619M16.363 14.6181C16.363 18.474 13.2372 21.5999 9.38123 21.5999C5.52528 21.5999 2.39941 18.474 2.39941 14.6181C2.39941 10.7621 5.52528 7.63627 9.38123 7.63627C13.2372 7.63627 16.363 10.7621 16.363 14.6181Z"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

const SalesIcon = ({ color }: { color: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="19.2"
    height="17.142"
    viewBox="0 0 22 20"
    fill="none"
    style={{ color }}
  >
    <path
      d="M14.6254 18.1416L14.6257 14.9279C14.6259 13.1527 13.1868 11.7135 11.4116 11.7135H4.21442C2.43948 11.7135 1.00056 13.1523 1.00036 14.9272L1 18.1416M20.1997 18.1418L20.2 14.928C20.2002 13.1529 18.7611 11.7137 16.9859 11.7137M14.0063 1.63141C14.7956 2.21705 15.3072 3.1559 15.3072 4.21423C15.3072 5.27256 14.7956 6.21142 14.0063 6.79705M11.0938 4.21406C11.0938 5.98913 9.65482 7.42811 7.87974 7.42811C6.10467 7.42811 4.66569 5.98913 4.66569 4.21406C4.66569 2.43898 6.10467 1 7.87974 1C9.65482 1 11.0938 2.43898 11.0938 4.21406Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ReportsIcon = ({ color }: { color: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="22" viewBox="0 0 18 22" fill="none" style={{ color }}>
    <path
      d="M5.20037 5.8H12.4004M5.20037 9.4H12.4004M5.20037 13H8.80037M3.40009 1H14.2003C15.5258 1 16.6003 2.07454 16.6003 3.40005L16.6 17.8C16.6 19.1255 15.5255 20.2 14.2 20.2L3.39999 20.1999C2.0745 20.1999 0.999991 19.1254 1 17.7999L1.00009 3.39999C1.0001 2.07451 2.07462 1 3.40009 1Z"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

const SettingsIcon = ({ color }: { color: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ color }}>
    <path
      fillRule="evenodd" clipRule="evenodd"
      d="M11.6763 2.31627C11.2488 0.561243 8.75121 0.561243 8.3237 2.31627C8.25987 2.57999 8.13468 2.82492 7.95831 3.03112C7.78194 3.23732 7.55938 3.39897 7.30874 3.50291C7.0581 3.60684 6.78646 3.65014 6.51592 3.62927C6.24538 3.60839 5.9836 3.52394 5.75187 3.38279C4.20832 2.44227 2.44201 4.20855 3.38254 5.75207C3.99006 6.74884 3.45117 8.04936 2.31713 8.32499C0.560955 8.75137 0.560955 11.25 2.31713 11.6753C2.58093 11.7392 2.8259 11.8645 3.03211 12.041C3.23831 12.2175 3.39991 12.4402 3.50375 12.691C3.6076 12.9418 3.65074 13.2135 3.62968 13.4841C3.60862 13.7547 3.52394 14.0165 3.38254 14.2482C2.44201 15.7917 4.20832 17.558 5.75187 16.6175C5.98356 16.4761 6.24536 16.3914 6.51597 16.3704C6.78658 16.3493 7.05834 16.3924 7.30912 16.4963C7.5599 16.6001 7.7826 16.7617 7.95911 16.9679C8.13561 17.1741 8.26091 17.4191 8.32482 17.6829C8.75121 19.439 11.2499 19.439 11.6752 17.6829C11.7393 17.4192 11.8647 17.1744 12.0413 16.9684C12.2178 16.7623 12.4405 16.6008 12.6912 16.497C12.9419 16.3932 13.2135 16.35 13.4841 16.3709C13.7546 16.3919 14.0164 16.4764 14.2481 16.6175C15.7917 17.558 17.558 15.7917 16.6175 14.2482C16.4763 14.0165 16.3918 13.7547 16.3709 13.4842C16.35 13.2136 16.3932 12.942 16.497 12.6913C16.6008 12.4406 16.7623 12.2179 16.9683 12.0414C17.1744 11.8648 17.4192 11.7394 17.6829 11.6753C19.439 11.2489 19.439 8.75025 17.6829 8.32499C17.4191 8.26108 17.1741 8.13578 16.9679 7.95928C16.7617 7.78278 16.6001 7.56007 16.4962 7.3093C16.3924 7.05853 16.3493 6.78677 16.3703 6.51617C16.3914 6.24556 16.4761 5.98376 16.6175 5.75207C17.558 4.20855 15.7917 2.44227 14.2481 3.38279C14.0164 3.52418 13.7546 3.60886 13.484 3.62992C13.2134 3.65098 12.9417 3.60784 12.6909 3.504C12.4401 3.40016 12.2174 3.23856 12.0409 3.03236C11.8644 2.82616 11.7391 2.58119 11.6752 2.3174L11.6763 2.31627Z"
      stroke="currentColor" strokeWidth="2"
    />
    <path
      d="M12 10C12 11.1046 11.1046 12 10 12C8.89543 12 8 11.1046 8 10C8 8.89543 8.89543 8 10 8C11.1046 8 12 8.89543 12 10Z"
      stroke="currentColor" strokeWidth="2"
    />
  </svg>
);

const LogoutIcon = ({ color }: { color: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ color }}>
    <path
      d="M14.6471 7.8001V5.7001C14.6471 5.14314 14.424 4.609 14.0268 4.21517C13.6297 3.82135 13.091 3.6001 12.5294 3.6001H5.11765C4.55601 3.6001 4.01738 3.82135 3.62024 4.21517C3.22311 4.609 3 5.14314 3 5.7001V18.3001C3 18.8571 3.22311 19.3912 3.62024 19.785C4.01738 20.1788 4.55601 20.4001 5.11765 20.4001H12.5294C13.091 20.4001 13.6297 20.1788 14.0268 19.785C14.424 19.3912 14.6471 18.8571 14.6471 18.3001V16.2001M8.29412 12.0001H21M21 12.0001L17.8235 8.8501M21 12.0001L17.8235 15.1501"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

// ── Nav Items ─────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "overview",  label: "Overview",  Icon: OverviewIcon  },
  { id: "leads",    label: "Leads",     Icon: LeadsIcon     },
  { id: "deals",    label: "Deals",     Icon: DealsIcon     },
  { id: "sales",    label: "Sales",     Icon: SalesIcon     },
  { id: "reports",  label: "Reports",   Icon: ReportsIcon   },
  { id: "settings", label: "Settings",  Icon: SettingsIcon  },
];

// ── Sidebar Component ─────────────────────────────────────────────────────────

const Sidebar: React.FC<SidebarProps> = ({ currentPage = "overview", onNavigate }) => {
  const { t } = useTranslation();
  const [activeItem, setActiveItem] = useState(currentPage);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleNav = (id: string) => {
    setActiveItem(id);
    if (onNavigate) onNavigate(id);
  };

  return (
    <>
      <div
        style={{
          width: 94,
          height: "100%",
          background: "#00236F",
          borderRight: "1px solid rgba(0,0,0,0.12)",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
        }}
      >
        {/* Logo Section */}
        <div
          style={{
            width: 94,
            height: 75,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
            boxSizing: "border-box",
          }}
        >
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 20,
              fontWeight: 700,
              color: "#FFFFFF",
              letterSpacing: "-0.5px",
            }}
          >
            rodo.
          </span>
        </div>

        {/* Nav Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0, paddingTop: 16 }}>
          {NAV_ITEMS.map((item) => {
            const isActive = activeItem === item.id;
            const iconColor = isActive
              ? "var(--Foundation-brand-brand-500, #00236F)"
              : "#EDEFF2";

            return (
              <div
                key={item.id}
                onClick={() => handleNav(item.id)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 94,
                  height: 75,
                  gap: 8,
                  paddingTop: 12,
                  paddingRight: 24,
                  paddingBottom: 12,
                  paddingLeft: 24,
                  background: isActive ? "#B0BBD2" : "transparent",
                  borderLeft: isActive ? "4px solid #B0BBD2" : "4px solid transparent",
                  boxSizing: "border-box",
                  cursor: "pointer",
                  transition: "background 0.2s, border-left 0.2s",
                  position: "relative",
                }}
              >
                {/* Icon wrapper — 24×24, no border */}
                <div
                  style={{
                    width: 24,
                    height: 24,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <item.Icon color={iconColor} />
                </div>

                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 12,
                    fontWeight: 400,
                    lineHeight: "100%",
                    color: isActive ? "#00236F" : "#FFFFFF",
                    transition: "color 0.2s",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  {t(`sidebar.${item.id}`)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Logout at bottom */}
        <div
          style={{
            marginTop: "auto",
            borderTop: "1px solid rgba(255, 255, 255, 0.2)",
            boxSizing: "border-box",
          }}
        >
          <div
            onClick={() => setIsLogoutModalOpen(true)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: 94,
              height: 75,
              gap: 8,
              paddingTop: 12,
              paddingRight: 24,
              paddingBottom: 12,
              paddingLeft: 24,
              borderLeft: "4px solid transparent",
              cursor: "pointer",
              transition: "background 0.2s",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <LogoutIcon color="#EDEFF2" />
            </div>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 12,
                fontWeight: 400,
                color: "#EDEFF2",
                textAlign: "center",
                whiteSpace: "nowrap",
              }}
            >
              {t('sidebar.logout')}
            </span>
          </div>
        </div>
      </div>

      {/* Logout Modal */}
      {isLogoutModalOpen && (
        <div
          onClick={() => setIsLogoutModalOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
          }}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <Logout
              onClose={() => setIsLogoutModalOpen(false)}
              onLogout={() => setIsLogoutModalOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
