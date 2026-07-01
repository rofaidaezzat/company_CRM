import { ArrowDownUp, ChevronDown, ChevronUp } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import filterIcon from '../assets/filter.svg';
import starsIcon from '../assets/stars.svg';
import { useTranslation } from "../context/LanguageContext";
// Filter Components
import DateFilter from '../components/Filteration/Date';
import { FollowUp } from '../components/Filteration/FollowUp';
import { Sort } from '../components/Filteration_Manager/Sort';
import Source from '../components/Filteration/Source';
import Priority from '../components/Filteration/Priority';
import Pagination from '../components/Pagination';
import { Pause_Account } from '../components/Sales/Pause_Account';
import { Add_New_Sales } from '../components/Sales/Add_New_Sales';
import { Action_Modal } from '../components/Sales/Action_Modal';
import Rank from '../components/Filteration_Manager/Rank';
import Leads_status from '../components/Filteration_Manager/Leads_status';
import LeadsFilter from '../components/Filteration_Manager/Leads';
import StatusFilter from '../components/Filteration/Status';
import Deals from '../components/Filteration_Manager/Deals';
import Target from '../components/Filteration_Manager/Target';
import Add_New_Task from '../components/Sales/Add_New_Task';
import Edit_Target from '../components/Sales/Edit_Target';
import Sales_Tasks from '../components/Sales/Sales_Tasks';
import { Sales_Card } from '../components/Sales/Sales_Card';
import { Edit_Sales_Role } from '../components/Sales/Edit_Sales_Role';
import { View_info } from '../components/Sales/View_info';
import Delete_Sales from '../components/Sales/Delete_Sales';
import { exportSalesPDF } from '../utils/exportPdf';
import '../styles/Sales.css';// Reusable overlay for modals
const ModalOverlay = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => {
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed", top: 0, left: 0,
        width: "100vw", height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 10000,
        overflowY: "auto",
      }}
      onClick={onClose}
    >
      <div
        style={{
          minHeight: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        <div onClick={(e) => e.stopPropagation()}>{children}</div>
      </div>
    </div>
  );
};

const GridIcon = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M6.75 2.25H3C2.58579 2.25 2.25 2.58579 2.25 3V6.75C2.25 7.16421 2.58579 7.5 3 7.5H6.75C7.16421 7.5 7.5 7.16421 7.5 6.75V3C7.5 2.58579 7.16421 2.25 6.75 2.25Z" stroke={active ? "#00236F" : "#747474"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 2.25H11.25C10.8358 2.25 10.5 2.58579 10.5 3V6.75C10.5 7.16421 10.8358 7.5 11.25 7.5H15C15.4142 7.5 15.75 7.16421 15.75 6.75V3C15.75 2.58579 15.4142 2.25 15 2.25Z" stroke={active ? "#00236F" : "#747474"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 10.5H11.25C10.8358 10.5 10.5 10.8358 10.5 11.25V15C10.5 15.4142 10.8358 15.75 11.25 15.75H15C15.4142 15.75 15.75 15.4142 15.75 15V11.25C15.75 10.8358 15.4142 10.5 15 10.5Z" stroke={active ? "#00236F" : "#747474"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.75 10.5H3C2.58579 10.5 2.25 10.8358 2.25 11.25V15C2.25 15.4142 2.58579 15.75 3 15.75H6.75C7.16421 15.75 7.5 15.4142 7.5 15V11.25C7.5 10.8358 7.16421 10.5 6.75 10.5Z" stroke={active ? "#00236F" : "#747474"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ListIcon = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M2.25 9H2.2575" stroke={active ? "#00236F" : "#747474"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2.25 13.5H2.2575" stroke={active ? "#00236F" : "#747474"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2.25 4.5H2.2575" stroke={active ? "#00236F" : "#747474"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 9H15.75" stroke={active ? "#00236F" : "#747474"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 13.5H15.75" stroke={active ? "#00236F" : "#747474"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 4.5H15.75" stroke={active ? "#00236F" : "#747474"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TIME_RANGE_TABS = ['This month', 'Last month', 'Last 3 months', 'Last 6 months', 'Last year', 'Custom range'] as const;
type TimeRangeTab = typeof TIME_RANGE_TABS[number];

type ViewMode = 'grid' | 'list';

const Sales: React.FC = () => {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [activeTab, setActiveTab] = useState<'This month' | 'Last month' | 'This year'>('This month');
  const [currentPage, setCurrentPage] = useState(1);
  const [openActionMenu, setOpenActionMenu] = useState<number | null>(null);
  const [isPauseAccountOpen, setIsPauseAccountOpen] = useState(false);
  const [isInviteNewSalesOpen, setIsInviteNewSalesOpen] = useState(false);
  const [isAddNewTaskOpen, setIsAddNewTaskOpen] = useState(false);
  const [isEditTargetOpen, setIsEditTargetOpen] = useState(false);
  const [isSalesTasksOpen, setIsSalesTasksOpen] = useState(false);
  const [salesToDelete, setSalesToDelete] = useState<{ id: number; name: string; date: string } | null>(null);

  const openDeleteSalesModal = (id: number, name: string, date: string) => {
    setOpenActionMenu(null);
    setSalesToDelete({ id, name, date });
  };

  const [salesListItems, setSalesListItems] = useState([
    { id: 1, name: "Yasser Abdelhameed", phone: "********6535", role: "Sales manager", targetAdj: "Allow", status: "Inactive", lastActive: "2h ago", leads: 888, deals: 444, revenue: "30,000", reports: 20, progress: 30, manager: "Mohammed Abdellah" },
    { id: 2, name: "Yasser Abdelhameed", phone: "********6535", role: "Sales manager", targetAdj: "Allow", status: "Inactive", lastActive: "2h ago", leads: 888, deals: 444, revenue: "30,000", reports: 20, progress: 30, manager: "Mohammed Abdellah" },
    { id: 3, name: "Yasser Abdelhameed", phone: "********6535", role: "Sales manager", targetAdj: "Allow", status: "Inactive", lastActive: "2h ago", leads: 888, deals: 444, revenue: "30,000", reports: 20, progress: 30, manager: "Mohammed Abdellah" },
    { id: 4, name: "Yasser Abdelhameed", phone: "********6535", role: "Sales manager", targetAdj: "Allow", status: "Inactive", lastActive: "2h ago", leads: 888, deals: 444, revenue: "30,000", reports: 20, progress: 30, manager: "Mohammed Abdellah" },
    { id: 5, name: "Yasser Abdelhameed", phone: "********6535", role: "Sales manager", targetAdj: "Allow", status: "Inactive", lastActive: "2h ago", leads: 888, deals: 444, revenue: "30,000", reports: 20, progress: 30, manager: "Mohammed Abdellah" },
    { id: 6, name: "Yasser Abdelhameed", phone: "********6535", role: "Sales manager", targetAdj: "Allow", status: "Inactive", lastActive: "2h ago", leads: 888, deals: 444, revenue: "30,000", reports: 20, progress: 30, manager: "Mohammed Abdellah" },
    { id: 7, name: "Yasser Abdelhameed", phone: "********6535", role: "Sales manager", targetAdj: "Allow", status: "Inactive", lastActive: "2h ago", leads: 888, deals: 444, revenue: "30,000", reports: 20, progress: 30, manager: "Mohammed Abdellah" },
  ]);
  const [openManagerDropdown, setOpenManagerDropdown] = useState<number | null>(null);
  const [isEditSalesRoleOpen, setIsEditSalesRoleOpen] = useState(false);
  const [editingSalesId, setEditingSalesId] = useState<number | null>(null);
  const [isViewInfoOpen, setIsViewInfoOpen] = useState(false);
  const [viewingSalesId, setViewingSalesId] = useState<number | null>(null);
  
  type ActiveFilter = 'date' | 'status' | 'source' | 'followup' | 'sort' | 'priority' | 'rank' | 'leads_status' | 'leads' | 'status_filter' | 'deals' | 'target' | null;
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>(null);

  // Hover state for filter buttons
  const [hoveredFilter, setHoveredFilter] = useState<string | null>(null);
  const filterBarRef = useRef<HTMLDivElement | null>(null);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // AI Search
  const [isAISearchOpen, setIsAISearchOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState("");

  // Selected filter values for badge indicators
  const [selectedRank, setSelectedRank] = useState<{ from: string; to: string } | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<{ from: string; to: string; status: string | null } | null>(null);
  const [selectedLeadsStatus, setSelectedLeadsStatus] = useState<string[]>([]);
  const [selectedDealsFilter, setSelectedDealsFilter] = useState<{ from: string; to: string } | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<{ from: string; to: string } | null>(null);

  // Close action menu and active filters when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (activeFilter !== null && filterBarRef.current && !filterBarRef.current.contains(target)) {
        setActiveFilter(null);
      }
      if (openActionMenu !== null && !target.closest('.action-menu-container')) {
        setOpenActionMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeFilter, openActionMenu]);

  // Get current month label e.g. "April 2026"
  const currentMonthLabel = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });

  // Helper to build filter button style dynamically based on hover/active/selected state
  const getFilterBtnStyle = (key: string, isSelected: boolean): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    gap: 6,
    border: "1px solid rgba(212, 213, 216, 1)",
    borderRadius: 12,
    padding: "0 12px",
    height: 40,
    background: (hoveredFilter === key || activeFilter === key || isSelected) ? "#E6E9F1" : "transparent",
    cursor: "pointer",
    fontFamily: "Inter, sans-serif",
    fontSize: 14,
    color: "#4B5563",
    boxSizing: "border-box" as const,
    whiteSpace: "nowrap" as const,
  });

  return (
    <div style={{ width: "100%", paddingBottom: 24, paddingTop: 8 }}>
      {/* ── Header ── */}
      <div
        className="page-header"
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        {/* Title */}
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
          {t('sales.title')}
        </div>

        {/* Right: Button + View Toggle */}
        <div
          className="filter-bar-right"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-end',
            gap: 16,
          }}
        >
          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Invite New Sales Button */}
            <button
              onClick={() => setIsInviteNewSalesOpen(true)}
              style={{
                borderRadius: 12,
                background: 'var(--Foundation-brand-brand-500, #00236F)',
                display: 'flex',
                height: 48,
                padding: '8px 24px',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 8,
                border: 'none',
                cursor: 'pointer',
                color: '#fff',
                fontFamily: 'Inter, sans-serif',
                fontSize: 16,
                fontWeight: 500,
                boxSizing: 'border-box',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0, 25, 85, 1)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--Foundation-brand-brand-500, #00236F)')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 4.16667V15.8333" stroke="white" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4.16667 10H15.8333" stroke="white" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {t('sales.addSales')}
            </button>

            {/* Export Sales Button */}
            <button
              onClick={() => {
                const activeFilters: string[] = [];
                if (searchTerm) activeFilters.push(`Search: "${searchTerm}"`);
                if (selectedStatus && selectedStatus.length > 0) {
                  activeFilters.push(`Status: ${selectedStatus.join(', ')}`);
                }
                if (selectedRank) {
                  activeFilters.push(`Rank: ${selectedRank.from} - ${selectedRank.to}`);
                }
                if (selectedLeads) {
                  activeFilters.push(`Leads: ${selectedLeads.from} - ${selectedLeads.to}`);
                }
                if (selectedLeadsStatus && selectedLeadsStatus.length > 0) {
                  activeFilters.push(`Lead Status: ${selectedLeadsStatus.join(', ')}`);
                }
                if (selectedDealsFilter) {
                  activeFilters.push(`Deals: ${selectedDealsFilter.from} - ${selectedDealsFilter.to}`);
                }
                if (selectedTarget) {
                  activeFilters.push(`Target: ${selectedTarget.from} - ${selectedTarget.to}`);
                }

                // Filter local mock data if filters are active
                let filtered = [...salesListItems];
                if (searchTerm) {
                  const lower = searchTerm.toLowerCase();
                  filtered = filtered.filter(s => s.name.toLowerCase().includes(lower) || s.role.toLowerCase().includes(lower));
                }
                if (selectedStatus && selectedStatus.length > 0) {
                  filtered = filtered.filter(s => selectedStatus.includes(s.status));
                }

                const mappedSales = filtered.map(s => ({
                  name: s.name,
                  phone: s.phone,
                  role: s.role,
                  start_date: undefined,
                  status: s.status,
                  leads: s.leads,
                  deals: s.deals,
                  revenue: s.revenue,
                  target_progress: s.progress
                }));

                exportSalesPDF(mappedSales, activeFilters);
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
              {t('sales.exportSales')}
            </button>
          </div>

          {/* View Toggle: Grid / List */}
          <div
            style={{
              borderRadius: 14,
              background: 'var(--Foundation-neutral-neutral-100, #D4D5D8)',
              display: 'flex',
              width: 80,
              height: 42,
              padding: 4,
              alignItems: 'center',
              gap: 4,
              boxSizing: 'border-box',
            }}
          >
            {/* List View Button */}
            <button
              onClick={() => setViewMode('list')}
              style={{
                flex: 1,
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                borderRadius: 10,
                background: viewMode === 'list' ? '#fff' : 'transparent',
                cursor: 'pointer',
                padding: 0,
                boxShadow: viewMode === 'list' ? '0 1px 3px rgba(0,0,0,0.12)' : 'none',
                transition: 'background 0.15s, box-shadow 0.15s',
                flexShrink: 0,
                alignSelf: 'stretch',
              }}
              title="List view"
            >
              <ListIcon active={viewMode === 'list'} />
            </button>

            {/* Grid View Button */}
            <button
              onClick={() => setViewMode('grid')}
              style={{
                flex: 1,
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                borderRadius: 10,
                background: viewMode === 'grid' ? '#fff' : 'transparent',
                cursor: 'pointer',
                padding: 0,
                boxShadow: viewMode === 'grid' ? '0 1px 3px rgba(0,0,0,0.12)' : 'none',
                transition: 'background 0.15s, box-shadow 0.15s',
                flexShrink: 0,
                alignSelf: 'stretch',
              }}
              title="Grid view"
            >
              <GridIcon active={viewMode === 'grid'} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Time Range Section ── */}
      <div
        className="time-range-container"
        style={{
          marginTop: 24,
          borderRadius: 12,
          background: 'var(--Foundation-neutral-neutral-50, #EDEFF2)',
          display: 'flex',
          width: '100%',
          padding: '12px 16px',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          boxSizing: 'border-box',
        }}
      >
        {/* Left Side */}
        <div
          className="time-range-left"
          style={{
            display: 'flex',
            width: 703,
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 20,
            flexShrink: 0,
          }}
        >

          {/* Title + Description */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M4.75 8.91425H18.75M6.55952 3V4.54304M16.75 3V4.54285M16.75 4.54285H6.75C5.09315 4.54285 3.75 5.92436 3.75 7.62855V17.9143C3.75 19.6185 5.09315 21 6.75 21H16.75C18.4069 21 19.75 19.6185 19.75 17.9143L19.75 7.62855C19.75 5.92436 18.4069 4.54285 16.75 4.54285ZM7.25 12.5143H16.25M7.25 16.6285H16.25" stroke="#464646" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, fontWeight: 600, color: '#141414' }}>
                Time Range
              </span>
            </div>
            <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 400, color: '#747474', lineHeight: '1.5' }}>
              The time range applies to leads, deals, conversion rate and target progress items.
            </p>
          </div>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {TIME_RANGE_TABS.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    borderRadius: 12,
                    border: isActive ? '1px solid var(--Foundation-brand-brand-500, #00236F)' : '1px solid rgba(212, 213, 216, 1)',
                    background: isActive ? 'var(--Foundation-brand-brand-50, #E6E9F1)' : 'transparent',
                    display: 'flex',
                    height: 32,
                    padding: '0 12px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#00236F' : '#374151',
                    transition: 'all 0.15s',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side – Date Badge */}
        <div
          style={{
            borderRadius: 12,
            background: 'var(--Foundation-brand-brand-50, #E6E9F1)',
            display: 'flex',
            height: 32,
            padding: '0 12px',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M5.333 1.333v2M10.667 1.333v2M2 6h12M2.667 2.667h10.666C13.403 2.667 14 3.264 14 4v9.333c0 .737-.597 1.334-1.333 1.334H2.667C1.93 14.667 1.333 14.07 1.333 13.333V4c0-.736.597-1.333 1.334-1.333z" stroke="#00236F" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500, color: '#00236F' }}>
            {currentMonthLabel}
          </span>
        </div>
      </div>
      {/* ── Filter Bar ── */}
      <div
        ref={filterBarRef}
        className="filter-bar"
        style={{
          marginTop: 24,
          width: "100%",
          background: "rgba(237, 239, 242, 1)",
          borderRadius: 12,
          padding: "12px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          alignSelf: "stretch",
          boxSizing: "border-box",
        }}
      >
        {/* Left side: search + filter buttons */}
        <div className="filter-bar-left" style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "nowrap" }}>
          {/* Search / AI Search input */}
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
                width: 362,
                boxSizing: "border-box",
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
                  fontSize: 14,
                  color: "#141414",
                }}
              />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 500, color: "#464646", whiteSpace: "nowrap", marginRight: 4, userSelect: "none" }}>
                (0/5) AI limit
              </span>
              <svg onClick={() => setIsAISearchOpen(false)} xmlns="http://www.w3.org/2000/svg" width="19.2" height="19.2" viewBox="0 0 20 20" fill="none" style={{ cursor: "pointer", flexShrink: 0 }}>
                <path d="M12.4235 0L14.2538 4.94621L19.2 6.77647L14.2538 8.60673L12.4235 13.5529L10.5933 8.60673L5.64706 6.77647L10.5933 4.94621L12.4235 0Z" fill="#00236F"/>
                <path d="M3.95294 11.2941L5.55177 13.6482L7.90588 15.2471L5.55177 16.8459L3.95294 19.2L2.35411 16.8459L0 15.2471L2.35411 13.6482L3.95294 11.2941Z" fill="#00236F"/>
              </svg>
            </div>
          ) : (
            <div
              className="filter-search"
              style={{
                display: "flex",
                alignItems: "center",
                border: searchTerm ? "1px solid #00236F" : "1px solid var(--Foundation-neutral-neutral-100, #D4D5D8)",
                borderRadius: 12,
                padding: "8px 12px",
                height: 40,
                gap: 8,
                background: "transparent",
                width: 362,
                boxSizing: "border-box",
              }}
            >
              <img src={filterIcon} alt="filter" width={18} height={18} />
              <input
                type="text"
                placeholder={t('leads.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  border: "none",
                  background: "transparent",
                  outline: "none",
                  flex: 1,
                  fontFamily: "Inter, sans-serif",
                  fontSize: 13,
                  color: "#141414",
                }}
              />
            </div>
          )}

          <div className="filter-buttons" style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {/* Rank */}
            <div style={{ position: "relative" }}>
              <button
                style={getFilterBtnStyle('rank', !!selectedRank)}
                onClick={() => setActiveFilter(activeFilter === 'rank' ? null : 'rank')}
                onMouseEnter={() => setHoveredFilter('rank')}
                onMouseLeave={() => setHoveredFilter(null)}
              >
                {t('sales.filterRank')}
                {selectedRank ? (
                  <div style={{ background: "#B0BBD2", width: 20, height: 22, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#141414", fontWeight: 600 }}>1</div>
                ) : activeFilter === 'rank' ? (
                  <ChevronUp size={14} color="#4B5563" />
                ) : (
                  <ChevronDown size={14} color="#4B5563" />
                )}
              </button>
              {activeFilter === 'rank' && (
                <div style={{ position: "absolute", top: "100%", left: 0, zIndex: 10, marginTop: 4 }}>
                  <Rank
                    onClose={() => setActiveFilter(null)}
                    onApply={(vals) => { setSelectedRank(vals); setActiveFilter(null); }}
                    onClear={() => { setSelectedRank(null); setActiveFilter(null); }}
                  />
                </div>
              )}
            </div>

            {/* Status */}
            <div style={{ position: "relative" }}>
              <button
                style={getFilterBtnStyle('status_filter', !!selectedStatus && selectedStatus.length > 0)}
                onClick={() => setActiveFilter(activeFilter === 'status_filter' ? null : 'status_filter')}
                onMouseEnter={() => setHoveredFilter('status_filter')}
                onMouseLeave={() => setHoveredFilter(null)}
              >
                {t('leads.colStatus')}
                {selectedStatus && selectedStatus.length > 0 ? (
                  <div style={{ background: "#B0BBD2", width: 20, height: 22, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#141414", fontWeight: 600 }}>{selectedStatus.length}</div>
                ) : activeFilter === 'status_filter' ? (
                  <ChevronUp size={14} color="#4B5563" />
                ) : (
                  <ChevronDown size={14} color="#4B5563" />
                )}
              </button>
              {activeFilter === 'status_filter' && (
                <div style={{ position: "absolute", top: "100%", left: 0, zIndex: 10, marginTop: 4 }}>
                  <StatusFilter
                    onClose={() => setActiveFilter(null)}
                    onApply={(vals) => { setSelectedStatus(vals); setActiveFilter(null); }}
                    onClear={() => { setSelectedStatus([]); setActiveFilter(null); }}
                    initialSelected={selectedStatus ?? []}
                  />
                </div>
              )}
            </div>

            {/* Leads */}
            <div style={{ position: "relative" }}>
              <button
                style={getFilterBtnStyle('leads', !!selectedLeads)}
                onClick={() => setActiveFilter(activeFilter === 'leads' ? null : 'leads')}
                onMouseEnter={() => setHoveredFilter('leads')}
                onMouseLeave={() => setHoveredFilter(null)}
              >
                {t('sidebar.leads')}
                {selectedLeads ? (
                  <div style={{ background: "#B0BBD2", width: 20, height: 22, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#141414", fontWeight: 600 }}>1</div>
                ) : activeFilter === 'leads' ? (
                  <ChevronUp size={14} color="#4B5563" />
                ) : (
                  <ChevronDown size={14} color="#4B5563" />
                )}
              </button>
              {activeFilter === 'leads' && (
                <div style={{ position: "absolute", top: "100%", left: 0, zIndex: 10, marginTop: 4 }}>
                  <LeadsFilter
                    onClose={() => setActiveFilter(null)}
                    onApply={(vals) => { setSelectedLeads(vals); setActiveFilter(null); }}
                    onClear={() => { setSelectedLeads(null); setActiveFilter(null); }}
                  />
                </div>
              )}
            </div>

            {/* Lead's status */}
            <div style={{ position: "relative" }}>
              <button
                style={getFilterBtnStyle('leads_status', selectedLeadsStatus.length > 0)}
                onClick={() => setActiveFilter(activeFilter === 'leads_status' ? null : 'leads_status')}
                onMouseEnter={() => setHoveredFilter('leads_status')}
                onMouseLeave={() => setHoveredFilter(null)}
              >
                {t('sales.filterLeadsStatus')}
                {selectedLeadsStatus.length > 0 ? (
                  <div style={{ background: "#B0BBD2", width: 20, height: 22, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#141414", fontWeight: 600 }}>{selectedLeadsStatus.length}</div>
                ) : activeFilter === 'leads_status' ? (
                  <ChevronUp size={14} color="#4B5563" />
                ) : (
                  <ChevronDown size={14} color="#4B5563" />
                )}
              </button>
              {activeFilter === 'leads_status' && (
                <div style={{ position: "absolute", top: "100%", left: 0, zIndex: 10, marginTop: 4 }}>
                  <Leads_status
                    onClose={() => setActiveFilter(null)}
                    onApply={(vals) => { setSelectedLeadsStatus(vals); setActiveFilter(null); }}
                    onClear={() => { setSelectedLeadsStatus([]); setActiveFilter(null); }}
                  />
                </div>
              )}
            </div>

            {/* Deals */}
            <div style={{ position: "relative" }}>
              <button
                style={getFilterBtnStyle('deals', !!selectedDealsFilter)}
                onClick={() => setActiveFilter(activeFilter === 'deals' ? null : 'deals')}
                onMouseEnter={() => setHoveredFilter('deals')}
                onMouseLeave={() => setHoveredFilter(null)}
              >
                {t('sidebar.deals')}
                {selectedDealsFilter ? (
                  <div style={{ background: "#B0BBD2", width: 20, height: 22, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#141414", fontWeight: 600 }}>1</div>
                ) : activeFilter === 'deals' ? (
                  <ChevronUp size={14} color="#4B5563" />
                ) : (
                  <ChevronDown size={14} color="#4B5563" />
                )}
              </button>
              {activeFilter === 'deals' && (
                <div style={{ position: "absolute", top: "100%", left: 0, zIndex: 10, marginTop: 4 }}>
                  <Deals
                    onClose={() => setActiveFilter(null)}
                    onApply={(vals: any) => { setSelectedDealsFilter(vals); setActiveFilter(null); }}
                    onClear={() => { setSelectedDealsFilter(null); setActiveFilter(null); }}
                  />
                </div>
              )}
            </div>

            {/* Target */}
            <div style={{ position: "relative" }}>
              <button
                style={getFilterBtnStyle('target', !!selectedTarget)}
                onClick={() => setActiveFilter(activeFilter === 'target' ? null : 'target')}
                onMouseEnter={() => setHoveredFilter('target')}
                onMouseLeave={() => setHoveredFilter(null)}
              >
                {t('sales.filterTarget')}
                {selectedTarget ? (
                  <div style={{ background: "#B0BBD2", width: 20, height: 22, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#141414", fontWeight: 600 }}>1</div>
                ) : activeFilter === 'target' ? (
                  <ChevronUp size={14} color="#4B5563" />
                ) : (
                  <ChevronDown size={14} color="#4B5563" />
                )}
              </button>
              {activeFilter === 'target' && (
                <div style={{ position: "absolute", top: "100%", left: 0, zIndex: 10, marginTop: 4 }}>
                  <Target
                    onClose={() => setActiveFilter(null)}
                    onApply={(vals: any) => { setSelectedTarget(vals); setActiveFilter(null); }}
                    onClear={() => { setSelectedTarget(null); setActiveFilter(null); }}
                  />
                </div>
              )}
            </div>

            {/* Reset Filters */}
            <button
              onClick={() => {
                setSelectedRank(null);
                setSelectedStatus([]);
                setSelectedLeads(null);
                setSelectedLeadsStatus([]);
                setSelectedDealsFilter(null);
                setSelectedTarget(null);
                setSearchTerm("");
                setActiveFilter(null);
              }}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "var(--Foundation-brand-brand-500, #00236F)",
                fontFamily: "Inter",
                fontSize: 14,
                fontWeight: 400,
                padding: 0,
                whiteSpace: "nowrap",
              }}
            >
              {t('common.resetFilters')}
            </button>
          </div>
        </div>

        {/* Right side: Sort by */}
        <div className="filter-bar-right" style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {/* Sort by */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setActiveFilter(activeFilter === 'sort' ? null : 'sort')}
              onMouseEnter={() => setHoveredFilter('sort')}
              onMouseLeave={() => setHoveredFilter(null)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "1px solid rgba(212, 213, 216, 1)", borderRadius: 12,
                padding: "0 12px", height: 40, gap: 6,
                background: (hoveredFilter === 'sort' || activeFilter === 'sort') ? "#E6E9F1" : "transparent",
                cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: 14,
                color: "#4B5563", boxSizing: "border-box",
              }}
            >
              {t('common.sortBy')}
              <ArrowDownUp size={14} color="#4B5563" />
            </button>
            {activeFilter === 'sort' && (
              <div style={{ position: "absolute", top: "100%", right: 0, zIndex: 500, marginTop: 4 }}>
                <Sort isOpen={true} onClose={() => setActiveFilter(null)} onApply={() => setActiveFilter(null)} />
              </div>
            )}
          </div>
        </div>
      </div>



      {/* ── Page Content ── */}
      {viewMode === 'grid' ? (
        /* GRID VIEW (Cards) */
        <div
          style={{
            marginTop: 24,
            width: "100%",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(417px, 1fr))",
            gap: 24,
            marginBottom: 24,
          }}
        >
          {salesListItems.map((item) => (
            <Sales_Card
              key={item.id}
              onAssignTask={() => setIsAddNewTaskOpen(true)}
              onPauseAccount={() => setIsPauseAccountOpen(true)}
              onEditTarget={() => setIsEditTargetOpen(true)}
              onViewTasks={() => setIsSalesTasksOpen(true)}
              onDelete={() => openDeleteSalesModal(item.id, item.name, item.lastActive)}
            />
          ))}
        </div>
      ) : (
        /* LIST VIEW (Table) */
        <div className="responsive-table-container" style={{ marginTop: 24, width: "100%" }}>
        {/* Table Header */}
        <div
          className="responsive-table-row"
          style={{
            borderRadius: "12px 12px 0 0",
            background: "var(--Foundation-neutral-neutral-100, #D4D5D8)",
            display: "flex",
            width: "100%",
            height: 48,
            padding: "0 12px",
            justifyContent: "space-between",
            alignItems: "center",
            boxSizing: "border-box",
          }}
        >
          <div style={{ width: 32, flexShrink: 0, fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: "#4B5563" }}>{t('sales.filterRank')}</div>
          <div style={{ width: 146, flexShrink: 0, fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: "#4B5563" }}>{t('sales.colName')}</div>
          <div style={{ width: 119, flexShrink: 0, fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: "#4B5563" }}>{t('sales.colRole')}</div>
          <div style={{ width: 80, flexShrink: 0, fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: "#4B5563" }}>{t('leads.colDate')}</div>
          <div style={{ width: 150, flexShrink: 0, fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: "#4B5563" }}>Manager</div>
          <div style={{ width: 95, flexShrink: 0, fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: "#4B5563" }}>Current Status</div>
          <div style={{
            width: 101,
            height: 32,
            flexShrink: 0,
            fontFamily: "Inter, sans-serif",
            fontSize: 12,
            fontWeight: 700,
            color: "var(--Foundation-neutral-neutral-800, #464646)",
            textAlign: "right",
            lineHeight: "120%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            boxSizing: "border-box",
            opacity: 1
          }}>
            <div>Leads</div>
            <div style={{ fontSize: 10, fontWeight: 500, opacity: 0.85 }}>(not interested)</div>
          </div>
          <div style={{ width: 65, flexShrink: 0, fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: "#4B5563", textAlign: "center" }}>{t('sidebar.deals')}</div>
          <div style={{ width: 96, flexShrink: 0, fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: "#4B5563", textAlign: "right" }}>Revenue (EGP)</div>
          <div style={{ width: 64, flexShrink: 0, fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: "#4B5563", textAlign: "right" }}>{t('reports.title')}</div>
          <div style={{ width: 104, flexShrink: 0, fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: "#4B5563" }}>{t('common.actions')}</div>
        </div>

        {/* Dynamic Rows */}
        {salesListItems.map((item, index) => (
          <div
            key={index}
            className="responsive-table-row"
            style={{
              display: "flex",
              width: "100%",
              padding: "16px 12px",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #E6E9F1",
              background: "#FFF",
              boxSizing: "border-box",
            }}
          >
            <div style={{ width: 32, flexShrink: 0 }}>
              <div style={{ width: 26, padding: 4, borderRadius: 12, background: "#F1EEE6", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexShrink: 0, boxSizing: "border-box", fontFamily: "Inter", fontSize: 12, fontWeight: 500, color: "#141414" }}>
                {item.id}
              </div>
            </div>
            {/* Sales Info */}
            <div style={{ width: 146, flexShrink: 0, display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 500, color: "#4B5563" }}>{item.name}</span>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#9CA3AF" }}>{item.phone}</span>
            </div>
            {/* Role */}
            <div
              style={{
                display: "flex",
                width: 119,
                alignItems: "center",
                gap: 4,
                flexShrink: 0,
                boxSizing: "border-box",
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                fontWeight: 400,
                color: "var(--Foundation-neutral-neutral-800, #464646)",
              }}
            >
              <span style={{ textTransform: "capitalize" }}>{item.role}</span>
              <svg 
                onClick={() => {
                  setEditingSalesId(item.id);
                  setIsEditSalesRoleOpen(true);
                }}
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 20 20" 
                fill="none" 
                style={{ flexShrink: 0, cursor: "pointer" }}
              >
                <path fillRule="evenodd" clipRule="evenodd" d="M12.6529 4.20709C13.0432 3.81654 13.6762 3.81628 14.0669 4.2065L15.7922 5.9299C16.1831 6.32028 16.1833 6.95361 15.7928 7.34432L7.6481 15.4935C7.50881 15.6329 7.33147 15.728 7.13832 15.7669L3.5 16.5L4.23442 12.866C4.27337 12.6732 4.36829 12.4962 4.5073 12.3571L12.6529 4.20709Z" stroke="#464646" strokeWidth={2} strokeLinejoin="round"/>
              </svg>
            </div>
            {/* Start Date */}
            <div style={{ width: 80, flexShrink: 0, fontFamily: "Inter, sans-serif", fontSize: 13, color: "#4B5563" }}>
              24/05/2026
            </div>
            {/* Manager Dropdown */}
            <div style={{ width: 150, flexShrink: 0, position: "relative", boxSizing: "border-box" }}>
              <div 
                onClick={() => setOpenManagerDropdown(openManagerDropdown === index ? null : index)}
                style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}
              >
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#4B5563" }}>
                  {item.manager}
                </span>
                <ChevronDown size={16} color="#4B5563" />
              </div>
              {openManagerDropdown === index && (
                <div style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  zIndex: 1000,
                  background: "#fff",
                  border: "1px solid #D4D5D8",
                  borderRadius: 8,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.17)",
                  display: "flex",
                  flexDirection: "column",
                  width: 170,
                  boxSizing: "border-box",
                  marginTop: 4,
                  overflow: "hidden"
                }}>
                  {["Mohammed Abdellah", "Mohammed Gammal", "Mahmoud Abdelmawgoud", "Rowayda Ashraf"].map((mgr) => (
                    <div
                      key={mgr}
                      onClick={(e) => {
                        e.stopPropagation();
                        const updated = [...salesListItems];
                        updated[index].manager = mgr;
                        setSalesListItems(updated);
                        setOpenManagerDropdown(null);
                      }}
                      style={{
                        padding: "8px 12px",
                        cursor: "pointer",
                        fontSize: 13,
                        fontFamily: "Inter, sans-serif",
                        background: item.manager === mgr ? "#F3F4F6" : "transparent",
                        color: "#141414"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#F9FAFB"}
                      onMouseLeave={(e) => e.currentTarget.style.background = item.manager === mgr ? "#F3F4F6" : "transparent"}
                    >
                      {mgr}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Current Status */}
            <div style={{ width: 95, flexShrink: 0, display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#4B5563" }}>Inactive</span>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#9CA3AF" }}>2h ago</span>
            </div>
            {/* Leads */}
            <div style={{ width: 101, flexShrink: 0, fontFamily: "Inter, sans-serif", fontSize: 13, color: "#4B5563", textAlign: "right" }}>
              888
            </div>
            {/* Deals */}
            <div style={{ width: 65, flexShrink: 0, fontFamily: "Inter, sans-serif", fontSize: 13, color: "#4B5563", textAlign: "center" }}>
              444
            </div>
            {/* Revenue */}
            <div style={{ width: 96, flexShrink: 0, fontFamily: "Inter, sans-serif", fontSize: 13, color: "#4B5563", textAlign: "right" }}>
              30,000
            </div>
            {/* Reports */}
            <div style={{ width: 64, flexShrink: 0, fontFamily: "Inter, sans-serif", fontSize: 13, color: "#4B5563", textAlign: "right" }}>
              20
            </div>
            {/* Actions */}
            <div className="action-menu-container" style={{ width: 104, flexShrink: 0, display: "flex", alignItems: "center", gap: 12, position: "relative" }}>
              <button onClick={() => setIsAddNewTaskOpen(true)} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12.0001 4.8L12 19.2M19.2 12L4.80005 12" stroke="#464646" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              <button onClick={() => setIsSalesTasksOpen(true)} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M10.7999 21.6H4.79989C3.47441 21.6 2.39989 20.5254 2.3999 19.2L2.4 4.80001C2.4 3.47453 3.47452 2.40002 4.79999 2.40002H15.6003C16.9257 2.40002 18.0003 3.47454 18.0003 4.80002V9.60002M17.3999 17.349V17.2858M6.60028 7.20002H13.8003M6.60028 10.8H13.8003M6.60028 14.4H10.2003M21.5999 17.4C21.5999 17.4 20.6037 20.3397 17.3999 20.2883C14.1961 20.237 13.1999 17.4 13.1999 17.4C13.1999 17.4 14.1557 14.409 17.3999 14.409C20.6441 14.409 21.5999 17.4 21.5999 17.4Z" stroke="#464646" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button 
                onClick={() => setOpenActionMenu(openActionMenu === index ? null : index)}
                style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3C11.175 3 10.5 3.675 10.5 4.5C10.5 5.325 11.175 6 12 6C12.825 6 13.5 5.325 13.5 4.5C13.5 3.675 12.825 3 12 3ZM12 18C11.175 18 10.5 18.675 10.5 19.5C10.5 20.325 11.175 21 12 21C12.825 21 13.5 20.325 13.5 19.5C13.5 18.675 12.825 18 12 18ZM12 10.5C11.175 10.5 10.5 11.175 10.5 12C10.5 12.825 11.175 13.5 12 13.5C12.825 13.5 13.5 12.825 13.5 12C13.5 11.175 12.825 10.5 12 10.5Z" fill="#464646"/>
                </svg>
              </button>

              {openActionMenu === index && (
                <Action_Modal
                  onClose={() => setOpenActionMenu(null)}
                  onPause={() => { setIsPauseAccountOpen(true); setOpenActionMenu(null); }}
                  onEditTarget={() => { setIsEditTargetOpen(true); setOpenActionMenu(null); }}
                  onViewInfo={() => {
                    setViewingSalesId(item.id);
                    setIsViewInfoOpen(true);
                    setOpenActionMenu(null);
                  }}
                  onDelete={() => openDeleteSalesModal(item.id, item.name, item.lastActive)}
                />
              )}
            </div>
          </div>
        ))}
        </div>
      )}

      {/* ── Pagination ── */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
        <Pagination currentPage={currentPage} totalPages={4} onPageChange={setCurrentPage} />
      </div>

      {/* ── Modals ── */}
      {isSalesTasksOpen && (
        <ModalOverlay onClose={() => setIsSalesTasksOpen(false)}>
          <Sales_Tasks
            onClose={() => setIsSalesTasksOpen(false)}
            onNewTask={() => { setIsSalesTasksOpen(false); setIsAddNewTaskOpen(true); }}
          />
        </ModalOverlay>
      )}
      {isEditTargetOpen && (
        <ModalOverlay onClose={() => setIsEditTargetOpen(false)}>
          <Edit_Target onClose={() => setIsEditTargetOpen(false)} />
        </ModalOverlay>
      )}
      {isAddNewTaskOpen && (
        <ModalOverlay onClose={() => setIsAddNewTaskOpen(false)}>
          <Add_New_Task onClose={() => setIsAddNewTaskOpen(false)} />
        </ModalOverlay>
      )}
      {isPauseAccountOpen && (
        <ModalOverlay onClose={() => setIsPauseAccountOpen(false)}>
          <Pause_Account onClose={() => setIsPauseAccountOpen(false)} />
        </ModalOverlay>
      )}
      {isInviteNewSalesOpen && (
        <ModalOverlay onClose={() => setIsInviteNewSalesOpen(false)}>
          <Add_New_Sales 
            onClose={() => setIsInviteNewSalesOpen(false)} 
            onSave={(data) => {
              const newId = salesListItems.length > 0 ? Math.max(...salesListItems.map(s => s.id)) + 1 : 1;
              const newSalesItem = {
                id: newId,
                name: `${data.firstName} ${data.lastName}`,
                phone: data.whatsapp,
                role: data.role,
                targetAdj: data.targetAdj,
                status: "Active",
                lastActive: "Just now",
                leads: 0,
                deals: 0,
                revenue: "0",
                reports: 0,
                progress: 0
              };
              setSalesListItems(prev => [...prev, newSalesItem]);
            }}
          />
        </ModalOverlay>
      )}
      {isEditSalesRoleOpen && editingSalesId !== null && (
        <ModalOverlay onClose={() => { setIsEditSalesRoleOpen(false); setEditingSalesId(null); }}>
          <Edit_Sales_Role
            salesName={salesListItems.find(s => s.id === editingSalesId)?.name || ""}
            currentRole={salesListItems.find(s => s.id === editingSalesId)?.role || ""}
            currentTargetAdjustment={salesListItems.find(s => s.id === editingSalesId)?.targetAdj || ""}
            onClose={() => { setIsEditSalesRoleOpen(false); setEditingSalesId(null); }}
            onSave={(newRole, newTargetAdj) => {
              setSalesListItems(prev =>
                prev.map(s =>
                  s.id === editingSalesId ? { ...s, role: newRole, targetAdj: newTargetAdj } : s
                )
              );
            }}
          />
        </ModalOverlay>
      )}
      {salesToDelete && (
        <ModalOverlay onClose={() => setSalesToDelete(null)}>
          <Delete_Sales
            salesName={salesToDelete.name}
            salesDate={salesToDelete.date}
            onClose={() => setSalesToDelete(null)}
            onConfirm={() => {
              setSalesListItems((prev) => prev.filter((i) => i.id !== salesToDelete.id));
              setSalesToDelete(null);
            }}
          />
        </ModalOverlay>
      )}
      {isViewInfoOpen && viewingSalesId !== null && (
        <ModalOverlay onClose={() => { setIsViewInfoOpen(false); setViewingSalesId(null); }}>
          <View_info
            salesId={viewingSalesId}
            initialFirstName={salesListItems.find(s => s.id === viewingSalesId)?.name.split(" ")[0] || "Yasser"}
            initialLastName={salesListItems.find(s => s.id === viewingSalesId)?.name.split(" ")[1] || "Abdelhameed"}
            initialEmail="yasser.abdelhameed@gmail.com"
            initialWhatsapp={salesListItems.find(s => s.id === viewingSalesId)?.phone || "********6535"}
            initialCountry="Egypt"
            initialCity="Cairo"
            onClose={() => { setIsViewInfoOpen(false); setViewingSalesId(null); }}
            onSave={(updatedData) => {
              setSalesListItems(prev =>
                prev.map(s =>
                  s.id === viewingSalesId
                    ? {
                        ...s,
                        name: `${updatedData.firstName} ${updatedData.lastName}`,
                        phone: updatedData.whatsapp,
                        role: s.role, // preserves role
                      }
                    : s
                )
              );
            }}
          />
        </ModalOverlay>
      )}
    </div>
  );
};

export default Sales;
