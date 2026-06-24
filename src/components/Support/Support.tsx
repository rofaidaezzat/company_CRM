import React, { useState, useRef, useEffect } from 'react';
import '../../styles/support-drawer-mobile.css';
import { useTranslation } from '../../context/LanguageContext';
import {
  useGetTicketsQuery,
  useCreateTicketMutation,
  SupportTicket,
  TicketStatus,
  useGetSupportMessagesQuery,
  useCreateSupportMessageMutation,
  SupportMessage,
} from '../../app/service/crudSupport ticket';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Map API status → UI display label */
const statusLabel: Record<TicketStatus, string> = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  CLOSED: 'Closed',
};

/** Map UI tab → API status for filter query */
const tabToStatus: Record<'Open' | 'Resolved', TicketStatus | undefined> = {
  Open: 'OPEN',
  Resolved: undefined, // show CLOSED + IN_PROGRESS under "Resolved"
};

/** Format ISO date string to "DD/MM/YYYY , HH:mm" */
const formatDate = (iso: string) => {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} , ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

/** Human-readable relative time */
const relativeTime = (iso: string) => {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) > 1 ? 's' : ''} ago`;
  return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) > 1 ? 's' : ''} ago`;
};

/** Badge colours for each status */
const badgeStyle = (status: TicketStatus): React.CSSProperties => {
  if (status === 'OPEN') return { background: 'rgba(254, 226, 226, 1)', color: 'rgba(239, 68, 68, 1)' };
  if (status === 'IN_PROGRESS') return { background: 'rgba(255, 237, 213, 1)', color: 'rgba(194, 65, 12, 1)' };
  return { background: 'rgba(209, 250, 229, 1)', color: 'rgba(6, 95, 70, 1)' };
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface Report_BugProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

const Report_Bug: React.FC<Report_BugProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [view, setView] = useState<'LIST' | 'CREATE' | 'DETAILS'>('LIST');
  const [activeTab, setActiveTab] = useState<'Open' | 'Resolved'>('Open');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  // New ticket form inputs
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [replyText, setReplyText] = useState('');

  // Scroll ref for chat window
  const chatEndRef = useRef<HTMLDivElement>(null);

  // ── API hooks ──────────────────────────────────────────────────────────────

  const { data: ticketsData, isLoading, isFetching } = useGetTicketsQuery(
    undefined,
    { skip: !isOpen, refetchOnMountOrArgChange: true }
  );

  const [createTicket, { isLoading: isCreating }] = useCreateTicketMutation();

  const { data: messagesData } = useGetSupportMessagesQuery(
    { ticketId: selectedTicket?.id ?? '' },
    { skip: !selectedTicket || view !== 'DETAILS', refetchOnMountOrArgChange: true }
  );

  const [createSupportMessage] = useCreateSupportMessageMutation();

  // All tickets from API
  const allTickets: SupportTicket[] = ticketsData?.data ?? [];

  // Filter by tab: "Open" → OPEN only; "Resolved" → CLOSED + IN_PROGRESS
  const filteredTickets = allTickets.filter(t =>
    activeTab === 'Open' ? t.status === 'OPEN' : t.status !== 'OPEN'
  );

  // ── Effects ────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (view === 'DETAILS') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [view, selectedTicket, messagesData]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setView('LIST');
      setSelectedTicket(null);
      setTitle('');
      setDescription('');
    }, 300);
  };

  const handleCreateTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    try {
      await createTicket({ title: title.trim(), description: description.trim() }).unwrap();
      setTitle('');
      setDescription('');
      setView('LIST');
      setActiveTab('Open');
    } catch (err) {
      console.error('Failed to create ticket:', err);
    }
  };

  const handleTicketCardClick = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setView('DETAILS');
  };

  const handleSendMessage = async () => {
    if (!replyText.trim() || !selectedTicket) return;
    try {
      await createSupportMessage({
        ticketId: selectedTicket.id,
        message: replyText.trim(),
      }).unwrap();
      setReplyText('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Backdrop overlay */}
      {isOpen && (
        <div
          onClick={handleClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(20, 20, 20, 0.4)',
            zIndex: 1100,
            backdropFilter: 'blur(4px)',
            transition: 'opacity 0.3s ease',
          }}
        />
      )}

      {/* Drawer Panel */}
      <div
        className="support-drawer-panel"
        style={{
          width: '521px',
          height: '100vh',
          background: 'var(--Foundation-neutral-white, #FFF)',
          boxShadow: '-1px 0 4px 0 rgba(0, 0, 0, 0.10)',
          position: 'fixed',
          top: 0,
          right: 0,
          zIndex: 1200,
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          padding: '34px 24px 24px 24px',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {/* VIEW 1: TICKET LIST VIEW */}
        {view === 'LIST' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
            {/* Header (First Part) */}
            <div
              className="support-drawer-header"
              style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
              }}
            >
              {/* Title & Icon */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ width: '24px', height: '24px', flexShrink: 0 }}
                >
                  <path
                    d="M11.9991 15.375V12M11.9991 8.625V8.70959M20.9983 12C20.9983 13.2938 20.7253 14.5238 20.2338 15.6356L21 20.9991L16.4039 19.85C15.1019 20.5823 13.5993 21 11.9991 21C7.02906 21 3 16.9706 3 12C3 7.02944 7.02906 3 11.9991 3C16.9692 3 20.9983 7.02944 20.9983 12Z"
                    stroke="#141414"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span style={{ fontSize: '18px', fontWeight: 600, color: '#141414' }}>{t('modal.supportTitle')}</span>
              </div>

              {/* Close Button */}
              <div
                onClick={handleClose}
                style={{
                  borderRadius: 99,
                  background: 'var(--Foundation-neutral-white, #FFF)',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.11)',
                  display: 'flex',
                  width: '36px',
                  height: '36px',
                  padding: '6px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  aspectRatio: '1 / 1',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                  flexShrink: 0,
                  transition: 'box-shadow 0.15s',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 5L5 15M5 5L15 15" stroke="#464646" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* List Inner Container (Toggle + Cards List) */}
            <div
              className="support-drawer-inner"
              style={{
                display: 'flex',
                width: '100%',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                gap: '20px',
                flex: 1,
                minHeight: 0,
              }}
            >
              {/* Toggle tabs (Open / Resolved) */}
              <div
                style={{
                  borderRadius: '12px',
                  border: '1px solid var(--Foundation-neutral-neutral-100, #D4D5D8)',
                  display: 'flex',
                  height: '32px',
                  alignItems: 'center',
                  background: 'transparent',
                  padding: '2px',
                }}
              >
                {(['Open', 'Resolved'] as const).map(tab => {
                  const isActive = activeTab === tab;
                  return (
                    <div
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      style={{
                        borderRadius: '10px',
                        background: isActive ? 'var(--Foundation-brand-brand-50, #E6E9F1)' : 'transparent',
                        display: 'flex',
                        height: '28px',
                        padding: '0 16px',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: 'background 0.15s ease',
                      }}
                    >
                      <span
                        style={{
                          fontWeight: isActive ? 600 : 400,
                          fontSize: '13px',
                          color: isActive ? '#00236F' : '#808080',
                        }}
                      >
                        {tab === 'Open' ? t('modal.ticketStatusOpen') : t('modal.ticketStatusClosed')}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Scrollable Cards List */}
              <div
                style={{
                  width: '100%',
                  flex: 1,
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  paddingRight: '4px',
                }}
              >
                {/* Loading state */}
                {(isLoading || isFetching) && (
                  <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '40px', color: '#808080', fontSize: '14px' }}>
                    {t('modal.loadingTickets')}
                  </div>
                )}

                {/* Tickets */}
                {!isLoading && !isFetching && filteredTickets.length > 0 &&
                  filteredTickets.map(ticket => (
                    <div
                      key={ticket.id}
                      className="support-drawer-card"
                      onClick={() => handleTicketCardClick(ticket)}
                      style={{
                        background: 'var(--Foundation-brand-brand-50, #E6E9F1)',
                        display: 'flex',
                        width: '100%',
                        padding: '8px 12px',
                        alignItems: 'flex-start',
                        gap: '12px',
                        borderRadius: '12px',
                        boxSizing: 'border-box',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.opacity = '0.9';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.opacity = '1';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      {/* User silhouette icon */}
                      <div
                        style={{
                          borderRadius: '99px',
                          background: 'var(--Foundation-neutral-neutral-500, #808080)',
                          display: 'flex',
                          width: '32px',
                          height: '32px',
                          padding: '6px',
                          justifyContent: 'center',
                          alignItems: 'center',
                          flexShrink: 0,
                          boxSizing: 'border-box',
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 21C20 19.6044 19.5 18.223 18.2 17.306C16.8 16.418 15.0 16 12.0 16C9.0 16 7.2 16.418 5.8 17.306C4.5 18.223 4.0 19.6044 4.0 21" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round" />
                          <circle cx="12" cy="8" r="4.5" stroke="#FFF" strokeWidth="2.5" />
                        </svg>
                      </div>

                      {/* Ticket Card Details */}
                      <div className="support-drawer-card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div
                          className="support-drawer-card-title-row"
                          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}
                        >
                          <span
                            className="support-drawer-card-title"
                            style={{
                              fontSize: '14px',
                              fontWeight: 600,
                              color: '#141414',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              maxWidth: '300px',
                            }}
                          >
                            {ticket.title}
                          </span>

                          {/* Status Badge */}
                          <span
                            className="support-drawer-card-badge"
                            style={{
                              fontSize: '11px',
                              fontWeight: 500,
                              borderRadius: '99px',
                              padding: '2px 8px',
                              flexShrink: 0,
                              ...badgeStyle(ticket.status),
                            }}
                          >
                            {ticket.status === 'OPEN'
                              ? t('modal.ticketStatusOpen')
                              : ticket.status === 'IN_PROGRESS'
                              ? t('modal.ticketStatusInProgress')
                              : t('modal.ticketStatusClosed')}
                          </span>
                        </div>

                        {/* Description snippet */}
                        <span
                          className="support-drawer-card-desc"
                          style={{
                            fontSize: '13px',
                            color: '#464646',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '380px',
                            lineHeight: '1.4',
                          }}
                        >
                          {ticket.description}
                        </span>

                        {/* Time */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                          <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{relativeTime(ticket.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                }

                {/* Empty state */}
                {!isLoading && !isFetching && filteredTickets.length === 0 && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      color: '#808080',
                      fontSize: '14px',
                      gap: '8px',
                      paddingTop: '40px',
                    }}
                  >
                    <span>{t('modal.noTicketsFound')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Plus FAB */}
            <button
              onClick={() => setView('CREATE')}
              style={{
                borderRadius: '12px',
                background: 'var(--Foundation-brand-brand-500, #00236F)',
                boxShadow: '0 0 3px 3px rgba(0, 0, 0, 0.13)',
                display: 'inline-flex',
                height: '48px',
                padding: '8px 24px',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                position: 'absolute',
                bottom: '32px',
                right: '24px',
                cursor: 'pointer',
                border: 'none',
                boxSizing: 'border-box',
                transition: 'transform 0.2s ease, opacity 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ width: '20px', height: '20px', flexShrink: 0 }}>
                <path d="M12 5V19M5 12H19" stroke="#F5F6FA" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span
                style={{
                  color: 'var(--Foundation-neutral-neutral-25, #F5F6FA)',
                  textAlign: 'center',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '16px',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  lineHeight: 'normal',
                }}
              >
                {t('modal.newTicketButton')}
              </span>
            </button>
          </div>
        )}

        {/* VIEW 2: NEW SUPPORT TICKET VIEW */}
        {view === 'CREATE' && (
          <form
            onSubmit={handleCreateTicketSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            {/* Header */}
            <div
              className="support-drawer-header"
              style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '32px',
              }}
            >
              {/* Back breadcrumb & Title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span
                  onClick={() => setView('LIST')}
                  style={{
                    fontSize: '18px',
                    fontWeight: 500,
                    color: '#808080',
                    cursor: 'pointer',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#141414')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#808080')}
                >
                  {t('modal.supportTitle')}
                </span>
                <span style={{ fontSize: '18px', fontWeight: 500, color: '#808080' }}>/</span>
                <span style={{ fontSize: '18px', fontWeight: 600, color: '#141414', marginLeft: '4px' }}>
                  {t('modal.newSupportTicketTitle')}
                </span>
              </div>

              {/* Close Button */}
              <div
                onClick={handleClose}
                style={{
                  borderRadius: 99,
                  background: 'var(--Foundation-neutral-white, #FFF)',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.11)',
                  display: 'flex',
                  width: '36px',
                  height: '36px',
                  padding: '6px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  aspectRatio: '1 / 1',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                  flexShrink: 0,
                  transition: 'box-shadow 0.15s',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 5L5 15M5 5L15 15" stroke="#464646" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Form Fields container */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
              {/* Title input row */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '8px',
                  alignSelf: 'stretch',
                }}
              >
                <label style={{ fontSize: '14px', fontWeight: 500, color: 'var(--Foundation-neutral-neutral-950, #141414)' }}>
                  {t('modal.ticketTitleLabel')}<span style={{ color: '#00236F' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder={t('modal.ticketTitlePlaceholder')}
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  style={{
                    width: '100%',
                    height: '40px',
                    borderRadius: '8px',
                    border: '1px solid var(--Foundation-neutral-neutral-100, #D4D5D8)',
                    background: 'transparent',
                    padding: '0 12px',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Description input row */}
              <div
                style={{
                  display: 'flex',
                  height: '213px',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '8px',
                  alignSelf: 'stretch',
                }}
              >
                <label style={{ fontSize: '14px', fontWeight: 500, color: 'var(--Foundation-neutral-neutral-950, #141414)' }}>
                  {t('modal.ticketDescLabel')}<span style={{ color: '#00236F' }}>*</span>
                </label>
                <textarea
                  placeholder={t('modal.ticketDescPlaceholder')}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '8px',
                    border: '1px solid var(--Foundation-neutral-neutral-100, #D4D5D8)',
                    background: 'transparent',
                    padding: '12px',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Send Button container */}
            <div className="support-drawer-send-container" style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: '40px' }}>
              <button
                className="support-drawer-send-btn"
                type="submit"
                disabled={!title.trim() || !description.trim() || isCreating}
                style={{
                  borderRadius: '12px',
                  background:
                    title.trim() && description.trim() && !isCreating
                      ? 'var(--Foundation-brand-brand-500, #00236F)'
                      : 'var(--Foundation-neutral-neutral-100, #D4D5D8)',
                  display: 'flex',
                  width: '273px',
                  height: '48px',
                  padding: '8px 24px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px',
                  border: 'none',
                  cursor: title.trim() && description.trim() && !isCreating ? 'pointer' : 'not-allowed',
                  color: title.trim() && description.trim() && !isCreating ? '#FFF' : '#808080',
                  fontSize: '16px',
                  fontWeight: 500,
                  boxSizing: 'border-box',
                  transition: 'background 0.2s ease',
                }}
              >
                {isCreating ? t('modal.sending') : t('modal.sendButton')}
              </button>
            </div>
          </form>
        )}

        {/* VIEW 3: TICKET DETAILS VIEW */}
        {view === 'DETAILS' && selectedTicket && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
            {/* Header */}
            <div
              className="support-drawer-details-header"
              style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '32px',
              }}
            >
              {/* Back breadcrumb & Title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', maxWidth: '380px' }}>
                <span
                  onClick={() => setView('LIST')}
                  style={{
                    fontSize: '18px',
                    fontWeight: 500,
                    color: '#808080',
                    cursor: 'pointer',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#141414')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#808080')}
                >
                  {t('modal.supportTitle')}
                </span>
                <span style={{ fontSize: '18px', fontWeight: 500, color: '#808080' }}>/</span>
                <span
                  style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    color: '#141414',
                    marginLeft: '4px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '220px',
                  }}
                >
                  {selectedTicket.title}
                </span>
              </div>

              {/* Close Button */}
              <div
                onClick={handleClose}
                style={{
                  borderRadius: 99,
                  background: 'var(--Foundation-neutral-white, #FFF)',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.11)',
                  display: 'flex',
                  width: '36px',
                  height: '36px',
                  padding: '6px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  aspectRatio: '1 / 1',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                  flexShrink: 0,
                  transition: 'box-shadow 0.15s',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 5L5 15M5 5L15 15" stroke="#464646" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Status Badge (aligned right) */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginBottom: '16px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 500,
                  borderRadius: '99px',
                  padding: '2px 8px',
                  ...badgeStyle(selectedTicket.status),
                }}
              >
                {selectedTicket.status === 'OPEN'
                  ? t('modal.ticketStatusOpen')
                  : selectedTicket.status === 'IN_PROGRESS'
                  ? t('modal.ticketStatusInProgress')
                  : t('modal.ticketStatusClosed')}
              </span>
            </div>

            {/* Ticket Info Area (shows description as first "message" from user, followed by subsequent replies) */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                paddingRight: '4px',
                marginBottom: '20px',
              }}
            >
              {/* Creator initial description bubble */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
                <div
                  className="support-drawer-message-bubble"
                  style={{
                    background: '#FFF',
                    border: '1px solid var(--Foundation-neutral-neutral-100, #D4D5D8)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    width: '390px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    boxSizing: 'border-box',
                  }}
                >
                  {/* Date/Time */}
                  <span style={{ fontSize: '11px', color: '#808080', textAlign: 'center', width: '100%', display: 'block' }}>
                    {formatDate(selectedTicket.created_at)}
                  </span>

                  {/* Title */}
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#141414', lineHeight: '1.5', wordBreak: 'break-word' }}>
                    {selectedTicket.title}
                  </span>

                  {/* Description body */}
                  <span
                    style={{
                      fontSize: '13px',
                      color: '#464646',
                      lineHeight: '1.5',
                      textAlign: 'left',
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                    }}
                  >
                    {selectedTicket.description}
                  </span>

                  {/* Author */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'stretch' }}>
                    <span style={{ fontSize: '11px', color: '#808080', fontWeight: 500 }}>
                      {selectedTicket.created_by.first_name} {selectedTicket.created_by.last_name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Chat replies history */}
              {messagesData?.data?.map((msg) => {
                const isCreator = msg.sender?.id === selectedTicket.created_by.id;
                return (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isCreator ? 'flex-start' : 'flex-end',
                      width: '100%',
                    }}
                  >
                    <div
                      className="support-drawer-message-bubble"
                      style={{
                        background: isCreator ? '#FFF' : '#F0F4FF',
                        border: isCreator
                          ? '1px solid var(--Foundation-neutral-neutral-100, #D4D5D8)'
                          : '1px solid var(--Foundation-brand-brand-100, #E0E7FF)',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        width: '390px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        boxSizing: 'border-box',
                      }}
                    >
                      {/* Date/Time */}
                      <span style={{ fontSize: '11px', color: '#808080', textAlign: 'center', width: '100%', display: 'block' }}>
                        {formatDate(msg.created_at)}
                      </span>

                      {/* Message body */}
                      <span
                        style={{
                          fontSize: '13px',
                          color: '#464646',
                          lineHeight: '1.5',
                          textAlign: 'left',
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
                        }}
                      >
                        {msg.message}
                      </span>

                      {/* Author */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'stretch' }}>
                        <span style={{ fontSize: '11px', color: '#808080', fontWeight: 500 }}>
                          {msg.sender ? `${msg.sender.first_name} ${msg.sender.last_name}` : 'Support Agent'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div ref={chatEndRef} />
            </div>

            {/* Reply input — shown only for OPEN tickets */}
            {selectedTicket.status === 'OPEN' ? (
              <div
                style={{
                  borderRadius: '8px',
                  border: '1px solid var(--Foundation-neutral-neutral-100, #D4D5D8)',
                  display: 'flex',
                  padding: '12px',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  gap: '8px',
                  alignSelf: 'stretch',
                  boxSizing: 'border-box',
                  width: '100%',
                }}
              >
                {/* Textarea — grows to fill available space and matches tall design in screenshot */}
                <textarea
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey && replyText.trim()) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={t('modal.replyPlaceholder')}
                  style={{
                    flex: '1 0 0',
                    height: '72px',
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    fontSize: '14px',
                    color: '#141414',
                    fontFamily: 'Inter, sans-serif',
                    resize: 'none',
                    padding: 0,
                    margin: 0,
                  }}
                />

                {/* Send button */}
                <button
                  type="button"
                  onClick={handleSendMessage}
                  style={{
                    borderRadius: '12px',
                    background: 'var(--Foundation-brand-brand-500, #00236F)',
                    display: 'flex',
                    width: '36px',
                    height: '36px',
                    padding: '6px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    aspectRatio: '1/1',
                    border: 'none',
                    cursor: 'pointer',
                    flexShrink: 0,
                    boxSizing: 'border-box',
                    transition: 'opacity 0.2s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                >
                  {/* Right-pointing chevron icon matching screenshot */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="7"
                    height="12"
                    viewBox="0 0 7 12"
                    fill="none"
                    style={{
                      width: '7px',
                      height: '12px',
                      display: 'block',
                    }}
                  >
                    <path
                      d="M1 1L6 6L1 11"
                      stroke="#F5F6FA"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '12px',
                  borderRadius: '8px',
                  background: 'rgba(209, 250, 229, 0.4)',
                  fontSize: '13px',
                  color: '#065F46',
                }}
              >
                {selectedTicket.status === 'CLOSED'
                  ? t('modal.ticketClosedMessage')
                  : selectedTicket.status === 'IN_PROGRESS'
                  ? t('modal.ticketInProgressMessage')
                  : t('modal.ticketOpenMessage')}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Report_Bug;
