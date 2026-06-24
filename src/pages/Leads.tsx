import React, { useState, useRef, useEffect } from 'react';
import { Plus, Filter, Sparkles, ChevronDown, ChevronUp, ArrowDownUp } from 'lucide-react';
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
import Delete_Lead from '../components/Leads/Delete_Lead';
// Filter Components
import DateFilter from '../components/Filteration/Date';
import { FollowUp } from '../components/Filteration/FollowUp';
import { Sort } from '../components/Filteration/Sort';
import Source from '../components/Filteration/Source';
import Status from '../components/Filteration/Status';
import Priority from '../components/Filteration/Priority';
import Members_filter from '../components/Filteration_Manager/Members_filter';
import {
  useGetLeadsQuery,
  useDeleteLeadMutation,
  useUpdateLeadMutation,
  Lead,
  useGetLeadStatsQuery
} from '../app/service/crudleads';
import { exportLeadsPDF } from '../utils/exportPdf';

// Reusable overlay for modals
const ModalOverlay = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => (
  <div
    style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 10000,
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
  "Archived",
  "Deal",
];

const STATUS_UI_TO_API: Record<string, string> = {
  "Fresh": "FRESH",
  "Follow up": "FOLLOW_UP",
  "Interested": "INTERESTED",
  "Not interested": "NOT_INTERESTED",
  "Meeting": "MEETING",
  "After meeting followup": "FOLLOW_UP_AFTER_MEETING",
  "Wrong number": "WRONG_NUMBER",
  "No answer": "NO_ANSWER",
  "Deal": "DEAL",
};

const STATUS_API_TO_UI: Record<string, string> = {
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

const COL_HEADERS = [
  "Date",
  "Lead info",
  "Assigned to",
  "Status",
  "Phone number",
  "Message",
  "Priority",
  "Lead Source",
  "Next Followup",
  "Actions"
];

const getPresetDateRange = (preset: string) => {
  const today = new Date();
  let start = new Date();
  let end = new Date();

  switch (preset) {
    case "Today":
      start = today;
      end = today;
      break;
    case "Yesterday":
      start = new Date(today);
      start.setDate(today.getDate() - 1);
      end = new Date(start);
      break;
    case "This week": {
      const day = today.getDay();
      start = new Date(today);
      start.setDate(today.getDate() - day);
      end = new Date(start);
      end.setDate(start.getDate() + 6);
      break;
    }
    case "Last week": {
      const day = today.getDay();
      start = new Date(today);
      start.setDate(today.getDate() - day - 7);
      end = new Date(start);
      end.setDate(start.getDate() + 6);
      break;
    }
    case "This month": {
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      break;
    }
    case "Last month": {
      start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      end = new Date(today.getFullYear(), today.getMonth(), 0);
      break;
    }
    case "This year": {
      start = new Date(today.getFullYear(), 0, 1);
      end = new Date(today.getFullYear(), 11, 31);
      break;
    }
    default:
      break;
  }

  const formatLocalDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return {
    startDate: formatLocalDate(start),
    endDate: formatLocalDate(end)
  };
};

const Leads = () => {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [openActionMenu, setOpenActionMenu] = useState<number | null>(null);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<{ preset?: any; startDate?: string; endDate?: string } | null>(null);
  const [followUpFilter, setFollowUpFilter] = useState<{ preset?: string; startDate?: string; endDate?: string } | null>(null);
  const [sortQuery, setSortQuery] = useState("-created_at");
  const [currentPage, setCurrentPage] = useState(1);

  // Derived filter states
  const dateRange = {
    startDate: dateFilter?.startDate,
    endDate: dateFilter?.endDate
  };
  const followupRange = {
    filterType: followUpFilter?.preset,
    startDate: followUpFilter?.startDate,
    endDate: followUpFilter?.endDate
  };
  const sortOption = sortQuery === "created_at" ? "oldest" :
                     sortQuery === "-created_at" ? "newest" :
                     sortQuery === "name" ? "a-z" :
                     sortQuery === "-name" ? "z-a" : "newest";

  // Filter Dropdowns & Modals
  type ActiveFilter = 'date' | 'status' | 'source' | 'followup' | 'sort' | 'priority' | 'assigned' | null;
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>(null);
  const [selectedAssignedMember, setSelectedAssignedMember] = useState("Assigned to");
  const [hoveredFilter, setHoveredFilter] = useState<string | null>(null);

  // AI Search states
  const [isAISearchOpen, setIsAISearchOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState("");

  // Stats query
  const { data: leadStatsData } = useGetLeadStatsQuery();

  // Modal States
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [isEditLeadOpen, setIsEditLeadOpen] = useState(false);
  const [isConvertToDealOpen, setIsConvertToDealOpen] = useState(false);
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isStatusTimelineOpen, setIsStatusTimelineOpen] = useState(false);
  
  // Selected Lead state for edits, deletions, conversions
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);

  // Search Debouncing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Mutations
  const [deleteLead] = useDeleteLeadMutation();
  const [updateLead] = useUpdateLeadMutation();

  // RTK Query Parameters
  let sortField = "created_at";
  let sortOrder = "desc";
  if (sortOption === "oldest") {
    sortField = "created_at";
    sortOrder = "asc";
  } else if (sortOption === "a-z") {
    sortField = "name";
    sortOrder = "asc";
  } else if (sortOption === "z-a") {
    sortField = "name";
    sortOrder = "desc";
  }

  const queryParams = {
    page: currentPage,
    limit: 10,
    search: debouncedSearch || undefined,
    status: selectedStatuses.length === 1 ? (STATUS_UI_TO_API[selectedStatuses[0]] || selectedStatuses[0]) : undefined,
    priority: selectedPriorities.length === 1 ? selectedPriorities[0].toUpperCase() : undefined,
    source: selectedSources.length === 1 ? selectedSources[0].toUpperCase() : undefined,
    start_date: dateFilter?.preset ? getPresetDateRange(dateFilter.preset).startDate : (dateFilter?.startDate || undefined),
    end_date: dateFilter?.preset ? getPresetDateRange(dateFilter.preset).endDate : (dateFilter?.endDate || undefined),
    next_follow_up_start: followUpFilter?.startDate || undefined,
    next_follow_up_end: followUpFilter?.endDate || undefined,
    next_follow_up_preset: followUpFilter?.preset || undefined,
  };

  const { data, isLoading, error } = useGetLeadsQuery(queryParams);
  const leadsList = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;

  const openDeleteModal = (
    e: React.MouseEvent,
    lead: Lead
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenActionMenu(null);
    setLeadToDelete(lead);
  };

  const handleDeleteConfirm = async () => {
    if (!leadToDelete) return;
    try {
      await deleteLead(leadToDelete.id).unwrap();
      setLeadToDelete(null);
    } catch (err) {
      console.error("Failed to delete lead:", err);
    }
  };

  const handleConvertToDeal = async (formData: { value: string; city: string; serviceDetails: string }) => {
    if (!activeLead) return;
    try {
      await updateLead({
        id: activeLead.id,
        status: "DEAL",
        body: {
          status: "DEAL",
          value: formData.value,
          city: formData.city,
          service_details: formData.serviceDetails,
        }
      }).unwrap();
      setIsConvertToDealOpen(false);
      setActiveLead(null);
    } catch (err) {
      console.error("Failed to convert lead to deal:", err);
    }
  };

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

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    if (newStatus === "Deal") {
      const leadObj = leadsList.find(l => l.id === leadId);
      if (leadObj) {
        setActiveLead(leadObj);
        setIsConvertToDealOpen(true);
      }
      setOpenDropdown(null);
      return;
    }

    if (newStatus === "Archived") {
      const leadObj = leadsList.find(l => l.id === leadId);
      if (leadObj) {
        setLeadToDelete(leadObj);
      }
      setOpenDropdown(null);
      return;
    }

    const apiStatus = STATUS_UI_TO_API[newStatus] || newStatus;
    try {
      await updateLead({
        id: leadId,
        status: apiStatus,
        body: {}
      }).unwrap();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
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
            onClick={() => {
              const activeFilters: string[] = [];
              if (debouncedSearch) activeFilters.push(`Search: "${debouncedSearch}"`);
              if (selectedStatuses.length > 0) activeFilters.push(`Status: ${selectedStatuses.join(', ')}`);
              if (selectedPriorities.length > 0) activeFilters.push(`Priority: ${selectedPriorities.join(', ')}`);
              if (selectedSources.length > 0) activeFilters.push(`Source: ${selectedSources.join(', ')}`);
              if (dateFilter?.startDate) activeFilters.push(`Date: ${dateFilter.startDate} → ${dateFilter.endDate ?? ''}`);
              if (selectedAssignedMember !== 'Assigned to') activeFilters.push(`Assigned: ${selectedAssignedMember}`);
              exportLeadsPDF(leadsList as any[], activeFilters);
            }}
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
          {isAISearchOpen ? (
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
                background: "#EDEFF2",
                width: 406,
                boxSizing: "border-box",
                opacity: 1,
              }}
            >
              <input
                type="text"
                placeholder="Describe what you want..."
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                style={{
                  border: "none",
                  background: "transparent",
                  outline: "none",
                  flex: 1,
                  fontFamily: "Inter, sans-serif",
                  fontSize: 16,
                  fontWeight: 400,
                  color: "var(--Foundation-neutral-neutral-800, #464646)",
                }}
              />
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--Foundation-neutral-neutral-800, #464646)",
                  whiteSpace: "nowrap",
                  marginRight: 4,
                  userSelect: "none"
                }}
              >
                (0/5) AI limit
              </span>
              <svg
                onClick={() => setIsAISearchOpen(false)}
                xmlns="http://www.w3.org/2000/svg"
                width="19.2"
                height="19.2"
                viewBox="0 0 20 20"
                fill="none"
                style={{ cursor: "pointer", flexShrink: 0 }}
              >
                <path d="M12.4235 0L14.2538 4.94621L19.2 6.77647L14.2538 8.60673L12.4235 13.5529L10.5933 8.60673L5.64706 6.77647L10.5933 4.94621L12.4235 0Z" fill="var(--Foundation-brand-brand-500, #00236F)"/>
                <path d="M3.95294 11.2941L5.55177 13.6482L7.90588 15.2471L5.55177 16.8459L3.95294 19.2L2.35411 16.8459L0 15.2471L2.35411 13.6482L3.95294 11.2941Z" fill="var(--Foundation-brand-brand-500, #00236F)"/>
              </svg>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                border: searchQuery ? "1px solid var(--Foundation-brand-brand-500, #00236F)" : "1px solid rgba(212, 213, 216, 1)",
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
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
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
              <img
                src={starsIcon}
                alt="stars"
                width={24}
                height={24}
                style={{ cursor: "pointer" }}
                onClick={() => setIsAISearchOpen(true)}
              />
            </div>
          )}

          {/* Date */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setActiveFilter(activeFilter === 'date' ? null : 'date')}
              onMouseEnter={() => setHoveredFilter('date')}
              onMouseLeave={() => setHoveredFilter(null)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #D4D5D8",
                borderRadius: 12,
                padding: "0 12px",
                height: 40,
                width: 88,
                gap: 8,
                background: (hoveredFilter === 'date' || dateFilter || activeFilter === 'date') ? "#E6E9F1" : "transparent",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                color: "#4B5563",
                boxSizing: "border-box",
                flexShrink: 0,
              }}
            >
              Date
              {dateFilter ? (
                <div style={{
                  background: "#B0BBD2",
                  width: 20,
                  height: 22,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 2,
                  boxSizing: "border-box",
                  fontSize: 11,
                  color: "#141414",
                  fontWeight: 600,
                }}>
                  1
                </div>
              ) : activeFilter === 'date' ? (
                <ChevronUp size={16} color="#4B5563" />
              ) : (
                <ChevronDown size={16} color="#4B5563" />
              )}
            </button>
            {activeFilter === 'date' && (
              <div style={{ position: "absolute", top: "100%", left: 0, zIndex: 500, marginTop: 4 }}>
                <DateFilter
                  onClose={() => setActiveFilter(null)}
                  onApply={(data) => {
                    setDateFilter(data);
                    setCurrentPage(1);
                    setActiveFilter(null);
                  }}
                  onClear={() => {
                    setDateFilter(null);
                    setCurrentPage(1);
                    setActiveFilter(null);
                  }}
                  initialPreset={dateFilter?.preset}
                  initialStartDate={dateFilter?.startDate}
                  initialEndDate={dateFilter?.endDate}
                  dateCounts={leadStatsData?.data?.date}
                />
              </div>
            )}
          </div>

          {/* Status */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setActiveFilter(activeFilter === 'status' ? null : 'status')}
              onMouseEnter={() => setHoveredFilter('status')}
              onMouseLeave={() => setHoveredFilter(null)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #D4D5D8",
                borderRadius: 12,
                padding: "0 12px",
                height: 40,
                minWidth: 88,
                gap: 8,
                background: (hoveredFilter === 'status' || selectedStatuses.length > 0 || activeFilter === 'status') ? "#E6E9F1" : "transparent",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                color: "#4B5563",
                boxSizing: "border-box",
                flexShrink: 0,
              }}
            >
              Status
              {selectedStatuses.length > 0 ? (
                <div style={{
                  background: "#B0BBD2",
                  width: 20,
                  height: 22,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 2,
                  boxSizing: "border-box",
                  fontSize: 11,
                  color: "#141414",
                  fontWeight: 600,
                }}>
                  {selectedStatuses.length}
                </div>
              ) : activeFilter === 'status' ? (
                <ChevronUp size={16} color="#4B5563" />
              ) : (
                <ChevronDown size={16} color="#4B5563" />
              )}
            </button>
            {activeFilter === 'status' && (
              <div style={{ position: "absolute", top: "100%", left: 0, zIndex: 500, marginTop: 4 }}>
                <Status
                  onApply={(selected) => {
                    setSelectedStatuses(selected);
                    setCurrentPage(1);
                    setActiveFilter(null);
                  }}
                  onClear={() => {
                    setSelectedStatuses([]);
                    setCurrentPage(1);
                    setActiveFilter(null);
                  }}
                  onClose={() => setActiveFilter(null)}
                  initialSelected={selectedStatuses}
                  counts={leadStatsData?.data?.status}
                />
              </div>
            )}
          </div>

          {/* Priority */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setActiveFilter(activeFilter === 'priority' ? null : 'priority')}
              onMouseEnter={() => setHoveredFilter('priority')}
              onMouseLeave={() => setHoveredFilter(null)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #D4D5D8",
                borderRadius: 12,
                padding: "0 12px",
                height: 40,
                minWidth: 88,
                gap: 8,
                background: (hoveredFilter === 'priority' || selectedPriorities.length > 0 || activeFilter === 'priority') ? "#E6E9F1" : "transparent",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                color: "#4B5563",
                boxSizing: "border-box",
                flexShrink: 0,
              }}
            >
              Priority
              {selectedPriorities.length > 0 ? (
                <div style={{
                  background: "#B0BBD2",
                  width: 20,
                  height: 22,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 2,
                  boxSizing: "border-box",
                  fontSize: 11,
                  color: "#141414",
                  fontWeight: 600,
                }}>
                  {selectedPriorities.length}
                </div>
              ) : activeFilter === 'priority' ? (
                <ChevronUp size={16} color="#4B5563" />
              ) : (
                <ChevronDown size={16} color="#4B5563" />
              )}
            </button>
            {activeFilter === 'priority' && (
              <div style={{ position: "absolute", top: "100%", left: 0, zIndex: 500, marginTop: 4 }}>
                <Priority
                  onApply={(selected) => {
                    setSelectedPriorities(selected);
                    setCurrentPage(1);
                    setActiveFilter(null);
                  }}
                  onClear={() => {
                    setSelectedPriorities([]);
                    setCurrentPage(1);
                    setActiveFilter(null);
                  }}
                  onClose={() => setActiveFilter(null)}
                  initialSelected={selectedPriorities}
                  counts={leadStatsData?.data?.priority}
                />
              </div>
            )}
          </div>

          {/* Source */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setActiveFilter(activeFilter === 'source' ? null : 'source')}
              onMouseEnter={() => setHoveredFilter('source')}
              onMouseLeave={() => setHoveredFilter(null)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #D4D5D8",
                borderRadius: 12,
                padding: "0 12px",
                height: 40,
                minWidth: 88,
                gap: 8,
                background: (hoveredFilter === 'source' || selectedSources.length > 0 || activeFilter === 'source') ? "#E6E9F1" : "transparent",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                color: "#4B5563",
                boxSizing: "border-box",
                flexShrink: 0,
              }}
            >
              Source
              {selectedSources.length > 0 ? (
                <div style={{
                  background: "#B0BBD2",
                  width: 20,
                  height: 22,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 2,
                  boxSizing: "border-box",
                  fontSize: 11,
                  color: "#141414",
                  fontWeight: 600,
                }}>
                  {selectedSources.length}
                </div>
              ) : activeFilter === 'source' ? (
                <ChevronUp size={16} color="#4B5563" />
              ) : (
                <ChevronDown size={16} color="#4B5563" />
              )}
            </button>
            {activeFilter === 'source' && (
              <div style={{ position: "absolute", top: "100%", left: 0, zIndex: 500, marginTop: 4 }}>
                <Source
                  onApply={(selected) => {
                    setSelectedSources(selected);
                    setCurrentPage(1);
                    setActiveFilter(null);
                  }}
                  onClear={() => {
                    setSelectedSources([]);
                    setCurrentPage(1);
                    setActiveFilter(null);
                  }}
                  onClose={() => setActiveFilter(null)}
                  initialSelected={selectedSources}
                  counts={leadStatsData?.data?.source}
                />
              </div>
            )}
          </div>

          {/* Followup */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setActiveFilter(activeFilter === 'followup' ? null : 'followup')}
              onMouseEnter={() => setHoveredFilter('followup')}
              onMouseLeave={() => setHoveredFilter(null)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #D4D5D8",
                borderRadius: 12,
                padding: "0 12px",
                height: 40,
                minWidth: 88,
                gap: 8,
                background: (hoveredFilter === 'followup' || followUpFilter || activeFilter === 'followup') ? "#E6E9F1" : "transparent",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                color: "#4B5563",
                boxSizing: "border-box",
                flexShrink: 0,
              }}
            >
              Followup
              {followUpFilter ? (
                <div style={{
                  background: "#B0BBD2",
                  width: 20,
                  height: 22,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 2,
                  boxSizing: "border-box",
                  fontSize: 11,
                  color: "#141414",
                  fontWeight: 600,
                }}>
                  1
                </div>
              ) : activeFilter === 'followup' ? (
                <ChevronUp size={16} color="#4B5563" />
              ) : (
                <ChevronDown size={16} color="#4B5563" />
              )}
            </button>
            {activeFilter === 'followup' && (
              <div style={{ position: "absolute", top: "100%", left: 0, zIndex: 500, marginTop: 4 }}>
                <FollowUp
                  isOpen={true}
                  onClose={() => setActiveFilter(null)}
                  onApply={(data) => {
                    setFollowUpFilter({ preset: data.filterType, startDate: data.startDate, endDate: data.endDate });
                    setCurrentPage(1);
                    setActiveFilter(null);
                  }}
                  onClear={() => {
                    setFollowUpFilter(null);
                    setCurrentPage(1);
                    setActiveFilter(null);
                  }}
                  defaultFilter={followUpFilter?.preset || undefined}
                  defaultStartDate={followUpFilter?.startDate}
                  defaultEndDate={followUpFilter?.endDate}
                  followUpCounts={leadStatsData?.data?.date as any}
                />
              </div>
            )}
          </div>

          {/* Reset Filters */}
          <button
            onClick={() => {
              setDateFilter(null);
              setSelectedStatuses([]);
              setSelectedPriorities([]);
              setSelectedSources([]);
              setFollowUpFilter(null);
              setCurrentPage(1);
              setActiveFilter(null);
            }}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--Foundation-brand-brand-500, #00236F)",
              fontFamily: "Inter",
              fontSize: 16,
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "normal",
              padding: 0,
              whiteSpace: "nowrap",
            }}
          >
            Reset Filters
          </button>
        </div>

        {/* Right group: Sort by */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div className="filter-bar-right" style={{ position: "relative" }}>
            <button
              onClick={() => setActiveFilter(activeFilter === 'sort' ? null : 'sort')}
              onMouseEnter={() => setHoveredFilter('sort')}
              onMouseLeave={() => setHoveredFilter(null)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #D4D5D8",
                borderRadius: 12,
                paddingRight: 12,
                paddingLeft: 12,
                height: 40,
                width: 108,
                gap: 8,
                background: hoveredFilter === 'sort' ? "#E6E9F1" : "transparent",
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
              <div
                onClick={(e) => e.stopPropagation()}
                style={{ position: "absolute", top: "100%", right: 0, zIndex: 500, marginTop: 4 }}
              >
                <Sort
                  isOpen={true}
                  onClose={() => setActiveFilter(null)}
                  onApply={(val) => {
                    let apiSort = "-created_at";
                    if (val === "oldest") apiSort = "created_at";
                    else if (val === "newest") apiSort = "-created_at";
                    else if (val === "a-z") apiSort = "name";
                    else if (val === "z-a") apiSort = "-name";
                    
                    setSortQuery(apiSort);
                    setCurrentPage(1);
                    setActiveFilter(null);
                  }}
                  defaultValue={
                    sortQuery === "created_at" ? "oldest" :
                    sortQuery === "-created_at" ? "newest" :
                    sortQuery === "name" ? "a-z" :
                    sortQuery === "-name" ? "z-a" : "newest"
                  }
                />
              </div>
            )}
          </div>
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
          overflow: "visible",
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
          {isLoading ? (
            <div style={{ padding: 24, textAlign: "center", fontFamily: "Inter, sans-serif", color: "#6B7280" }}>
              Loading leads...
            </div>
          ) : error ? (
            <div style={{ padding: 24, textAlign: "center", fontFamily: "Inter, sans-serif", color: "#EF4444" }}>
              Error loading leads. Please try again.
            </div>
          ) : !leadsList || leadsList.length === 0 ? (
            <div style={{ padding: 24, textAlign: "center", fontFamily: "Inter, sans-serif", color: "#6B7280" }}>
              No leads found.
            </div>
          ) : (
            leadsList
              .filter((lead) => {
                // 1. Assigned member filter
                if (selectedAssignedMember !== "Assigned to") {
                  const assignedName = lead.assigned_to
                    ? `${lead.assigned_to.first_name} ${lead.assigned_to.last_name}`
                    : "Unassigned";
                  if (assignedName !== selectedAssignedMember) return false;
                }

                // 2. Status filter (if multi-selected, or not filtered by server)
                if (selectedStatuses.length > 0) {
                  const uiStatus = STATUS_API_TO_UI[lead.status] || lead.status;
                  if (!selectedStatuses.includes(uiStatus)) return false;
                }

                // 3. Priority filter
                if (selectedPriorities.length > 0) {
                  const priorityLabel = lead.priority
                    ? lead.priority.charAt(0).toUpperCase() + lead.priority.slice(1).toLowerCase()
                    : "Medium";
                  if (!selectedPriorities.includes(priorityLabel)) return false;
                }

                // 4. Source filter
                if (selectedSources.length > 0) {
                  const sourceLabel = lead.source
                    ? lead.source.charAt(0).toUpperCase() + lead.source.slice(1).toLowerCase()
                    : "Organic";
                  if (!selectedSources.includes(sourceLabel) && !selectedSources.includes(lead.source)) return false;
                }


                // 6. Followup filter
                if (followupRange.startDate || followupRange.endDate || followupRange.filterType) {
                  if (!lead.next_follow_up) return false;
                  const followTime = new Date(lead.next_follow_up).getTime();

                  if (followupRange.filterType) {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const tomorrow = new Date(today);
                    tomorrow.setDate(tomorrow.getDate() + 1);

                    const leadDateObj = new Date(lead.next_follow_up);
                    leadDateObj.setHours(0, 0, 0, 0);

                    if (followupRange.filterType.toLowerCase() === 'today') {
                      if (leadDateObj.getTime() !== today.getTime()) return false;
                    } else if (followupRange.filterType.toLowerCase() === 'tomorrow') {
                      if (leadDateObj.getTime() !== tomorrow.getTime()) return false;
                    } else if (followupRange.filterType.toLowerCase() === 'this week') {
                      const endOfWeek = new Date(today);
                      endOfWeek.setDate(endOfWeek.getDate() + (7 - today.getDay()));
                      endOfWeek.setHours(23, 59, 59, 999);
                      if (followTime < today.getTime() || followTime > endOfWeek.getTime()) return false;
                    }
                  }

                  if (followupRange.startDate) {
                    const start = new Date(followupRange.startDate).getTime();
                    if (followTime < start) return false;
                  }
                  if (followupRange.endDate) {
                    const end = new Date(followupRange.endDate + "T23:59:59.999Z").getTime();
                    if (followTime > end) return false;
                  }
                }

                return true;
              })
              .sort((a, b) => {
                if (sortOption === "newest") {
                  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                } else if (sortOption === "oldest") {
                  return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                } else if (sortOption === "a-z") {
                  return a.name.localeCompare(b.name);
                } else if (sortOption === "z-a") {
                  return b.name.localeCompare(a.name);
                }
                return 0;
              })
              .map((lead, index) => {
                return (
                  <div
                    key={lead.id}
                    className="responsive-table-row"
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      padding: "16px 12px",
                      boxSizing: "border-box",
                      height: 72,
                      borderBottom: index < leadsList.length - 1 ? "1px solid rgba(237, 239, 242, 1)" : "none",
                      justifyContent: "space-between",
                    }}
                  >
                    {/* Date */}
                    <div style={{ width: 70, flexShrink: 0, fontFamily: "Inter, sans-serif", fontSize: 13, color: "#4B5563" }}>
                      {lead.created_at ? new Date(lead.created_at).toLocaleDateString("en-GB") : "N/A"}
                    </div>
                    {/* Lead info */}
                    <div style={{ width: 146, flexShrink: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: "#141414" }}>
                        {lead.name}
                      </span>
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#6B7280" }}>
                        {lead.company_name || "N/A"}
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
                          {lead.assigned_to
                            ? `${lead.assigned_to.first_name} ${lead.assigned_to.last_name}`
                            : "Unassigned"}
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
                        {lead.updated_at ? new Date(lead.updated_at).toLocaleDateString("en-GB") : "N/A"}
                      </span>
                    </div>

                    {/* Status with dropdown */}
                    <div
                      style={{ width: 112, flexShrink: 0, position: "relative" }}
                      ref={(el) => { dropdownRefs.current[index] = el; }}
                    >
                      <div
                        onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "rgba(230, 233, 241, 1)",
                          borderRadius: 12,
                          padding: "4px 12px",
                          height: 26,
                          boxSizing: "border-box",
                          cursor: "pointer",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontWeight: 400,
                            fontSize: 13,
                            lineHeight: "140%",
                            color: "rgba(70, 70, 70, 1)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {STATUS_API_TO_UI[lead.status] || lead.status}
                        </span>
                      </div>

                      {/* Dropdown */}
                      {openDropdown === index && (
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
                              onClick={() => handleStatusChange(lead.id, option)}
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
                                  border: (STATUS_API_TO_UI[lead.status] || lead.status) === option
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
                      {lead.phone ? "*******" + lead.phone.slice(-4) : "N/A"}
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
                          background: lead.priority === "HIGH" || lead.priority === "URGENT" ? "rgba(185, 28, 28, 1)" : lead.priority === "LOW" ? "rgba(30, 41, 59, 0.6)" : "rgba(140, 106, 4, 1)",
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
                          color: lead.priority === "HIGH" || lead.priority === "URGENT" ? "rgba(185, 28, 28, 1)" : lead.priority === "LOW" ? "rgba(30, 41, 59, 0.6)" : "rgba(140, 106, 4, 1)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {lead.priority ? lead.priority.charAt(0).toUpperCase() + lead.priority.slice(1).toLowerCase() : "Medium"}
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
                          height: 24,
                          borderRadius: 12,
                          padding: "4px 12px",
                          boxSizing: "border-box",
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 400,
                          fontSize: 12,
                          color: "#0E7490",
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                        }}
                      >
                        {lead.source?.toUpperCase()}
                      </span>
                    </div>

                    {/* Next Followup */}
                    <div style={{ width: 91, flexShrink: 0, fontFamily: "Inter, sans-serif", fontSize: 13, color: "#4B5563" }}>
                      {lead.next_follow_up ? new Date(lead.next_follow_up).toLocaleDateString("en-GB") : "N/A"}
                    </div>

                    {/* Actions */}
                    <div style={{ width: 132, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, position: "relative" }} ref={(el) => (actionMenuRefs.current[index] = el)}>
                      {/* Call Icon */}
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="19.2" 
                        height="19.2" 
                        viewBox="0 0 22 22" 
                        fill="none" 
                        style={{ cursor: "pointer", flexShrink: 0 }}
                        onClick={() => { if (lead.phone) window.location.href = `tel:${lead.phone}`; }}
                      >
                        <path 
                          d="M11.4711 4.92618C12.671 5.12727 13.7609 5.69399 14.6311 6.56236C15.5012 7.43072 16.0645 8.51846 16.2706 9.71589M11.6543 1.00024C13.7884 1.3613 15.7348 2.37135 17.2827 3.91155C18.8307 5.45633 19.8382 7.39872 20.2 9.5285M18.533 18.0019C18.533 18.0019 17.3743 19.1399 17.0903 19.4736C16.6278 19.9672 16.0828 20.2002 15.3684 20.2002C15.2997 20.2002 15.2264 20.2002 15.1577 20.1957C13.7975 20.1088 12.5336 19.5787 11.5856 19.1262C8.99344 17.8739 6.71733 16.0961 4.82592 13.8429C3.26424 11.9645 2.22007 10.2278 1.52854 8.36306C1.10263 7.22504 0.946916 6.3384 1.01561 5.50203C1.06141 4.9673 1.26749 4.52397 1.64761 4.14464L3.20929 2.58615C3.43369 2.37591 3.67184 2.26166 3.9054 2.26166C4.19392 2.26166 4.42749 2.43533 4.57404 2.58158C4.57862 2.58615 4.5832 2.59072 4.58778 2.59529C4.86714 2.8558 5.13276 3.12545 5.41212 3.41338C5.55409 3.55963 5.70064 3.70588 5.84719 3.8567L7.09745 5.10441C7.5829 5.58886 7.5829 6.03676 7.09745 6.52121C6.96464 6.65375 6.83641 6.78629 6.7036 6.91426C6.3189 7.30731 6.6211 7.00573 6.22267 7.36221C6.21351 7.37135 6.20435 7.37592 6.19977 7.38507C5.80591 7.77811 5.87919 8.16202 5.96162 8.42253C5.9662 8.43624 5.97078 8.44995 5.97536 8.46366C6.30052 9.24976 6.75849 9.99016 7.4546 10.8722L7.45918 10.8768C8.72318 12.4307 10.0559 13.6419 11.526 14.5696C11.7137 14.6885 11.9061 14.7844 12.0893 14.8759C12.2541 14.9581 12.4098 15.0358 12.5426 15.1181C12.561 15.1272 12.5793 15.1409 12.5976 15.1501C12.7533 15.2278 12.8999 15.2643 13.051 15.2643C13.4311 15.2643 13.6693 15.0267 13.7471 14.949L14.6448 14.0531C14.8005 13.8977 15.0478 13.7104 15.3363 13.7104C15.6203 13.7104 15.8538 13.8886 15.9958 14.044C16.0004 14.0486 16.0004 14.0486 16.005 14.0531L18.5284 16.5714C19.0001 17.0376 18.533 18.0019 18.533 18.0019Z" 
                          stroke="var(--Foundation-brand-brand-500, #00236F)" 
                          strokeWidth={2} 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                      </svg>
                      <img src={whatsappIcon} alt="WhatsApp" width={24} height={24} style={{ cursor: "pointer", strokeWidth: 2, stroke: "var(--Foundation-neutral-neutral-800, #464646)" }} />
                      <img src={filePlusIcon} alt="Add File" width={24} height={24} style={{ cursor: "pointer", strokeWidth: 2, stroke: "var(--Foundation-neutral-neutral-800, #464646)" }} onClick={() => { setActiveLead(lead); setIsLeadFormOpen(true); }} />
                      
                      {/* Three dots menu */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ cursor: "pointer", flexShrink: 0 }} onClick={() => setOpenActionMenu(openActionMenu === index ? null : index)}>
                        <path d="M12 3C11.175 3 10.5 3.675 10.5 4.5C10.5 5.325 11.175 6 12 6C12.825 6 13.5 5.325 13.5 4.5C13.5 3.675 12.825 3 12 3ZM12 18C11.175 18 10.5 18.675 10.5 19.5C10.5 20.325 11.175 21 12 21C12.825 21 13.5 20.325 13.5 19.5C13.5 18.675 12.825 18 12 18ZM12 10.5C11.175 10.5 10.5 11.175 10.5 12C10.5 12.825 11.175 13.5 12 13.5C12.825 13.5 13.5 12.825 13.5 12C13.5 11.175 12.825 10.5 12 10.5Z" fill="#464646"/>
                      </svg>
      
                      {/* Dropdown Menu */}
                      {openActionMenu === index && (
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
                          {/* Notes */}
                          <div 
                            style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", cursor: "pointer", width: "100%", boxSizing: "border-box", borderRadius: 8 }}
                            onMouseEnter={(e) => e.currentTarget.style.background = "#F3F4F6"}
                            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                            onClick={() => { setActiveLead(lead); setIsNotesOpen(true); setOpenActionMenu(null); }}
                          >
                            <img src={mailIcon} alt="Notes" width={20} height={20} />
                            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#141414", whiteSpace: "nowrap" }}>Notes</span>
                          </div>

                          {/* Status timeline */}
                          <div 
                            style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", cursor: "pointer", width: "100%", boxSizing: "border-box", borderRadius: 8 }}
                            onMouseEnter={(e) => e.currentTarget.style.background = "#F3F4F6"}
                            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                            onClick={() => { setActiveLead(lead); setIsStatusTimelineOpen(true); setOpenActionMenu(null); }}
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
                            onClick={() => { setActiveLead(lead); setIsConvertToDealOpen(true); setOpenActionMenu(null); }}
                          >
                            <img src={coinIcon} alt="Convert to deal" width={20} height={20} />
                            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#141414", whiteSpace: "nowrap" }}>Convert to deal</span>
                          </div>

                          {/* Edit info */}
                          <div 
                            style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", cursor: "pointer", width: "100%", boxSizing: "border-box", borderRadius: 8 }}
                            onMouseEnter={(e) => e.currentTarget.style.background = "#F3F4F6"}
                            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                            onClick={() => { setActiveLead(lead); setIsEditLeadOpen(true); setOpenActionMenu(null); }}
                          >
                            <img src={editIcon} alt="Edit info" width={20} height={20} />
                            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#141414", whiteSpace: "nowrap" }}>Edit info</span>
                          </div>

                          {/* Delete */}
                          <div 
                            style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", cursor: "pointer", width: "100%", boxSizing: "border-box", borderRadius: 8 }}
                            onMouseEnter={(e) => e.currentTarget.style.background = "#FEF2F2"}
                            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                            onClick={(e) => openDeleteModal(e, lead)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                              <path d="M4 6.17647H20M10 16.7647V10.4118M14 16.7647V10.4118M16 21H8C6.89543 21 6 20.0519 6 18.8824V7.23529C6 6.65052 6.44772 6.17647 7 6.17647H17C17.5523 6.17647 18 6.65052 18 7.23529V18.8824C18 20.0519 17.1046 21 16 21ZM10 6.17647H14C14.5523 6.17647 15 5.70242 15 5.11765V4.05882C15 3.47405 14.5523 3 14 3H10C9.44772 3 9 3.47405 9 4.05882V5.11765C9 5.70242 9.44772 6.17647 10 6.17647Z" stroke="#A80D0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span style={{
                              color: "var(--Foundation-error-red-700, #A80D0B)",
                              fontFamily: "Inter, sans-serif",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 400,
                              lineHeight: "normal",
                              whiteSpace: "nowrap"
                            }}>Archive</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
          )}
        </div>
      </div>

      {/* ── Pagination ── */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>

      {/* ── Modals ── */}
      {isAddLeadOpen && (
        <ModalOverlay onClose={() => setIsAddLeadOpen(false)}>
          <Add_new_lead onClose={() => setIsAddLeadOpen(false)} />
        </ModalOverlay>
      )}
      {isEditLeadOpen && activeLead && (
        <ModalOverlay onClose={() => { setIsEditLeadOpen(false); setActiveLead(null); }}>
          <Edit_lead_info 
            leadsName={activeLead.name}
            initialData={{
              id: activeLead.id,
              leadName: activeLead.name,
              companyName: activeLead.company_name || "",
              phoneNumber: activeLead.phone,
              nextFollowup: activeLead.next_follow_up ? activeLead.next_follow_up.split('T')[0] : "",
            }}
            onClose={() => { setIsEditLeadOpen(false); setActiveLead(null); }} 
          />
        </ModalOverlay>
      )}
      {isConvertToDealOpen && activeLead && (
        <ModalOverlay onClose={() => { setIsConvertToDealOpen(false); setActiveLead(null); }}>
          <Convert_to_deal 
            leadId={activeLead.id}
            leadName={activeLead.name}
            companyName={activeLead.company_name || ""}
            onClose={() => { setIsConvertToDealOpen(false); setActiveLead(null); }} 
            onConvert={handleConvertToDeal}
          />
        </ModalOverlay>
      )}
      {isLeadFormOpen && activeLead && (
        <ModalOverlay onClose={() => { setIsLeadFormOpen(false); setActiveLead(null); }}>
          <Lead_form
            leadId={activeLead.id}
            leadsName={activeLead.name}
            onClose={() => { setIsLeadFormOpen(false); setActiveLead(null); }}
          />
        </ModalOverlay>
      )}
      {isNotesOpen && activeLead && (
        <ModalOverlay onClose={() => { setIsNotesOpen(false); setActiveLead(null); }}>
          <Notes leadId={activeLead.id} onClose={() => { setIsNotesOpen(false); setActiveLead(null); }} />
        </ModalOverlay>
      )}
      {isMessagesOpen && (
        <ModalOverlay onClose={() => setIsMessagesOpen(false)}>
          <Leads_messages onClose={() => setIsMessagesOpen(false)} />
        </ModalOverlay>
      )}
      {isStatusTimelineOpen && activeLead && (
        <ModalOverlay onClose={() => { setIsStatusTimelineOpen(false); setActiveLead(null); }}>
          <StatusTimeline
            leadId={activeLead.id}
            leadName={activeLead.name}
            onClose={() => { setIsStatusTimelineOpen(false); setActiveLead(null); }}
          />
        </ModalOverlay>
      )}
      {leadToDelete && (
        <ModalOverlay onClose={() => setLeadToDelete(null)}>
          <Delete_Lead
            leadName={leadToDelete.name}
            leadDate={new Date(leadToDelete.created_at).toLocaleDateString("en-GB")}
            onClose={() => setLeadToDelete(null)}
            onConfirm={handleDeleteConfirm}
          />
        </ModalOverlay>
      )}

    </div>
  );
};

export default Leads;