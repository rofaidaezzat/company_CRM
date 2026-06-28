import React from "react";
import "../styles/leads-modal-mobile.css";
import { useTranslation } from "../context/LanguageContext";

interface LogoutProps {
  onClose?: () => void;
  onLogout?: () => void;
}

const Logout: React.FC<LogoutProps> = ({ onClose, onLogout }) => {
  const { t } = useTranslation();
  return (
    <div
      className="leads-modal-root"
      style={{
        display: "flex",
        width: 462,
        flexDirection: "column",
        alignItems: "flex-start",
        background: "rgba(245, 246, 250, 1)",
        borderRadius: 12,
        boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.12)",
      }}
    >
      {/* ── Header ── */}
      <div
        className="leads-modal-header"
        style={{
          display: "flex",
          padding: 20,
          justifyContent: "space-between",
          alignItems: "center",
          alignSelf: "stretch",
          background: "var(--Foundation-neutral-neutral-25, #F5F6FA)",
          borderBottom: "1px solid var(--Foundation-neutral-neutral-100, #D4D5D8)",
          borderRadius: "12px 12px 0 0",
        }}
      >
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            fontSize: 16,
            color: "#141414",
          }}
        >
          {t('logout.title')}
        </span>
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
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#141414" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
          </svg>
        </button>
      </div>

      {/* ── Body ── */}
      <div
        className="leads-modal-body"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 20px 24px 20px",
          gap: 16,
          alignSelf: "stretch",
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 98,
            height: 98,
            background: "#D4D5D8",
            borderRadius: 12,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
            <path d="M58.4 28.2663C58.1333 27.9997 58.1333 27.733 57.8667 27.4663L52.5333 22.133C51.4667 21.0663 49.8667 21.0663 48.8 22.133C47.7333 23.1997 47.7333 24.7997 48.8 25.8663L49.6 26.6663H42.6667C41.0667 26.6663 40 27.733 40 29.333C40 30.933 41.0667 31.9997 42.6667 31.9997H49.6L48.8 32.7997C47.7333 33.8663 47.7333 35.4663 48.8 36.533C49.3333 37.0663 50.1333 37.333 50.6667 37.333C51.2 37.333 52 37.0663 52.5333 36.533L57.8667 31.1997C58.1333 30.933 58.4 30.6663 58.4 30.3997C58.6667 29.5997 58.6667 29.0663 58.4 28.2663Z" fill="#00236F"/>
            <path d="M45.3337 37.3333C43.7337 37.3333 42.667 38.4 42.667 40V42.6667C42.667 44.2667 41.6003 45.3333 40.0003 45.3333H37.3337V22.4C37.3337 18.9333 35.2003 16 32.267 14.9333L28.0003 13.3333H40.0003C41.6003 13.3333 42.667 14.4 42.667 16V18.6667C42.667 20.2667 43.7337 21.3333 45.3337 21.3333C46.9337 21.3333 48.0003 20.2667 48.0003 18.6667V16C48.0003 11.4667 44.5337 8 40.0003 8H13.3337C13.067 8 12.8003 8 12.5337 8.26667C12.267 8.26667 12.0003 8.53333 12.0003 8.53333L11.7337 8.8C11.467 8.8 11.2003 9.06667 11.2003 9.33333V9.6C10.9337 9.6 10.667 9.86667 10.667 10.1333V48C10.667 49.0667 11.467 50.1333 12.267 50.4L29.867 57.0667C30.4003 57.3333 31.2003 57.3333 31.7337 57.3333C32.8003 57.3333 33.867 57.0667 34.667 56.2667C36.0003 55.2 37.067 53.6 37.067 52V50.6667H39.7337C44.267 50.6667 47.7337 50.6667 47.7337 42.6667V40C48.0003 38.6667 46.9337 37.3333 45.3337 37.3333ZM16.0003 46.1333V14.4L30.1337 19.7333C31.2003 20.2667 32.0003 21.3333 32.0003 22.4V52L16.0003 46.1333Z" fill="#00236F"/>
          </svg>
        </div>

        {/* Text */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
          <span
            style={{
              color: "var(--Foundation-neutral-neutral-950, #141414)",
              textAlign: "center",
              fontFamily: "Inter, sans-serif",
              fontSize: 19,
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "normal",
            }}
          >
            {t('logout.messageHeader')}
          </span>
          <span
            style={{
              color: "var(--Foundation-neutral-neutral-800, #464646)",
              textAlign: "center",
              fontFamily: "Inter, sans-serif",
              fontSize: 16,
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "normal",
              alignSelf: "stretch",
            }}
          >
            {t('logout.messageBody')}
          </span>
        </div>
      </div>
      {/* ── Footer ── */}
      <div
        style={{
          display: "flex",
          padding: "14px 20px",
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "stretch",
          background: "rgba(245, 246, 250, 1)",
          borderBottomRightRadius: 12,
          borderBottomLeftRadius: 12,
        }}
      >
        <div style={{ display: "flex", gap: 12, width: "100%", height: 48 }}>
          {/* Cancel Button */}
          <button
            onClick={onClose}
            style={{
              flex: 1,
              height: 48,
              borderRadius: 12,
              border: "1px solid rgba(212, 213, 216, 1)",
              background: "#FFFFFF",
              color: "#141414",
              fontFamily: "Inter, sans-serif",
              fontSize: 16,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            {t('common.cancel')}
          </button>
          {/* Logout Button */}
          <button
            onClick={onLogout}
            style={{
              flex: 1,
              height: 48,
              borderRadius: 12,
              border: "none",
              background: "rgba(0, 35, 111, 1)",
              padding: "8px 24px",
              color: "#FFFFFF",
              fontFamily: "Inter, sans-serif",
              fontSize: 16,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            {t('logout.title')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
