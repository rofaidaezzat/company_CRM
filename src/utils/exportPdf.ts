import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ─── Brand colours ────────────────────────────────────────────────────────────
const BRAND_DARK = [0, 35, 111] as [number, number, number];   // #00236F
const HEADER_BG  = [230, 233, 241] as [number, number, number]; // #E6E9F1
const HEADER_TXT = [20, 20, 20] as [number, number, number];    // #141414
const ROW_ALT    = [250, 251, 253] as [number, number, number]; // light stripe
const BORDER_CLR = [212, 213, 216] as [number, number, number]; // #D4D5D8

// ─── Helpers ──────────────────────────────────────────────────────────────────
const today = () => new Date().toLocaleDateString('en-GB'); // DD/MM/YYYY

function addHeader(doc: jsPDF, title: string, filters: string[]) {
  const pageW = doc.internal.pageSize.getWidth();

  // Top bar
  doc.setFillColor(...BRAND_DARK);
  doc.rect(0, 0, pageW, 18, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text(title, 14, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Exported: ${today()}`, pageW - 14, 12, { align: 'right' });

  // Active filters row (if any)
  if (filters.length > 0) {
    doc.setFillColor(245, 246, 250);
    doc.rect(0, 18, pageW, 8, 'F');
    doc.setTextColor(...BRAND_DARK);
    doc.setFontSize(7.5);
    doc.text(`Filters: ${filters.join('  |  ')}`, 14, 23.5);
  }
}

function buildDoc(
  title: string,
  columns: string[],
  rows: (string | number)[][],
  filters: string[],
) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
  addHeader(doc, title, filters);
  const startY = filters.length > 0 ? 30 : 22;

  autoTable(doc, {
    startY,
    head: [columns],
    body: rows,
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 8,
      cellPadding: 4,
      textColor: HEADER_TXT,
      lineColor: BORDER_CLR,
      lineWidth: 0.4,
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: HEADER_BG,
      textColor: HEADER_TXT,
      fontStyle: 'bold',
      fontSize: 8.5,
    },
    alternateRowStyles: { fillColor: ROW_ALT },
    columnStyles: { 0: { cellWidth: 55 } },
    margin: { left: 14, right: 14 },
  });

  // Page numbers
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageH = doc.internal.pageSize.getHeight();
    const pageW = doc.internal.pageSize.getWidth();
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${pageCount}`, pageW - 14, pageH - 6, { align: 'right' });
  }

  return doc;
}

// ─── Public helpers ────────────────────────────────────────────────────────────

/** Format ISO/date to DD/MM/YYYY */
export function fmtDate(val?: string | null): string {
  if (!val) return '--';
  return new Date(val).toLocaleDateString('en-GB');
}

// ─── LEADS export ─────────────────────────────────────────────────────────────
export interface LeadRow {
  created_at: string;
  name?: string;
  company_name?: string;
  assigned_to?: { first_name?: string; last_name?: string } | null;
  status?: string;
  phone?: string;
  priority?: string;
  source?: string;
  next_followup?: string | null;
}

export function exportLeadsPDF(leads: LeadRow[], filters: string[]) {
  const columns = ['Date', 'Lead Name', 'Company', 'Assigned To', 'Status', 'Phone', 'Priority', 'Source', 'Next Followup'];
  const rows = leads.map(l => [
    fmtDate(l.created_at),
    l.name || '--',
    l.company_name || '--',
    l.assigned_to ? `${l.assigned_to.first_name ?? ''} ${l.assigned_to.last_name ?? ''}`.trim() : '--',
    l.status ? l.status.replace(/_/g, ' ') : '--',
    l.phone || '--',
    l.priority || '--',
    l.source || '--',
    fmtDate(l.next_followup),
  ]);
  buildDoc('Leads Report', columns, rows, filters).save(`leads_${today().replace(/\//g, '-')}.pdf`);
}

// ─── DEALS export ─────────────────────────────────────────────────────────────
export interface DealRow {
  created_at: string;
  author?: { first_name?: string; last_name?: string } | null;
  lead?: { name?: string; phone?: string; company_name?: string } | null;
  city?: string;
  value?: number | string;
  service_details?: string;
}

export function exportDealsPDF(deals: DealRow[], filters: string[]) {
  const columns = ['Date', 'Created By', 'Customer Name', 'Company', 'Phone', 'City', 'Service Details', 'Value (EGP)'];
  const rows = deals.map(d => [
    fmtDate(d.created_at),
    d.author ? `${d.author.first_name ?? ''} ${d.author.last_name ?? ''}`.trim() : '--',
    d.lead?.name || '--',
    (d.lead as any)?.company_name || '--',
    d.lead?.phone || '--',
    d.city || '--',
    d.service_details || '--',
    d.value !== undefined && d.value !== null ? String(d.value) : '--',
  ]);
  buildDoc('Deals Report', columns, rows, filters).save(`deals_${today().replace(/\//g, '-')}.pdf`);
}

// ─── SALES export ─────────────────────────────────────────────────────────────
export interface SalesRow {
  name?: string;
  phone?: string;
  role?: string;
  start_date?: string;
  status?: string;
  leads?: number | string;
  deals?: number | string;
  revenue?: number | string;
  target_progress?: number | string;
}

export function exportSalesPDF(sales: SalesRow[], filters: string[]) {
  const columns = ['Name', 'Phone', 'Role', 'Start Date', 'Status', 'Leads', 'Deals', 'Revenue (EGP)', 'Target %'];
  const rows = sales.map(s => [
    s.name || '--',
    s.phone || '--',
    s.role || '--',
    fmtDate(s.start_date),
    s.status || '--',
    s.leads !== undefined ? String(s.leads) : '--',
    s.deals !== undefined ? String(s.deals) : '--',
    s.revenue !== undefined ? String(s.revenue) : '--',
    s.target_progress !== undefined ? `${s.target_progress}%` : '--',
  ]);
  buildDoc('Sales Report', columns, rows, filters).save(`sales_${today().replace(/\//g, '-')}.pdf`);
}

// ─── REPORTS export ────────────────────────────────────────────────────────────
export interface ReportRow {
  date?: string;
  created_at?: string;
  sales?: { first_name?: string; last_name?: string } | null;
  role?: string;
  calls_today?: number;
  leads_contacted_today?: number;
  follow_ups_today?: number;
  meetings_today?: number;
  deals_closed_today?: number;
  revenue_today?: number;
  top_periority_tomorrow?: string;
  additional_notes?: string;
}

export function exportReportsPDF(reports: ReportRow[], filters: string[]) {
  const columns = ['Date', 'Sales Agent', 'Role', 'Calls', 'Contacts', 'Follow-ups', 'Meetings', 'Deals', 'Revenue (EGP)', 'Top Priority'];
  const rows = reports.map(r => [
    fmtDate(r.date || r.created_at),
    r.sales ? `${r.sales.first_name ?? ''} ${r.sales.last_name ?? ''}`.trim() : '--',
    r.role || 'Sales Agent',
    r.calls_today ?? '--',
    r.leads_contacted_today ?? '--',
    r.follow_ups_today ?? '--',
    r.meetings_today ?? '--',
    r.deals_closed_today ?? '--',
    r.revenue_today !== undefined ? r.revenue_today.toLocaleString() : '--',
    r.top_periority_tomorrow || '--',
  ]);
  buildDoc('Reports', columns, rows, filters).save(`reports_${today().replace(/\//g, '-')}.pdf`);
}
