import React from "react";
import closeIcon from "../../assets/x-02.svg";
import "../../styles/leads-modal-mobile.css";
import calendarIcon from "../../assets/calendar-01.svg";
import userIcon from "../../assets/user-profile-01.svg";
import thumbDownIcon from "../../assets/thumb down.svg";
import thumbUpIcon from "../../assets/thumb up.svg";
import meetingIcon from "../../assets/team meeting.svg";
import dealIcon from "../../assets/Deal.svg";
import vectorIcon from "../../assets/Vector.svg";
import { useGetAssignmentHistoryQuery } from "../../app/service/crudAssignment_lead";

interface TimelineEntry {
  status: string;
  date: string;
  person: string;
  icon: string;
  color?: string;
}

interface StatusTimelineProps {
  leadId?: string;
  onClose?: () => void;
  leadName?: string;
  entries?: TimelineEntry[];
}

const DEFAULT_ENTRIES: TimelineEntry[] = [
  { status: "Interested",     date: "20/4/2025", person: "Mohammed Yasser", icon: vectorIcon },
  { status: "Not interested", date: "20/4/2025", person: "Mohammed Yasser", icon: thumbDownIcon },
  { status: "Interested",     date: "20/4/2025", person: "Mohammed Yasser", icon: thumbUpIcon },
  { status: "Meeting",        date: "20/4/2025", person: "Mohammed Yasser", icon: meetingIcon },
  { status: "Deal",           date: "20/4/2025", person: "Mohammed Yasser", icon: dealIcon, color: "#00236F" },
];

const StatusTimeline: React.FC<StatusTimelineProps> = ({
  leadId,
  onClose,
  leadName = "leads name",
  entries = DEFAULT_ENTRIES,
}) => {
  const { data: historyResponse, isLoading } = useGetAssignmentHistoryQuery(leadId || "", { skip: !leadId });
  const historyList = historyResponse?.data || [];

  const formattedEntries: TimelineEntry[] = historyList.map((assignment) => {
    const dateObj = new Date(assignment.assigned_at);
    const dateStr = dateObj.toLocaleDateString('en-GB') + ' , ' + dateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    
    const statusMap: Record<string, string> = {
      "FRESH": "Fresh",
      "FOLLOW_UP": "Follow up",
      "INTERESTED": "Interested",
      "NOT_INTERESTED": "Not interested",
      "MEETING": "Meeting",
      "FOLLOW_UP_AFTER_MEETING": "After meeting followup",
      "WRONG_NUMBER": "Wrong number",
      "NO_ANSWER": "No answer",
      "DEAL": "Deal",
    };
    const statusText = statusMap[assignment.status] || assignment.status;

    let icon = vectorIcon;
    if (assignment.status === 'NOT_INTERESTED' || assignment.status === 'WRONG_NUMBER' || assignment.status === 'NO_ANSWER') {
      icon = thumbDownIcon;
    } else if (assignment.status === 'INTERESTED') {
      icon = thumbUpIcon;
    } else if (assignment.status === 'MEETING') {
      icon = meetingIcon;
    } else if (assignment.status === 'DEAL') {
      icon = dealIcon;
    }

    const salesName = assignment.sales ? `${assignment.sales.first_name} ${assignment.sales.last_name}` : 'Unassigned';
    return {
      status: `Assigned to ${salesName} (${statusText})`,
      date: dateStr,
      person: `${assignment.assigned_by_user.first_name} ${assignment.assigned_by_user.last_name}`,
      icon: icon,
      color: assignment.status === 'DEAL' ? '#00236F' : undefined,
    };
  });

  const timelineEntries = leadId && historyList.length > 0 ? formattedEntries : entries;
  return (
    <div
      className="leads-modal-root"
      style={{
        width: 462,
        height: 618,
        background: "#F5F6FA",
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.12)",
        overflow: "hidden",
      }}
    >
      {/* ── Header ── */}
      <div
        className="leads-modal-header"
        style={{
          width: 462,
          height: 91,
          background: "#F5F6FA",
          borderBottom: "1px solid #D4D5D8",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          padding: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxSizing: "border-box",
          flexShrink: 0,
        }}
      >
        {/* Title + subtitle */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Status Timeline icon (waveform SVG) */}
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="16" viewBox="0 0 18 16" fill="none">
              <path d="M1 7.66608H5L7.04044 1L11.4382 15L12.9903 7.66608H17" stroke="#141414" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                fontSize: 16,
                color: "#141414",
              }}
            >
              Status Timeline
            </span>
          </div>
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              fontSize: 13,
              color: "#6B7280",
              paddingLeft: 26,
            }}
          >
            for "{leadName}"
          </span>
        </div>

        {/* Close button */}
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
            flexShrink: 0,
          }}
        >
          <img src={closeIcon} alt="Close" width={14} height={14} />
        </button>
      </div>

      {/* ── Body ── */}
      <div
        className="leads-modal-body"
        style={{
          width: 462,
          height: 527,
          background: "#F5F6FA",
          borderBottomRightRadius: 12,
          borderBottomLeftRadius: 12,
          padding: "24px 20px",
          boxSizing: "border-box",
          overflowY: "auto",
        }}
      >
        {isLoading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", fontFamily: "Inter, sans-serif", color: "#6B7280" }}>
            Loading timeline...
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 0, position: "relative" }}>
            {timelineEntries.map((entry, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                {/* Icon column + connecting dashed line */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    flexShrink: 0,
                    width: 48,
                  }}
                >
                  {/* Icon circle */}
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: "#EDEFF2",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      paddingRight: 0,
                    }}
                  >
                    <img
                      src={entry.icon}
                      alt={entry.status}
                      style={{
                        width: 24,
                        height: 24,
                        transform: "rotate(-90deg)",
                        paddingRight: 0,
                      }}
                    />
                  </div>
                  {/* Dashed connector line (hide on last item) */}
                  {idx < timelineEntries.length - 1 && (
                    <div
                      style={{
                        width: 0,
                        flexGrow: 1,
                        minHeight: 28,
                        borderLeft: "2px dashed #D4D5D8",
                        margin: "4px 0",
                      }}
                    />
                  )}
                </div>

                {/* Content */}
                <div style={{ paddingBottom: idx < timelineEntries.length - 1 ? 28 : 0 }}>
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 600,
                      fontSize: 14,
                      color: entry.color ?? "#141414",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    {entry.status}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <img src={calendarIcon} alt="Date" width={16} height={16} />
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#6B7280" }}>
                      {entry.date}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <img src={userIcon} alt="Person" width={16} height={16} />
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#6B7280" }}>
                      {entry.person}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusTimeline;
