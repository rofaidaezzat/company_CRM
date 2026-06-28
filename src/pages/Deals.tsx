import React, { useState, useRef, useEffect } from 'react';
import { Plus, ChevronDown, ChevronUp, ArrowDownUp } from 'lucide-react';
import starsIcon from '../assets/stars.svg';
import '../styles/tables-mobile.css';
import filterIcon from '../assets/filter.svg';
import { useTranslation } from "../context/LanguageContext";
import whatsappIcon from '../assets/ic_baseline-whatsapp.svg';
import mailIcon from '../assets/message-text-02 (1).svg';
import editPenIcon from '../assets/edit-04.svg';
import Pagination from '../components/Pagination';
import Add_new_deal from '../components/Deals/Add_new_deal';
import Notes from '../components/Deals/Notes';
import Service_details from '../components/Deals/Service_details';
import EditDealValue from '../components/Deals/EditDealValue';
import Delete_Deal from '../components/Deals/Delete_Deal';
import Value from '../components/Filteration/Value';
import DateFilter from '../components/Filteration/Date';
import { Sort } from '../components/Filteration/Sort';
import Members_filter from '../components/Filteration_Manager/Members_filter';
import { useGetDealsQuery, useUpdateDealMutation, Deal } from '../app/service/cruddeals';
import { toast } from 'sonner';
import { exportDealsPDF } from '../utils/exportPdf';
import { TableSkeleton } from '../components/TableSkeleton';



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
);const getPresetDateRange = (preset: string) => {
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

const Deals = () => {
  const { t } = useTranslation();
  const [selectedCreatedByMember, setSelectedCreatedByMember] = useState("Created by");
  const [activeFilter, setActiveFilter] = useState<'date' | 'value' | 'sort' | 'created_by' | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDealOpen, setIsAddDealOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isServiceDetailsOpen, setIsServiceDetailsOpen] = useState(false);
  const [isEditDealValueOpen, setIsEditDealValueOpen] = useState(false);
  const [dealToDelete, setDealToDelete] = useState<Deal | null>(null);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // AI Search
  const [isAISearchOpen, setIsAISearchOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState("");

  // Hover state for filter buttons
  const [hoveredFilter, setHoveredFilter] = useState<'date' | 'value' | 'sort' | 'created_by' | null>(null);

  // Filters state – use a single dateFilter object (like Leads)
  const [dateFilter, setDateFilter] = useState<{ preset?: any; startDate?: string; endDate?: string } | null>(null);
  const [valueRange, setValueRange] = useState<{ from?: string; to?: string }>({});
  const [sortOption, setSortOption] = useState<string>("newest");

  // Derive dateRange from dateFilter
  const dateRange = {
    startDate: dateFilter?.startDate,
    endDate: dateFilter?.endDate,
  };

  // Mutations
  const [updateDeal] = useUpdateDealMutation();

  // Search Debouncing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const queryParams = {
    page: currentPage,
    limit: 10,
    search: debouncedSearch || undefined,
    "close_date[gte]": dateFilter?.preset ? getPresetDateRange(dateFilter.preset).startDate : (dateFilter?.startDate || undefined),
    "close_date[lte]": dateFilter?.preset ? getPresetDateRange(dateFilter.preset).endDate : (dateFilter?.endDate || undefined),
    "value[gte]": valueRange.from || undefined,
    "value[lte]": valueRange.to || undefined,
  };

  const { data, isLoading } = useGetDealsQuery(queryParams);

  const statsQueryParams = {
    limit: 1,
    search: debouncedSearch || undefined,
  };
  const { data: statsData } = useGetDealsQuery(statsQueryParams);

  const dealsList = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;

  // Local sorting to avoid sending unsupported sort parameters to the backend
  const sortedDeals = [...dealsList].sort((a, b) => {
    if (sortOption === "newest") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    if (sortOption === "oldest") {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
    if (sortOption === "a-z") {
      const nameA = a.lead?.name || "";
      const nameB = b.lead?.name || "";
      return nameA.localeCompare(nameB);
    }
    if (sortOption === "z-a") {
      const nameA = a.lead?.name || "";
      const nameB = b.lead?.name || "";
      return nameB.localeCompare(nameA);
    }
    return 0;
  });

  const openDeleteModal = (
    e: React.MouseEvent,
    deal: Deal
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setDealToDelete(deal);
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
          {t('deals.title')}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={() => setIsAddDealOpen(true)}
            style={{
              background: "rgba(0, 35, 111, 1)",
              width: 149,
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
            {t('deals.addDeal')}
          </button>
          <button
            onClick={() => {
              const activeFilters: string[] = [];
              if (debouncedSearch) activeFilters.push(`Search: "${debouncedSearch}"`);
              if (dateFilter?.startDate) activeFilters.push(`Date: ${dateFilter.startDate} → ${dateFilter.endDate ?? ''}`);
              if (valueRange.from || valueRange.to) activeFilters.push(`Value: ${valueRange.from ?? '0'} – ${valueRange.to ?? '∞'}`);
              if (selectedCreatedByMember !== 'Created by') activeFilters.push(`Created by: ${selectedCreatedByMember}`);
              exportDealsPDF(sortedDeals as any[], activeFilters);
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
            {t('reports.exportReport')}
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
        {/* Left group */}
        <div className="filter-bar-left" style={{ display: "flex", gap: 16, alignItems: "center" }}>
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
                width: 406,
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
                  userSelect: "none",
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
                border: searchTerm ? "1px solid var(--Foundation-brand-brand-500, #00236F)" : "1px solid rgba(212, 213, 216, 1)",
                borderRadius: 12,
                padding: "8px 12px",
                height: 40,
                gap: 8,
                background: "transparent",
                width: 406,
                boxSizing: "border-box",
              }}
            >
              <img src={filterIcon} alt="filter" width={24} height={24} />
              <input
                type="text"
                placeholder={t('leads.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
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
              {t('leads.colDate')}
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
                  dateCounts={statsData?.dateCounts}
                />
              </div>
            )}
          </div>

          {/* Value */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setActiveFilter(activeFilter === 'value' ? null : 'value')}
              onMouseEnter={() => setHoveredFilter('value')}
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
                background: (hoveredFilter === 'value' || (valueRange.from || valueRange.to) || activeFilter === 'value') ? "#E6E9F1" : "transparent",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                color: "#4B5563",
                boxSizing: "border-box",
                flexShrink: 0,
              }}
            >
              {t('modal.dealValue')}
              {(valueRange.from || valueRange.to) ? (
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
              ) : activeFilter === 'value' ? (
                <ChevronUp size={16} color="#4B5563" />
              ) : (
                <ChevronDown size={16} color="#4B5563" />
              )}
            </button>
            {activeFilter === 'value' && (
              <div style={{ position: "absolute", top: "100%", left: 0, zIndex: 500, marginTop: 4 }}>
                <Value
                  onClose={() => setActiveFilter(null)}
                  onApply={(values) => {
                    setValueRange({ from: values.from, to: values.to });
                    setActiveFilter(null);
                    setCurrentPage(1);
                  }}
                  onClear={() => {
                    setValueRange({});
                    setActiveFilter(null);
                    setCurrentPage(1);
                  }}
                  initialFrom={valueRange.from}
                  initialTo={valueRange.to}
                  minRevenue={statsData?.min_revenue}
                  maxRevenue={statsData?.max_revenue}
                />
              </div>
            )}
          </div>

          {/* Created by */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setActiveFilter(activeFilter === 'created_by' ? null : 'created_by')}
              onMouseEnter={() => setHoveredFilter('created_by')}
              onMouseLeave={() => setHoveredFilter(null)}
              style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid var(--Foundation-neutral-neutral-100, #D4D5D8)",
                borderRadius: 12,
                padding: "0 12px",
                height: 40,
                gap: 8,
                background: (hoveredFilter === 'created_by' || selectedCreatedByMember !== "Created by" || activeFilter === 'created_by') ? "#E6E9F1" : "transparent",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                color: "#4B5563",
                boxSizing: "border-box",
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ whiteSpace: "nowrap" }}>{selectedCreatedByMember === "Created by" ? t('leads.colCreatedBy') : selectedCreatedByMember}</span>
              {selectedCreatedByMember !== "Created by" ? (
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
              ) : activeFilter === 'created_by' ? (
                <ChevronUp size={16} color="#4B5563" style={{ flexShrink: 0 }} />
              ) : (
                <ChevronDown size={16} color="#4B5563" style={{ flexShrink: 0 }} />
              )}
            </button>
            {activeFilter === 'created_by' && (
              <div style={{ position: "absolute", top: "100%", left: 0, zIndex: 500, marginTop: 4 }}>
                <Members_filter
                  selectedOption={selectedCreatedByMember === "Created by" ? "All members" : selectedCreatedByMember}
                  onChange={(option) => {
                    setSelectedCreatedByMember(option === "All members" ? "Created by" : option);
                    setActiveFilter(null);
                  }}
                  onClickOutside={() => setActiveFilter(null)}
                />
              </div>
            )}
          </div>

          {/* Reset Filters */}
          <button
            onClick={() => {
              setDateFilter(null);
              setValueRange({});
              setSelectedCreatedByMember("Created by");
              setSearchTerm("");
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
            {t('common.resetFilters')}
          </button>
        </div>

        {/* Sort by button (Right group) */}
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
                border: "1px solid rgba(212, 213, 216, 1)",
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
              {t('common.sortBy')}
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
                  defaultValue={sortOption}
                  onApply={(selectedValue) => {
                    setSortOption(selectedValue);
                    setActiveFilter(null);
                    setCurrentPage(1);
                  }}
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
          {[
            { label: t("leads.colDate"),          width: 70   },
            { label: t("leads.colCreatedBy"),    width: 146  },
            { label: t("leads.colCustomerInfo"), width: 146  },
            { label: t("leads.colPhoneNumber"),  width: 99   },
            { label: t("deals.colCity"),          width: 99   },
            { label: t("deals.colDetails"),  width: 152  },
            { label: t("deals.colValue"),   width: 108  },
            { label: t("common.actions"),       width: 104  },
          ].map(({ label, width }) => (
            <div
              key={label}
              style={{
                width,
                flexShrink: 0,
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: "#141414",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: label === "Actions" ? "flex" : "block",
                justifyContent: label === "Actions" ? "center" : "flex-start",
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Table Body */}
        <div style={{ width: "100%", background: "#fff" }}>
          {isLoading ? (
            <TableSkeleton columnWidths={[70, 146, 146, 99, 99, 152, 108, 104]} rowCount={10} />
          ) : dealsList.length === 0 ? (
            <div style={{ padding: 24, textAlign: "center", color: "#6B7280", fontFamily: "Inter, sans-serif", fontSize: 14 }}>
              No deals found.
            </div>
          ) : (
            sortedDeals
              .filter((deal) => {
                if (selectedCreatedByMember !== "Created by") {
                  const authorName = deal.author ? `${deal.author.first_name} ${deal.author.last_name}` : "System";
                  return authorName.toLowerCase().includes(selectedCreatedByMember.toLowerCase().replace("created by", "").trim());
                }
                return true;
              })
              .map((deal, i, arr) => {
                const formattedDate = new Date(deal.created_at).toLocaleDateString('en-GB');
                const authorName = deal.author ? `${deal.author.first_name} ${deal.author.last_name}` : "System";
                const clientName = deal.lead?.name || "--";
                const companyName = (deal.lead as any)?.company_name || "--";
                const phoneNumber = deal.lead?.phone || "";
                const maskedPhone = phoneNumber ? ("*******" + phoneNumber.slice(-4)) : "--";

                return (
                  <div
                    key={deal.id}
                    className="responsive-table-row"
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      padding: "16px 12px",
                      boxSizing: "border-box",
                      height: 72,
                      borderBottom: i < arr.length - 1 ? "1px solid rgba(237, 239, 242, 1)" : "none",
                      justifyContent: "space-between",
                    }}
                  >
                    {/* Date */}
                    <div
                      style={{
                        width: 70,
                        flexShrink: 0,
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 400,
                        fontSize: 13,
                        lineHeight: "140%",
                        letterSpacing: 0,
                        color: "#4B5563",
                      }}
                    >
                      {formattedDate}
                    </div>

                    {/* Created by */}
                    <div
                      style={{
                        width: 146,
                        flexShrink: 0,
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 400,
                        fontSize: 13,
                        lineHeight: "140%",
                        color: "var(--Foundation-neutral-neutral-800, #464646)",
                      }}
                    >
                      {authorName}
                    </div>

                    {/* Customer Info */}
                    <div style={{ width: 146, flexShrink: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                      <span
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 400,
                          fontSize: 13,
                          lineHeight: "140%",
                          letterSpacing: 0,
                          color: "#141414",
                        }}
                      >
                        {clientName}
                      </span>
                      <span
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 400,
                          fontSize: 13,
                          lineHeight: "140%",
                          letterSpacing: 0,
                          color: "#6B7280",
                        }}
                      >
                        {companyName}
                      </span>
                    </div>

                    {/* Phone number */}
                    <div
                      style={{
                        width: 99,
                        flexShrink: 0,
                        fontFamily: "Inter, sans-serif",
                        fontStyle: "normal",
                        fontWeight: 400,
                        fontSize: 13,
                        lineHeight: "140%",
                        letterSpacing: 0,
                        color: "var(--Foundation-neutral-neutral-800, #464646)",
                      }}
                    >
                      {maskedPhone}
                    </div>

                    {/* City */}
                    <div
                      style={{
                        width: 99,
                        flexShrink: 0,
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 400,
                        fontSize: 13,
                        lineHeight: "140%",
                        letterSpacing: 0,
                        color: "#4B5563",
                      }}
                    >
                      {deal.city}
                    </div>

                    {/* Deal details */}
                    <div style={{ width: 152, flexShrink: 0 }}>
                      <span
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 400,
                          fontSize: 13,
                          lineHeight: "140%",
                          letterSpacing: 0,
                          color: "rgba(0, 35, 111, 1)",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setSelectedDeal(deal);
                          setIsServiceDetailsOpen(true);
                        }}
                      >
                        View Details
                      </span>
                    </div>

                    {/* Value (EGP) */}
                    <div style={{ width: 108, flexShrink: 0, display: "flex", alignItems: "center", gap: 8 }}>
                      <span
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 400,
                          fontSize: 13,
                          lineHeight: "140%",
                          letterSpacing: 0,
                          color: "#141414",
                        }}
                      >
                        {deal.value?.toLocaleString() || deal.value}
                      </span>
                      <img
                        onClick={() => {
                          setSelectedDeal(deal);
                          setIsEditDealValueOpen(true);
                        }}
                        src={editPenIcon}
                        alt="edit value"
                        width={16}
                        height={16}
                        style={{ cursor: "pointer", opacity: 0.55 }}
                      />
                    </div>

                    {/* Actions */}
                    <div style={{ width: 104, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
                      <img src={whatsappIcon} alt="WhatsApp" width={24} height={24} style={{ cursor: "pointer" }} />
                      <img
                        src={mailIcon}
                        alt="Email"
                        width={24}
                        height={24}
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setSelectedDeal(deal);
                          setIsNotesOpen(true);
                        }}
                      />
                      
                      <button
                        type="button"
                        aria-label="Delete deal"
                        onClick={(e) => openDeleteModal(e, deal)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 0,
                          border: "none",
                          background: "transparent",
                          cursor: "pointer",
                          flexShrink: 0,
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          pointerEvents="none"
                        >
                          <path d="M4 6.17647H20M10 16.7647V10.4118M14 16.7647V10.4118M16 21H8C6.89543 21 6 20.0519 6 18.8824V7.23529C6 6.65052 6.44772 6.17647 7 6.17647H17C17.5523 6.17647 18 6.65052 18 7.23529V18.8824C18 20.0519 17.1046 21 16 21ZM10 6.17647H14C14.5523 6.17647 15 5.70242 15 5.11765V4.05882C15 3.47405 14.5523 3 14 3H10C9.44772 3 9 3.47405 9 4.05882V5.11765C9 5.70242 9.44772 6.17647 10 6.17647Z" stroke="#A80D0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
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
      {isAddDealOpen && (
        <ModalOverlay onClose={() => setIsAddDealOpen(false)}>
          <Add_new_deal onClose={() => setIsAddDealOpen(false)} />
        </ModalOverlay>
      )}
      {isNotesOpen && selectedDeal && (
        <ModalOverlay onClose={() => { setIsNotesOpen(false); setSelectedDeal(null); }}>
          <Notes leadId={selectedDeal.lead_id} onClose={() => { setIsNotesOpen(false); setSelectedDeal(null); }} />
        </ModalOverlay>
      )}
      {isServiceDetailsOpen && selectedDeal && (
        <ModalOverlay onClose={() => { setIsServiceDetailsOpen(false); setSelectedDeal(null); }}>
          <Service_details
            leadsName={selectedDeal.lead?.name || ""}
            initialDetails={selectedDeal.deals_details || ""}
            onClose={() => { setIsServiceDetailsOpen(false); setSelectedDeal(null); }}
            onSave={async (newDetails) => {
              try {
                await updateDeal({
                  id: selectedDeal.id,
                  body: { deals_details: newDetails }
                }).unwrap();
                toast.success("Service details updated successfully");
              } catch (err: any) {
                toast.error(err?.data?.message || "Failed to update service details");
              }
              setIsServiceDetailsOpen(false);
              setSelectedDeal(null);
            }}
          />
        </ModalOverlay>
      )}
      {isEditDealValueOpen && selectedDeal && (
        <ModalOverlay onClose={() => { setIsEditDealValueOpen(false); setSelectedDeal(null); }}>
          <EditDealValue
            dealId={selectedDeal.id}
            initialValue={selectedDeal.value}
            onClose={() => { setIsEditDealValueOpen(false); setSelectedDeal(null); }}
          />
        </ModalOverlay>
      )}
      {dealToDelete && (
        <ModalOverlay onClose={() => setDealToDelete(null)}>
          <Delete_Deal
            dealId={dealToDelete.id}
            dealName={dealToDelete.lead?.name || ""}
            dealDate={new Date(dealToDelete.created_at).toLocaleDateString('en-GB')}
            onClose={() => setDealToDelete(null)}
            onConfirm={() => setDealToDelete(null)}
          />
        </ModalOverlay>
      )}
    </div>
  );
};

export default Deals;
