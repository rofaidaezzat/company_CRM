import React from 'react';
import { ResponsiveContainer, PieChart, Pie } from 'recharts';
import { useTranslation } from '../../context/LanguageContext';

interface TeamMemberProgress {
  id: string;
  name: string;
  achieved: number;
  target: number;
  percentage: number;
}

interface TeamRevenueTargetProps {
  onClose?: () => void;
  date?: string;
  target?: number;
  achieved?: number;
  currency?: string;
  members?: TeamMemberProgress[];
}

const defaultMembers: TeamMemberProgress[] = Array(8).fill(null).map((_, i) => ({
  id: String(i),
  name: "Mohammed Gammal",
  achieved: 6000,
  target: 50000,
  percentage: 12,
}));

const Team_Revenue_Target: React.FC<TeamRevenueTargetProps> = ({
  onClose,
  date = "Sun 6 April, 2026",
  target = 40000,
  achieved = 25000,
  currency = "EGP",
  members = defaultMembers,
}) => {
  const { t } = useTranslation();

  const percentage = target === 0 ? (achieved > 0 ? 100 : 0) : Math.min(100, Math.round((achieved / target) * 100));

  return (
    <div style={{
      display: "flex",
      width: 435,
      flexDirection: "column",
      alignItems: "flex-start",
      boxShadow: "0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)",
      borderRadius: 12,
      background: "var(--Foundation-neutral-neutral-25, #F5F6FA)",
    }}>
      {/* Header */}
      <div style={{
        borderRadius: "12px 12px 0 0",
        borderBottom: "1px solid var(--Foundation-neutral-neutral-100, #D4D5D8)",
        background: "var(--Foundation-neutral-neutral-25, #F5F6FA)",
        display: "flex",
        padding: 20,
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "stretch",
        boxSizing: "border-box"
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              style={{ flexShrink: 0 }}
            >
              <path d="M12 12V11C11.4477 11 11 11.4477 11 12H12ZM12.0797 12H13.0797C13.0797 11.4477 12.632 11 12.0797 11V12ZM12.0797 12.0721V13.0721C12.632 13.0721 13.0797 12.6244 13.0797 12.0721H12.0797ZM12 12.0721H11C11 12.6244 11.4477 13.0721 12 13.0721V12.0721ZM21 12H20C20 16.4183 16.4183 20 12 20V21V22C17.5228 22 22 17.5228 22 12H21ZM12 21V20C7.58172 20 4 16.4183 4 12H3H2C2 17.5228 6.47715 22 12 22V21ZM3 12H4C4 7.58172 7.58172 4 12 4V3V2C6.47715 2 2 6.47715 2 12H3ZM12 3V4C16.4183 4 20 7.58172 20 12H21H22C22 6.47715 17.5228 2 12 2V3ZM16.5 12H15.5C15.5 13.933 13.933 15.5 12 15.5V16.5V17.5C15.0376 17.5 17.5 15.0376 17.5 12H16.5ZM12 16.5V15.5C10.067 15.5 8.5 13.933 8.5 12H7.5H6.5C6.5 15.0376 8.96243 17.5 12 17.5V16.5ZM7.5 12H8.5C8.5 10.067 10.067 8.5 12 8.5V7.5V6.5C8.96243 6.5 6.5 8.96243 6.5 12H7.5ZM12 7.5V8.5C13.933 8.5 15.5 10.067 15.5 12H16.5H17.5C17.5 8.96243 15.0376 6.5 12 6.5V7.5ZM12 12V13H12.0797V12V11H12V12ZM12.0797 12H11.0797V12.0721H12.0797H13.0797V12H12.0797ZM12.0797 12.0721V11.0721H12V12.0721V13.0721H12.0797V12.0721ZM12 12.0721H13V12H12H11V12.0721H12Z" fill="#464646"/>
            </svg>
            <span style={{ fontSize: 20, fontWeight: 700, color: "#111827", fontFamily: "Inter, sans-serif" }}>{t('overview.teamRevenueTarget')}</span>
          </div>
          <span style={{ fontSize: 16, color: "#4B5563", fontFamily: "Inter, sans-serif" }}>{date}</span>
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "#FFF",
            border: "1px solid #E5E7EB",
            boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            padding: 0,
            flexShrink: 0
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Content */}
      <div style={{
        borderRadius: "0 0 12px 12px",
        background: "var(--Foundation-neutral-neutral-25, #F5F6FA)",
        display: "flex",
        padding: "32px 24px",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 24,
        alignSelf: "stretch",
        boxSizing: "border-box",
        maxHeight: "80vh",
        overflowY: "auto"
      }}>
        {/* Graph & Stats Section */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          alignSelf: "stretch"
        }}>
          {/* Donut Chart */}
          <div style={{ width: 190, height: 190, position: "relative", flexShrink: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Completed', value: percentage, fill: '#00236F' },
                    { name: 'Remaining', value: Math.max(0, 100 - percentage), fill: '#B0BBD2' }
                  ]}
                  innerRadius={70}
                  outerRadius={95}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Centered text */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 40, fontWeight: 700, color: "#FFF", fontFamily: "'Noto Sans', sans-serif", WebkitTextStroke: "1.66px #000", lineHeight: "normal" }}>{percentage}</span>
                <span style={{ fontSize: 26, fontWeight: 700, color: "#FFF", fontFamily: "'Noto Sans', sans-serif", WebkitTextStroke: "1.07px #000", lineHeight: "normal" }}>%</span>
              </div>
              <span style={{ fontSize: 14, color: "#00236F", fontFamily: "Inter, sans-serif", fontWeight: 500 }}>{t('overview.completed')}</span>
            </div>
          </div>

          {/* Stats details */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "16px",
            flex: "1 0 0"
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{
                color: "var(--Foundation-neutral-neutral-950, #141414)",
                fontFamily: "Inter, sans-serif",
                fontSize: "23px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "normal"
              }}>
                {achieved.toLocaleString()} {currency}
              </div>
              <div style={{
                color: "#6B7280",
                fontFamily: "Inter, sans-serif",
                fontSize: "16px",
                fontWeight: 400
              }}>
                /{target.toLocaleString()} {currency}
              </div>
            </div>
          </div>
        </div>

        {/* Member Progress List */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "16px",
          alignSelf: "stretch"
        }}>
          {members.map((member) => {
            const memberPercentage = member.target === 0 ? (member.achieved > 0 ? 100 : 0) : Math.min(100, Math.round((member.achieved / member.target) * 100));

            return (
              <div key={member.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", alignSelf: "stretch", width: "100%" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontSize: 13, color: "#374151", fontFamily: "Inter, sans-serif" }}>{member.name}</span>
                  <span style={{ fontSize: 13, color: "#111827", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                    {member.achieved.toLocaleString()} {currency}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ borderRadius: 4, background: "var(--border-input-enabled, #D8D8D8)", display: "flex", height: 10, width: 80, alignItems: "center", overflow: "hidden" }}>
                    <div style={{ width: `${Math.min(100, memberPercentage)}%`, height: "100%", background: "#00236F" }} />
                  </div>
                  <span style={{ fontSize: 12, color: "#6B7280", fontFamily: "Inter, sans-serif", width: 28 }}>{memberPercentage}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Team_Revenue_Target;
