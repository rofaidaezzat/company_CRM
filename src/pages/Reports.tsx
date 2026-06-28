import { ArrowDownUp, ChevronDown, ChevronUp } from 'lucide-react'
import filterIcon from '../assets/filter.svg';
import starsIcon from '../assets/stars.svg';
import { useState, useEffect } from 'react';
import '../styles/tables-mobile.css';
import { useTranslation } from "../context/LanguageContext";
import mailIcon from '../assets/message-text-02 (1).svg';
import Pagination from '../components/Pagination';
import Top_Periority_notes from '../components/Reports/Top_Periority_notes';
import DateFilter from '../components/Filteration/Date';
import Value from '../components/Filteration/Value';
import { Sort } from '../components/Filteration/Sort';
import { useGetReportsQuery, Report } from '../app/service/crudreports';
import { exportReportsPDF } from '../utils/exportPdf';
import { TableSkeleton } from '../components/TableSkeleton';



const ModalOverlay = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 10000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
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

const Reports = () => {
    const { t } = useTranslation();
    const [activeFilter, setActiveFilter] = useState<'date' | 'value' | 'sort' | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);

    // Search state
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // AI Search
    const [isAISearchOpen, setIsAISearchOpen] = useState(false);
    const [aiQuery, setAiQuery] = useState("");

    // Hover state for filter buttons
    const [hoveredFilter, setHoveredFilter] = useState<'date' | 'value' | 'sort' | null>(null);

    // Filters state – single dateFilter object like Leads
    const [dateFilter, setDateFilter] = useState<{ preset?: any; startDate?: string; endDate?: string } | null>(null);
    const [valueRange, setValueRange] = useState<{ from?: string; to?: string }>({});
    const [sortOption, setSortOption] = useState<string>("newest");

    // Derive dateRange from dateFilter
    const dateRange = {
        startDate: dateFilter?.startDate,
        endDate: dateFilter?.endDate,
    };

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
        "date[gte]": dateFilter?.preset ? getPresetDateRange(dateFilter.preset).startDate : (dateFilter?.startDate || undefined),
        "date[lte]": dateFilter?.preset ? getPresetDateRange(dateFilter.preset).endDate : (dateFilter?.endDate || undefined),
        "revenue_today[gte]": valueRange.from || undefined,
        "revenue_today[lte]": valueRange.to || undefined,
    };

    const { data, isLoading } = useGetReportsQuery(queryParams);

    const statsQueryParams = {
        limit: 1,
        search: debouncedSearch || undefined,
    };
    const { data: statsData } = useGetReportsQuery(statsQueryParams);

    const reportsList = data?.data || [];
    const totalPages = data?.pagination?.totalPages || 1;

    // Local sorting to ensure robust ordering
    const sortedReports = [...reportsList].sort((a, b) => {
        if (sortOption === "newest") {
            return new Date(b.created_at || b.date).getTime() - new Date(a.created_at || a.date).getTime();
        }
        if (sortOption === "oldest") {
            return new Date(a.created_at || a.date).getTime() - new Date(b.created_at || b.date).getTime();
        }
        if (sortOption === "a-z") {
            const nameA = a.sales ? `${a.sales.first_name} ${a.sales.last_name}`.toLowerCase() : "";
            const nameB = b.sales ? `${b.sales.first_name} ${b.sales.last_name}`.toLowerCase() : "";
            return nameA.localeCompare(nameB);
        }
        if (sortOption === "z-a") {
            const nameA = a.sales ? `${a.sales.first_name} ${a.sales.last_name}`.toLowerCase() : "";
            const nameB = b.sales ? `${b.sales.first_name} ${b.sales.last_name}`.toLowerCase() : "";
            return nameB.localeCompare(nameA);
        }
        return 0;
    });

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
            width: 140,
            height: 40,
            display: "flex",
            alignItems: "center",
          }}
        >
          {t('reports.title')}
        </div>

        <button
          onClick={() => {
            const activeFilters: string[] = [];
            if (debouncedSearch) activeFilters.push(`Search: "${debouncedSearch}"`);
            if (dateFilter?.startDate) activeFilters.push(`Date: ${dateFilter.startDate} → ${dateFilter.endDate ?? ''}`);
            if (valueRange.from || valueRange.to) activeFilters.push(`Value: ${valueRange.from ?? '0'} – ${valueRange.to ?? '∞'}`);
            exportReportsPDF(sortedReports as any[], activeFilters);
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
              onClick={() => setActiveFilter(activeFilter === "date" ? null : "date")}
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
                background: (hoveredFilter === 'date' || dateFilter || activeFilter === "date") ? "#E6E9F1" : "transparent",
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
              ) : activeFilter === "date" ? (
                <ChevronUp size={16} color="#4B5563" />
              ) : (
                <ChevronDown size={16} color="#4B5563" />
              )}
            </button>
            {activeFilter === "date" && (
              <div style={{ position: "absolute", top: "100%", left: 0, marginTop: 4, zIndex: 50 }}>
                <DateFilter
                  onClose={() => setActiveFilter(null)}
                  onApply={(data) => {
                    setDateFilter(data);
                    setActiveFilter(null);
                    setCurrentPage(1);
                  }}
                  onClear={() => {
                    setDateFilter(null);
                    setActiveFilter(null);
                    setCurrentPage(1);
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
              onClick={() => setActiveFilter(activeFilter === "value" ? null : "value")}
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
                minWidth: 120,
                gap: 8,
                background: (hoveredFilter === 'value' || (valueRange.from || valueRange.to) || activeFilter === "value") ? "#E6E9F1" : "transparent",
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
              ) : activeFilter === "value" ? (
                <ChevronUp size={16} color="#4B5563" />
              ) : (
                <ChevronDown size={16} color="#4B5563" />
              )}
            </button>
            {activeFilter === "value" && (
              <div style={{ position: "absolute", top: "100%", left: 0, marginTop: 4, zIndex: 50 }}>
                <Value
                  onClose={() => setActiveFilter(null)}
                  onApply={(val) => {
                    setValueRange({ from: val.from, to: val.to });
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

          {/* Reset Filters */}
          <button
            onClick={() => {
              setDateFilter(null);
              setValueRange({});
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

        {/* Sort by dropdown */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div className="filter-bar-right" style={{ position: "relative" }}>
            <button
              onClick={() => setActiveFilter(activeFilter === "sort" ? null : "sort")}
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
            {activeFilter === "sort" && (
              <div style={{ position: "absolute", top: "100%", right: 0, marginTop: 4, zIndex: 50 }}>
                <Sort 
                  isOpen={true} 
                  onClose={() => setActiveFilter(null)} 
                  defaultValue={sortOption}
                  onApply={(sortData) => {
                    setSortOption(sortData);
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
            justifyContent: "space-between",
            padding: "0 12px",
            boxSizing: "border-box",
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }}
        >
          {[
            { label: t("leads.colDate"),                 width: 70 },
            { label: t("leads.colCreatedBy"),           width: 146 },
            { label: t("sales.colRole"),                 width: 100 },
            { label: t("overview.calls"),                width: 41 },
            { label: t("overview.leadsContacted"),             width: 59 },
            { label: t("overview.followups"),            width: 65 },
            { label: t("overview.meetings"),             width: 60 },
            { label: t("overview.dealsClosed"),                width: 41 },
            { label: t("deals.colValue"),        width: 96 },
            { label: t("reports.colNotes"), width: 125 },
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
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Table Body */}
        <div style={{ width: "100%", background: "#fff" }}>
          {isLoading ? (
            <TableSkeleton columnWidths={[70, 146, 100, 41, 59, 65, 60, 41, 96, 125]} rowCount={10} />
          ) : sortedReports.length === 0 ? (
            <div style={{ padding: 24, textAlign: "center", color: "#6B7280", fontFamily: "Inter, sans-serif", fontSize: 14 }}>
              No reports found.
            </div>
          ) : (
            sortedReports.map((report, i, arr) => {
              const formattedDate = report.date
                ? new Date(report.date).toLocaleDateString("en-GB")
                : report.created_at
                ? new Date(report.created_at).toLocaleDateString("en-GB")
                : "--";
              const authorName = report.sales
                ? `${report.sales.first_name} ${report.sales.last_name}`
                : "System";

              return (
                <div
                  key={report.id}
                  className="responsive-table-row"
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 12px",
                    boxSizing: "border-box",
                    height: 72,
                    borderBottom: i < arr.length - 1 ? "1px solid rgba(237, 239, 242, 1)" : "none",
                  }}
                >
                  {/* Date */}
                  <div style={{ width: 70, flexShrink: 0, fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 13, lineHeight: "140%", letterSpacing: 0, color: "#4B5563" }}>
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
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {authorName}
                  </div>

                  {/* Role */}
                  <div
                    style={{
                      width: 100,
                      flexShrink: 0,
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 400,
                      fontSize: 13,
                      lineHeight: "140%",
                      color: "var(--Foundation-neutral-neutral-800, #464646)",
                    }}
                  >
                    Sales Agent
                  </div>

                  {/* Calls */}
                  <div style={{ width: 41, flexShrink: 0, fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 13, lineHeight: "140%", letterSpacing: 0, color: "#4B5563" }}>
                    {report.calls_today}
                  </div>

                  {/* Contacts */}
                  <div style={{ width: 59, flexShrink: 0, fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 13, lineHeight: "140%", letterSpacing: 0, color: "#4B5563" }}>
                    {report.leads_contacted_today}
                  </div>

                  {/* Followups */}
                  <div style={{ width: 65, flexShrink: 0, fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 13, lineHeight: "140%", letterSpacing: 0, color: "#4B5563" }}>
                    {report.follow_ups_today}
                  </div>

                  {/* Meetings */}
                  <div style={{ width: 60, flexShrink: 0, fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 13, lineHeight: "140%", letterSpacing: 0, color: "#4B5563" }}>
                    {report.meetings_today}
                  </div>

                  {/* Deals */}
                  <div style={{ width: 41, flexShrink: 0, fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 13, lineHeight: "140%", letterSpacing: 0, color: "#4B5563" }}>
                    {report.deals_closed_today}
                  </div>

                  {/* Deals Value */}
                  <div style={{ width: 96, flexShrink: 0, fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 13, lineHeight: "140%", letterSpacing: 0, color: "#4B5563" }}>
                    {report.revenue_today ? report.revenue_today.toLocaleString() : "0"}
                  </div>

                  {/* Top Priority & notes */}
                  <div style={{ width: 125, flexShrink: 0, display: "flex", alignItems: "center" }}>
                    <img src={mailIcon} alt="Email" width={24} height={24} style={{ cursor: "pointer" }} onClick={() => setSelectedReport(report)} />
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
      {selectedReport && (
        <ModalOverlay onClose={() => setSelectedReport(null)}>
          <Top_Periority_notes
            onClose={() => setSelectedReport(null)}
            priorityText={selectedReport.top_periority_tomorrow}
            notesText={selectedReport.additional_notes}
          />
        </ModalOverlay>
      )}
    </div>
  )
}

export default Reports