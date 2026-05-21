import React, { useState, useRef, useEffect } from 'react';
import { Plus, Filter, Sparkles, ChevronDown, ArrowDownUp } from 'lucide-react';
import '../styles/tables-mobile.css';
import whatsappIcon from '../assets/ic_baseline-whatsapp.svg';
import filePlusIcon from '../assets/file-plus-01.svg';
import editIcon from '../assets/edit-contained.svg';
import coinIcon from '../assets/coin-unbroken.svg';
import mailIcon from '../assets/message-text-02 (1).svg';
import mail04Icon from '../assets/mail-04.svg';
import starsIcon from '../assets/stars.svg';
import Pagination from '../components/Pagination';
import filterIcon from '../assets/filter.svg';
// Modals
import Add_new_lead from '../components/Leads/Add_new_lead';
import Edit_lead_info from '../components/Leads/Edit_lead_info';
import Convert_to_deal from '../components/Leads/Convert_to_deal';
import Lead_form from '../components/Leads/Lead_form';
import Notes from '../components/Deals/Notes';
import Leads_messages from '../components/Leads/Leads_messages';
import StatusTimeline from '../components/Leads/StatusTimeline';
// Filter Components
import DateFilter from '../components/Filteration/Date';
import { FollowUp } from '../components/Filteration/FollowUp';
import { Sort } from '../components/Filteration/Sort';
import Source from '../components/Filteration/Source';
import Status from '../components/Filteration/Status';
import Priority from '../components/Filteration/Priority';
import Members_filter from '../components/Filteration_Manager/Members_filter';

// Reusable overlay for modals
const ModalOverlay = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => (
  <div
    style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 9999,
      display: "flex", alignItems: "center", justifyContent: "center"
    }}
    onClick={onClose}
  >
    <div onClick={(e) => e.stopPropagation()}>{children}</div>
  </div>
);

const STATUS_OPTIONS = [
  "Fresh",
  "Follow up",
  "Interested",
  "Not interested",
  "Meeting",
  "After meeting followup",
  "Wrong number",
  "No answer",
];

const INITIAL_LEADS = [
  { date: "04/11/2026", name: "John Dorghamasadsad", company: "Elshayeeb inc.", status: "After meeting follow up", phone: "+201121504065", priority: "Medium", source: "Website", followup: "25/12/2026", assignedTo: "Mohammed Abdellah", assignDate: "12/8/2026" },
  { date: "04/11/2026", name: "John Dorghamasadsad", company: "Elshayeeb inc.", status: "After meeting follow up", phone: "+201121504065", priority: "Medium", source: "Ads", followup: "25/12/2026", assignedTo: "Rowayda Ashraf", assignDate: "14/8/2026" },
  { date: "04/11/2026", name: "John Dorghamasadsad", company: "Elshayeeb inc.", status: "After meeting follow up", phone: "+201121504065", priority: "Medium", source: "Referral", followup: "25/12/2026", assignedTo: "Hany Gweid", assignDate: "15/8/2026" },
  { date: "04/11/2026", name: "John Dorghamasadsad", company: "Elshayeeb inc.", status: "After meeting follow up", phone: "+201121504065", priority: "Medium", source: "Organic", followup: "25/12/2026", assignedTo: "Mansour Elsayed", assignDate: "18/8/2026" },
  { date: "04/11/2026", name: "John Dorghamasadsad", company: "Elshayeeb inc.", status: "After meeting follow up", phone: "+201121504065", priority: "Medium", source: "Website", followup: "25/12/2026", assignedTo: "Ahmed Hassan", assignDate: "20/8/2026" },
  { date: "04/11/2026", name: "John Dorghamasadsad", company: "Elshayeeb inc.", status: "After meeting follow up", phone: "+201121504065", priority: "Medium", source: "Website", followup: "25/12/2026", assignedTo: "Omar Khaled", assignDate: "22/8/2026" },
  { date: "04/11/2026", name: "John Dorghamasadsad", company: "Elshayeeb inc.", status: "After meeting follow up", phone: "+201121504065", priority: "Medium", source: "Website", followup: "25/12/2026", assignedTo: "Mahmoud Abdelmawgoud", assignDate: "24/8/2026" },
  { date: "04/11/2026", name: "John Dorghamasadsad", company: "Elshayeeb inc.", status: "After meeting follow up", phone: "+201121504065", priority: "Medium", source: "Website", followup: "25/12/2026", assignedTo: "Mohammed Abdellah", assignDate: "12/8/2026" },
];

const COL_HEADERS = ["Date", "Lead info", "Assigned to", "Status", "Phone number", "Message", "Priority", "Lead Source", "Next Followup", "Actions"];

const Leads = () => {
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [openActionMenu, setOpenActionMenu] = useState<number | null>(null);
  
  // Filter Dropdowns & Modals
  type ActiveFilter = 'date' | 'status' | 'source' | 'followup' | 'sort' | 'priority' | 'assigned' | null;
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>(null);
  const [selectedAssignedMember, setSelectedAssignedMember] = useState("Assigned to");

  // Modal States
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [isEditLeadOpen, setIsEditLeadOpen] = useState(false);
  const [isConvertToDealOpen, setIsConvertToDealOpen] = useState(false);
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isStatusTimelineOpen, setIsStatusTimelineOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([]);
  const actionMenuRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (openDropdown !== null) {
        const ref = dropdownRefs.current[openDropdown];
        if (ref && !ref.contains(e.target as Node)) {
          setOpenDropdown(null);
        }
      }
      if (openActionMenu !== null) {
        const ref = actionMenuRefs.current[openActionMenu];
        if (ref && !ref.contains(e.target as Node)) {
          setOpenActionMenu(null);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown, openActionMenu]);

  const handleStatusChange = (leadIndex: number, newStatus: string) => {
    setLeads((prev) =>
      prev.map((lead, i) => (i === leadIndex ? { ...lead, status: newStatus } : lead))
    );
    setOpenDropdown(null);
  };

  return (
    <div style={{ width: "100%", paddingBottom: 24, paddingTop: 8 }}>
      {/* ── Header ── */}
      <div
        className="page-header"
        style={{
          width: "100%",
          height: 56,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            fontSize: 33,
            lineHeight: "100%",
            color: "rgba(0, 35, 111, 1)",
            width: 98,
            height: 40,
            display: "flex",
            alignItems: "center",
          }}
        >
          Leads
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={() => setIsAddLeadOpen(true)}
            style={{
              background: "rgba(0, 35, 111, 1)",
              width: 154,
              height: 48,
              borderRadius: 12,
              padding: "8px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              border: "none",
              color: "#fff",
              fontFamily: "Inter, sans-serif",
              fontSize: 16,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            <Plus size={20} color="#fff" />
            Add Lead
          </button>
          <button
            style={{
              borderRadius: 12,
              border: "1px solid var(--Foundation-brand-brand-500, #00236F)",
              display: "flex",
              height: 48,
              padding: "8px 24px",
              justifyContent: "center",
              alignItems: "center",
              gap: 8,
              background: "transparent",
              color: "#00236F",
              fontFamily: "Inter, sans-serif",
              fontSize: 16,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3.3335 16.9856C3.67075 17.315 4.12817 17.5 4.60512 17.5H15.3952C15.8722 17.5 16.3296 17.315 16.6668 16.9856M10.0012 2.5V12.4521M5.89066 8.64941L10.0012 12.4521L14.1117 8.64941" stroke="#00236F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Export Leads
          </button>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div
        className="filter-bar"
        style={{
          marginTop: 24,
          width: "100%",
          height: 64,
          background: "rgba(237, 239, 242, 1)",
          borderRadius: 12,
          padding: "12px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxSizing: "border-box",
        }}
      >
        <div className="filter-bar-left" style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              border: "1px solid rgba(212, 213, 216, 1)",
              borderRadius: 12,
              padding: "8px 12px",
              height: 40,
              gap: 8,
              background: "transparent",
              width: 406,
              boxSizing: "border-box",
              opacity: 1,
              transform: "rotate(0deg)",
            }}
          >
            <img src={filterIcon} alt="filter" width={24} height={24} />
            <input
              type="text"
              placeholder="Filter by date, name,..."
              style={{
                border: "none",
                background: "transparent",
                outline: "none",
                flex: 1,
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                color: "#141414",
              }}
            />
            <img src={starsIcon} alt="stars" width={24} height={24} />
          </div>


          {/* Date */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setActiveFilter(activeFilter === 'date' ? null : 'date')}
              style={{
                display: "flex", alignItems: "center", border: "1px solid rgba(212, 213, 216, 1)",
                borderRadius: 12, padding: "0 12px", height: 40, gap: 8,
                background: activeFilter === 'date' ? "rgba(0, 35, 111, 0.06)" : "transparent",
                cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: 14, color: "#4B5563", boxSizing: "border-box",
              }}
            >
              Date
              <ChevronDown size={16} color="#4B5563" />
            </button>
            {activeFilter === 'date' && (
              <div style={{ position: "absolute", top: "100%", left: 0, zIndex: 500, marginTop: 4 }}>
                <DateFilter onClose={() => setActiveFilter(null)} onApply={() => setActiveFilter(null)} />
              </div>
            )}
          </div>

          {/* Status */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setActiveFilter(activeFilter === 'status' ? null : 'status')}
              style={{
                display: "flex", alignItems: "center", border: "1px solid rgba(212, 213, 216, 1)",
                borderRadius: 12, padding: "0 12px", height: 40, gap: 8,
                background: activeFilter === 'status' ? "rgba(0, 35, 111, 0.06)" : "transparent",
                cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: 14, color: "#4B5563", boxSizing: "border-box",
              }}
            >
              Status
              <ChevronDown size={16} color="#4B5563" />
            </button>
            {activeFilter === 'status' && (
              <div style={{ position: "absolute", top: "100%", left: 0, zIndex: 500, marginTop: 4 }}>
                <Status onApply={() => setActiveFilter(null)} onClear={() => setActiveFilter(null)} onClose={() => setActiveFilter(null)} />
              </div>
            )}
          </div>

          {/* Priority */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setActiveFilter(activeFilter === 'priority' ? null : 'priority')}
              style={{
                display: "flex", alignItems: "center", border: "1px solid rgba(212, 213, 216, 1)",
                borderRadius: 12, padding: "0 12px", height: 40, gap: 8,
                background: activeFilter === 'priority' ? "rgba(0, 35, 111, 0.06)" : "transparent",
                cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: 14, color: "#4B5563", boxSizing: "border-box",
              }}
            >
              Priority
              <ChevronDown size={16} color="#4B5563" />
            </button>
            {activeFilter === 'priority' && (
              <div style={{ position: "absolute", top: "100%", left: 0, zIndex: 500, marginTop: 4 }}>
                <Priority onApply={() => setActiveFilter(null)} onClear={() => setActiveFilter(null)} onClose={() => setActiveFilter(null)} />
              </div>
            )}
          </div>

          {/* Source */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setActiveFilter(activeFilter === 'source' ? null : 'source')}
              style={{
                display: "flex", alignItems: "center", border: "1px solid rgba(212, 213, 216, 1)",
                borderRadius: 12, padding: "0 12px", height: 40, gap: 8,
                background: activeFilter === 'source' ? "rgba(0, 35, 111, 0.06)" : "transparent",
                cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: 14, color: "#4B5563", boxSizing: "border-box",
              }}
            >
              Source
              <ChevronDown size={16} color="#4B5563" />
            </button>
            {activeFilter === 'source' && (
              <div style={{ position: "absolute", top: "100%", left: 0, zIndex: 500, marginTop: 4 }}>
                <Source onApply={() => setActiveFilter(null)} onClear={() => setActiveFilter(null)} onClose={() => setActiveFilter(null)} />
              </div>
            )}
          </div>

          {/* Followup */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setActiveFilter(activeFilter === 'followup' ? null : 'followup')}
              style={{
                display: "flex", alignItems: "center", border: "1px solid rgba(212, 213, 216, 1)",
                borderRadius: 12, padding: "0 12px", height: 40, gap: 8,
                background: activeFilter === 'followup' ? "rgba(0, 35, 111, 0.06)" : "transparent",
                cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: 14, color: "#4B5563", boxSizing: "border-box",
              }}
            >
              Followup
              <ChevronDown size={16} color="#4B5563" />
            </button>
            {activeFilter === 'followup' && (
              <div style={{ position: "absolute", top: "100%", left: 0, zIndex: 500, marginTop: 4 }}>
                <FollowUp isOpen={true} onClose={() => setActiveFilter(null)} onApply={() => setActiveFilter(null)} />
              </div>
            )}
          </div>

          {/* Assigned to Filter */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setActiveFilter(activeFilter === 'assigned' ? null : 'assigned')}
              style={{
                display: "flex", alignItems: "center", border: "1px solid rgba(212, 213, 216, 1)",
                borderRadius: 12, padding: "0 12px", height: 40, gap: 8,
                background: activeFilter === 'assigned' ? "rgba(0, 35, 111, 0.06)" : "transparent",
                cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: 14, color: "#4B5563", boxSizing: "border-box",
              }}
            >
              {selectedAssignedMember}
              <ChevronDown size={16} color="#4B5563" />
            </button>
            {activeFilter === 'assigned' && (
              <div style={{ position: "absolute", top: "100%", left: 0, zIndex: 500, marginTop: 4 }}>
                <Members_filter
                  selectedOption={selectedAssignedMember === "Assigned to" ? "All members" : selectedAssignedMember}
                  onChange={(option) => {
                    setSelectedAssignedMember(option === "All members" ? "Assigned to" : option);
                    setActiveFilter(null);
                  }}
                  onClickOutside={() => setActiveFilter(null)}
                />
              </div>
            )}
          </div>
        </div>

        <div className="filter-bar-right" style={{ position: "relative" }}>
          <button
            onClick={() => setActiveFilter(activeFilter === 'sort' ? null : 'sort')}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(212, 213, 216, 1)",
              borderRadius: 12,
              padding: "0 12px",
              height: 40,
              width: 108,
              gap: 8,
              background: activeFilter === 'sort' ? "rgba(0, 35, 111, 0.06)" : "transparent",
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              fontSize: 14,
              color: "#4B5563",
              boxSizing: "border-box",
            }}
          >
            Sort by
            <ArrowDownUp size={16} color="#4B5563" />
          </button>
          {activeFilter === 'sort' && (
            <div style={{ position: "absolute", top: "100%", right: 0, zIndex: 500, marginTop: 4 }}>
              <Sort isOpen={true} onClose={() => setActiveFilter(null)} onApply={() => setActiveFilter(null)} />
            </div>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      <div
        className="responsive-table-container"
        style={{
          marginTop: 16,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid rgba(212, 213, 216, 1)",
        }}
      >
        {/* Table Header */}
        <div
          className="responsive-table-row"
          style={{
            width: "100%",
            height: 48,
            background: "rgba(212, 213, 216, 1)",
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
            boxSizing: "border-box",
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            justifyContent: "space-between",
          }}
        >
          {COL_HEADERS.map((col) => {
            const widthMap: Record<string, number> = {
              "Date": 70,
              "Lead info": 146,
              "Assigned to": 162,
              "Status": 112,
              "Phone number": 99,
              "Message": 58,
              "Priority": 60,
              "Lead Source": 79,
              "Next Followup": 91,
              "Actions": 132,
            };
            return (
              <div
                key={col}
                style={{
                  width: widthMap[col] || 100,
                  flexShrink: 0,
                  fontFamily: "Inter, sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#141414",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: col === "Actions" ? "flex" : "block",
                  justifyContent: col === "Actions" ? "center" : "flex-start",
                }}
              >
                {col}
              </div>
            );
          })}
        </div>

        {/* Table Body */}
        <div style={{ width: "100%", background: "#fff" }}>
          {leads
            .filter((lead) => {
              if (selectedAssignedMember !== "Assigned to") {
                return lead.assignedTo === selectedAssignedMember;
              }
              return true;
            })
            .map((lead, index) => {
              const originalIndex = leads.indexOf(lead);
              return (
                <div
                  key={index}
              className="responsive-table-row"
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                padding: "16px 12px",
                boxSizing: "border-box",
                height: 72,
                borderBottom: index < leads.length - 1 ? "1px solid rgba(237, 239, 242, 1)" : "none",
                justifyContent: "space-between",
              }}
            >
              {/* Date */}
              <div style={{ width: 70, flexShrink: 0, fontFamily: "Inter, sans-serif", fontSize: 13, color: "#4B5563" }}>
                {lead.date}
              </div>
              {/* Lead info */}
              <div style={{ width: 146, flexShrink: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: "#141414" }}>
                  {lead.name}
                </span>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#6B7280" }}>
                  {lead.company}
                </span>
              </div>

              {/* Assigned to */}
              <div style={{
                display: "flex",
                width: 162,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                gap: 8,
                flexShrink: 0
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
                  <span style={{
                    color: "var(--Foundation-neutral-neutral-800, #464646)",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "13px",
                    fontWeight: 400,
                    lineHeight: "140%"
                  }}>
                    {lead.assignedTo || "Mohammed Abdellah"}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M7 10L12.0008 14.58L17 10" stroke="#141414" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span style={{
                  color: "var(--Foundation-neutral-neutral-600, #747474)",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "13px",
                  fontWeight: 400,
                  lineHeight: "140%"
                }}>
                  {lead.assignDate || "12/8/2026"}
                </span>
              </div>

              {/* Status with dropdown */}
              <div
                style={{ width: 112, flexShrink: 0, position: "relative" }}
                ref={(el) => { dropdownRefs.current[originalIndex] = el; }}
              >
                <div
                  onClick={() => setOpenDropdown(openDropdown === originalIndex ? null : originalIndex)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(230, 233, 241, 1)",
                    borderRadius: 12,
                    padding: "4px 8px",
                    width: "100%",
                    height: 26,
                    boxSizing: "border-box",
                    cursor: "pointer",
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 400,
                      fontSize: 13,
                      lineHeight: "140%",
                      color: "rgba(70, 70, 70, 1)",
                      flex: 1,
                      height: 18,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      textAlign: "center"
                    }}
                  >
                    {lead.status}
                  </span>
                </div>

                {/* Dropdown */}
                {openDropdown === originalIndex && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 4px)",
                      left: 0,
                      zIndex: 100,
                      background: "rgba(255, 255, 255, 1)",
                      boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.17)",
                      borderRadius: 12,
                      padding: "12px 0",
                      minWidth: 260,
                    }}
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <div
                        key={option}
                        onClick={() => handleStatusChange(originalIndex, option)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "16px 12px",
                          borderBottom: "1px solid var(--Foundation-neutral-neutral-50, #EDEFF2)",
                          alignSelf: "stretch",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLDivElement).style.background = "rgba(237, 239, 242, 1)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLDivElement).style.background = "transparent";
                        }}
                      >
                        {/* Radio circle */}
                        <div
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: "50%",
                            border: lead.status === option
                              ? "5px solid rgba(0, 35, 111, 1)"
                              : "2px solid rgba(180, 180, 180, 1)",
                            boxSizing: "border-box",
                            background: "#fff",
                            flexShrink: 0,
                          }}
                        />
                        <span
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: 14,
                            fontWeight: 400,
                            color: "rgba(70, 70, 70, 1)",
                            flex: 1,
                          }}
                        >
                          {option}
                        </span>
                        
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Phone */}
              <div style={{ width: 99, flexShrink: 0, fontFamily: "Inter, sans-serif", fontStyle: "normal", fontWeight: 400, fontSize: 13, lineHeight: "140%", color: "var(--Foundation-neutral-neutral-800, #464646)" }}>
                {"*******" + lead.phone.slice(-4)}
              </div>

              {/* Message icon */}
              <div style={{ width: 58, flexShrink: 0, display: "flex", alignItems: "center" }}>
                <img src={mail04Icon} alt="Message" width={24} height={24} style={{ cursor: "pointer" }} onClick={() => setIsMessagesOpen(true)} />
              </div>
              {/* Priority */}
              <div style={{ width: 60, flexShrink: 0, display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "rgba(140, 106, 4, 1)",
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    width: 50,
                    height: 18,
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 400,
                    fontSize: 13,
                    lineHeight: "140%",
                    letterSpacing: "0%",
                    color: "rgba(140, 106, 4, 1)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {lead.priority}
                </span>
              </div>

              {/* Lead Source */}
              <div style={{ width: 79, flexShrink: 0, display: "flex", alignItems: "center" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(231, 253, 253, 1)",
                    width: 58,
                    height: 24,
                    borderRadius: 12,
                    padding: 4,
                    gap: 8,
                    boxSizing: "border-box",
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 400,
                    fontSize: 12,
                    color: "#0E7490",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {lead.source}
                </span>
              </div>

              {/* Next Followup */}
              <div style={{ width: 91, flexShrink: 0, fontFamily: "Inter, sans-serif", fontSize: 13, color: "#4B5563" }}>
                {lead.followup}
              </div>

              {/* Actions */}
              <div style={{ width: 132, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, position: "relative" }} ref={(el) => (actionMenuRefs.current[originalIndex] = el)}>
                <img src={whatsappIcon} alt="WhatsApp" width={24} height={24} style={{ cursor: "pointer", strokeWidth: 2, stroke: "var(--Foundation-neutral-neutral-800, #464646)" }} />
                <img src={mailIcon} alt="Email" width={24} height={24} style={{ cursor: "pointer", strokeWidth: 2, stroke: "var(--Foundation-neutral-neutral-800, #464646)" }} onClick={() => setIsNotesOpen(true)} />
                <img src={filePlusIcon} alt="Add File" width={24} height={24} style={{ cursor: "pointer", strokeWidth: 2, stroke: "var(--Foundation-neutral-neutral-800, #464646)" }} onClick={() => setIsLeadFormOpen(true)} />
                
                {/* Three dots menu */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ cursor: "pointer", flexShrink: 0 }} onClick={() => setOpenActionMenu(openActionMenu === originalIndex ? null : originalIndex)}>
                  <path d="M12 3C11.175 3 10.5 3.675 10.5 4.5C10.5 5.325 11.175 6 12 6C12.825 6 13.5 5.325 13.5 4.5C13.5 3.675 12.825 3 12 3ZM12 18C11.175 18 10.5 18.675 10.5 19.5C10.5 20.325 11.175 21 12 21C12.825 21 13.5 20.325 13.5 19.5C13.5 18.675 12.825 18 12 18ZM12 10.5C11.175 10.5 10.5 11.175 10.5 12C10.5 12.825 11.175 13.5 12 13.5C12.825 13.5 13.5 12.825 13.5 12C13.5 11.175 12.825 10.5 12 10.5Z" fill="#464646"/>
                </svg>
 
                {/* Dropdown Menu */}
                {openActionMenu === originalIndex && (
                  <div style={{
                    position: "absolute",
                    top: 32,
                    right: 0,
                    zIndex: 10,
                    borderRadius: 12,
                    background: "var(--Foundation-neutral-white, #FFF)",
                    boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.17)",
                    display: "inline-flex",
                    flexDirection: "column",
                    padding: 12,
                    alignItems: "flex-start",
                    gap: 4
                  }}>
                    {/* Status timeline */}
                    <div 
                      style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", cursor: "pointer", width: "100%", boxSizing: "border-box", borderRadius: 8 }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#F3F4F6"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                      onClick={() => { setIsStatusTimelineOpen(true); setOpenActionMenu(null); }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 18 16" fill="none">
                        <path d="M1 7.66608H5L7.04044 1L11.4382 15L12.9903 7.66608H17" stroke="#464646" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#141414", whiteSpace: "nowrap" }}>Status timeline</span>
                    </div>

                    {/* Convert to deal */}
                    <div 
                      style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", cursor: "pointer", width: "100%", boxSizing: "border-box", borderRadius: 8 }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#F3F4F6"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                      onClick={() => { setIsConvertToDealOpen(true); setOpenActionMenu(null); }}
                    >
                      <img src={coinIcon} alt="Convert to deal" width={20} height={20} />
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#141414", whiteSpace: "nowrap" }}>Convert to deal</span>
                    </div>

                    {/* Edit info */}
                    <div 
                      style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", cursor: "pointer", width: "100%", boxSizing: "border-box", borderRadius: 8 }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#F3F4F6"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                      onClick={() => { setIsEditLeadOpen(true); setOpenActionMenu(null); }}
                    >
                      <img src={editIcon} alt="Edit info" width={20} height={20} />
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#141414", whiteSpace: "nowrap" }}>Edit info</span>
                    </div>

                    {/* Delete */}
                    <div 
                      style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", cursor: "pointer", width: "100%", boxSizing: "border-box", borderRadius: 8 }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#F3F4F6"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                      onClick={() => {
                        setLeads(prev => prev.filter((_, idx) => idx !== originalIndex));
                        setOpenActionMenu(null);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                        <path d="M4 6.17647H20M10 16.7647V10.4118M14 16.7647V10.4118M16 21H8C6.89543 21 6 20.0519 6 18.8824V7.23529C6 6.65052 6.44772 6.17647 7 6.17647H17C17.5523 6.17647 18 6.65052 18 7.23529V18.8824C18 20.0519 17.1046 21 16 21ZM10 6.17647H14C14.5523 6.17647 15 5.70242 15 5.11765V4.05882C15 3.47405 14.5523 3 14 3H10C9.44772 3 9 3.47405 9 4.05882V5.11765C9 5.70242 9.44772 6.17647 10 6.17647Z" stroke="#A80D0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span style={{
                        color: "var(--Foundation-error-red-700, #A80D0B)",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "16px",
                        fontWeight: 400,
                        lineHeight: "normal",
                        whiteSpace: "nowrap"
                      }}>Delete</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        </div>
      </div>

      {/* ── Pagination ── */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
        <Pagination currentPage={currentPage} totalPages={4} onPageChange={setCurrentPage} />
      </div>

      {/* ── Modals ── */}
      {isAddLeadOpen && (
        <ModalOverlay onClose={() => setIsAddLeadOpen(false)}>
          <Add_new_lead onClose={() => setIsAddLeadOpen(false)} />
        </ModalOverlay>
      )}
      {isEditLeadOpen && (
        <ModalOverlay onClose={() => setIsEditLeadOpen(false)}>
          <Edit_lead_info onClose={() => setIsEditLeadOpen(false)} />
        </ModalOverlay>
      )}
      {isConvertToDealOpen && (
        <ModalOverlay onClose={() => setIsConvertToDealOpen(false)}>
          <Convert_to_deal onClose={() => setIsConvertToDealOpen(false)} />
        </ModalOverlay>
      )}
      {isLeadFormOpen && (
        <ModalOverlay onClose={() => setIsLeadFormOpen(false)}>
          <Lead_form onClose={() => setIsLeadFormOpen(false)} />
        </ModalOverlay>
      )}
      {isNotesOpen && (
        <ModalOverlay onClose={() => setIsNotesOpen(false)}>
          <Notes onClose={() => setIsNotesOpen(false)} />
        </ModalOverlay>
      )}
      {isMessagesOpen && (
        <ModalOverlay onClose={() => setIsMessagesOpen(false)}>
          <Leads_messages onClose={() => setIsMessagesOpen(false)} />
        </ModalOverlay>
      )}
      {isStatusTimelineOpen && (
        <ModalOverlay onClose={() => setIsStatusTimelineOpen(false)}>
          <StatusTimeline onClose={() => setIsStatusTimelineOpen(false)} leadName="John Dorghamasadsad" />
        </ModalOverlay>
      )}

    </div>
  );
};

export default Leads;