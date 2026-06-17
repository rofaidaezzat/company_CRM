import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: number;
  text: string;
  sender: 'You' | 'Tech support';
  date: string;
}

interface Ticket {
  id: number;
  title: string;
  description: string;
  status: 'Open' | 'Resolved';
  time: string;
  unread: boolean;
  messages: Message[];
}

interface Report_BugProps {
  isOpen: boolean;
  onClose: () => void;
}

const Report_Bug: React.FC<Report_BugProps> = ({ isOpen, onClose }) => {
  // Navigation states: 'LIST' | 'CREATE' | 'DETAILS'
  const [view, setView] = useState<'LIST' | 'CREATE' | 'DETAILS'>('LIST');
  const [activeTab, setActiveTab] = useState<'Open' | 'Resolved'>('Open');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  // New ticket form inputs
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Chat message input
  const [replyText, setReplyText] = useState('');

  // Scroll ref for chat window
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Mock initial support tickets
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: 1,
      title: "UI alignment issue",
      description: "Lorem ipsum dolor sit amet consectetur. Nullam se...",
      status: "Open",
      time: "1 hour ago",
      unread: true,
      messages: [
        {
          id: 1,
          sender: "You",
          text: "Lorem ipsum dolor sit amet consectetur. Nec enim morbi tristique amet urna. Commodo venenatis libero in id aliquet morbi purus. Interdum commodo at amet eget. Tempor morbi tristique dapibus a dolor blandit.",
          date: "25/03/2026 , 07:22"
        },
        {
          id: 2,
          sender: "Tech support",
          text: "Lorem ipsum dolor sit amet consectetur. Nec enim morbi tristique amet urna. Commodo venenatis libero in id aliquet morbi purus. Interdum commodo at amet eget. Tempor morbi tristique dapibus a dolor blandit.",
          date: "25/03/2026 , 07:22"
        },
        {
          id: 3,
          sender: "You",
          text: "Lorem ipsum dolor sit amet consectetur. Nec enim morbi tristique amet urna. Commodo venenatis libero in id aliquet morbi purus. Interdum commodo at amet eget. Tempor morbi tristique dapibus a dolor blandit.",
          date: "25/03/2026 , 07:22"
        }
      ]
    },
    {
      id: 2,
      title: "Login page button not responsive",
      description: "Lorem ipsum dolor sit amet consectetur. Nullam se...",
      status: "Resolved",
      time: "1 hour ago",
      unread: false,
      messages: [
        {
          id: 1,
          sender: "You",
          text: "Lorem ipsum dolor sit amet consectetur. Nec enim morbi tristique amet urna. Commodo venenatis libero in id aliquet morbi purus. Interdum commodo at amet eget. Tempor morbi tristique dapibus a dolor blandit.",
          date: "25/03/2026 , 07:22"
        },
        {
          id: 2,
          sender: "Tech support",
          text: "We have updated the styling and JS handlers on the login page button. The login should now be completely functional on all mobile viewports.",
          date: "25/03/2026 , 07:22"
        }
      ]
    },
    {
      id: 3,
      title: "Data loading error on dashboard",
      description: "Lorem ipsum dolor sit amet...",
      status: "Resolved",
      time: "1 hour ago",
      unread: false,
      messages: [
        {
          id: 1,
          sender: "You",
          text: "The dashboard is showing a loading spinner indefinitely. Can you check?",
          date: "24/03/2026 , 09:15"
        },
        {
          id: 2,
          sender: "Tech support",
          text: "This was due to a database connection timeout. We've optimized the query and it is resolved now.",
          date: "24/03/2026 , 10:00"
        }
      ]
    },
    {
      id: 4,
      title: "CSV Export formatting issue",
      description: "Lorem ipsum dolor sit amet...",
      status: "Resolved",
      time: "1 hour ago",
      unread: false,
      messages: [
        {
          id: 1,
          sender: "You",
          text: "Exporting CSV splits columns incorrectly when text has commas.",
          date: "20/03/2026 , 15:40"
        },
        {
          id: 2,
          sender: "Tech support",
          text: "We have updated the exporter to wrap comma-containing fields in double quotes. The formatting should be correct now.",
          date: "20/03/2026 , 16:30"
        }
      ]
    }
  ]);

  // Scroll to bottom of chat when new message is added or details view opens
  useEffect(() => {
    if (view === 'DETAILS') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [view, selectedTicket?.messages]);

  // Handle drawer close (reset state)
  const handleClose = () => {
    onClose();
    // Wait for slide-out animation to finish before resetting view
    setTimeout(() => {
      setView('LIST');
      setSelectedTicket(null);
      setTitle('');
      setDescription('');
      setReplyText('');
    }, 300);
  };

  const handleCreateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newTicketId = tickets.length + 1;
    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} , ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newTicket: Ticket = {
      id: newTicketId,
      title: title.trim(),
      description: description.trim(),
      status: 'Open',
      time: 'Just now',
      unread: false,
      messages: [
        {
          id: 1,
          sender: 'You',
          text: description.trim(),
          date: formattedDate
        }
      ]
    };

    setTickets([newTicket, ...tickets]);
    setTitle('');
    setDescription('');
    setView('LIST');
    setActiveTab('Open');
  };

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} , ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newMessage: Message = {
      id: selectedTicket.messages.length + 1,
      sender: 'You',
      text: replyText.trim(),
      date: formattedDate
    };

    // Update messages in local state
    const updatedTickets = tickets.map(t => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          messages: [...t.messages, newMessage]
        };
      }
      return t;
    });

    setTickets(updatedTickets);
    setSelectedTicket(prev => prev ? { ...prev, messages: [...prev.messages, newMessage] } : null);
    setReplyText('');
  };

  const handleTicketCardClick = (ticket: Ticket) => {
    // Mark as read when clicked
    if (ticket.unread) {
      setTickets(tickets.map(t => t.id === ticket.id ? { ...t, unread: false } : t));
    }
    setSelectedTicket({ ...ticket, unread: false });
    setView('DETAILS');
  };

  // Filtered tickets based on active tab
  const filteredTickets = tickets.filter(t => t.status === activeTab);

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
                <span style={{ fontSize: '18px', fontWeight: 600, color: '#141414' }}>Support</span>
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
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 5L5 15M5 5L15 15"
                    stroke="#464646"
                    strokeWidth="1.67"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
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
                        background: isActive
                          ? 'var(--Foundation-brand-brand-50, #E6E9F1)'
                          : 'transparent',
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
                        {tab}
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
                {filteredTickets.length > 0 ? (
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
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M20 21C20 19.6044 19.5 18.223 18.2 17.306C16.8 16.418 15.0 16 12.0 16C9.0 16 7.2 16.418 5.8 17.306C4.5 18.223 4.0 19.6044 4.0 21"
                            stroke="#FFF"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                          <circle cx="12" cy="8" r="4.5" stroke="#FFF" strokeWidth="2.5" />
                        </svg>
                      </div>

                      {/* Ticket Card Details */}
                      <div className="support-drawer-card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div
                          className="support-drawer-card-title-row"
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%',
                          }}
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
                              background:
                                ticket.status === 'Open'
                                  ? 'rgba(254, 226, 226, 1)'
                                  : 'rgba(209, 250, 229, 1)',
                              color:
                                ticket.status === 'Open'
                                  ? 'rgba(239, 68, 68, 1)'
                                  : 'rgba(6, 95, 70, 1)',
                              flexShrink: 0,
                            }}
                          >
                            {ticket.status}
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

                        {/* Time & Unread Indicator */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                          <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{ticket.time}</span>
                          {ticket.unread && (
                            <span
                              style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                background: '#00236F',
                                display: 'inline-block',
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
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
                    <span>No {activeTab.toLowerCase()} tickets found.</span>
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
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                style={{ width: '20px', height: '20px', flexShrink: 0 }}
              >
                <path
                  d="M12 5V19M5 12H19"
                  stroke="#F5F6FA"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
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
                New ticket
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
                  Support
                </span>
                <span style={{ fontSize: '18px', fontWeight: 500, color: '#808080' }}>/</span>
                <span style={{ fontSize: '18px', fontWeight: 600, color: '#141414', marginLeft: '4px' }}>
                  New support ticket
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
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 5L5 15M5 5L15 15"
                    stroke="#464646"
                    strokeWidth="1.67"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Form Fields container */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                width: '100%',
              }}
            >
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
                <label
                  style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'var(--Foundation-neutral-neutral-950, #141414)',
                  }}
                >
                  Title<span style={{ color: '#00236F' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter support title..."
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
                <label
                  style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'var(--Foundation-neutral-neutral-950, #141414)',
                  }}
                >
                  Description<span style={{ color: '#00236F' }}>*</span>
                </label>
                <textarea
                  placeholder="Describe your issue in details..."
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
                disabled={!title.trim() || !description.trim()}
                style={{
                  borderRadius: '12px',
                  background:
                    title.trim() && description.trim()
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
                  cursor: title.trim() && description.trim() ? 'pointer' : 'not-allowed',
                  color: title.trim() && description.trim() ? '#FFF' : '#808080',
                  fontSize: '16px',
                  fontWeight: 500,
                  boxSizing: 'border-box',
                  transition: 'background 0.2s ease',
                }}
              >
                Send
              </button>
            </div>
          </form>
        )}

        {/* VIEW 3: TICKET DETAILS / CHAT VIEW */}
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
                marginBottom: '8px',
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
                  Support
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
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 5L5 15M5 5L15 15"
                    stroke="#464646"
                    strokeWidth="1.67"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Status Badge below Header (Aligned Right) */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                width: '100%',
                marginBottom: '16px',
              }}
            >
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 500,
                  borderRadius: '99px',
                  padding: '2px 8px',
                  background:
                    selectedTicket.status === 'Open'
                      ? 'rgba(254, 226, 226, 1)'
                      : 'rgba(209, 250, 229, 1)',
                  color:
                    selectedTicket.status === 'Open'
                      ? 'rgba(239, 68, 68, 1)'
                      : 'rgba(6, 95, 70, 1)',
                }}
              >
                {selectedTicket.status}
              </span>
            </div>

            {/* Chat Messages Log Area */}
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
              {selectedTicket.messages.map(message => {
                const isYou = message.sender === 'You';
                return (
                  <div
                    key={message.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isYou ? 'flex-start' : 'flex-end',
                      width: '100%',
                    }}
                  >
                    {/* Message Bubble */}
                    <div
                      className="support-drawer-message-bubble"
                      style={{
                        background: isYou ? '#FFF' : 'var(--Foundation-brand-brand-50, #E6E9F1)',
                        border: isYou
                          ? '1px solid var(--Foundation-neutral-neutral-100, #D4D5D8)'
                          : 'none',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        width: '390px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        boxSizing: 'border-box',
                      }}
                    >
                      {/* Date/Time Header inside Bubble (Centered) */}
                      <span
                        style={{
                          fontSize: '11px',
                          color: '#808080',
                          textAlign: 'center',
                          width: '100%',
                          display: 'block',
                        }}
                      >
                        {message.date}
                      </span>

                      {/* Body text inside bubble */}
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
                        {message.text}
                      </span>

                      {/* Author Label (bottom left) */}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          alignSelf: 'stretch',
                        }}
                      >
                        <span style={{ fontSize: '11px', color: '#808080', fontWeight: 500 }}>
                          {message.sender}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Reply block (only if ticket is open) */}
            {selectedTicket.status === 'Open' && (
              <form
                className="support-drawer-reply-form"
                onSubmit={handleReplySubmit}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  width: '100%',
                  marginTop: 'auto',
                }}
              >
                <textarea
                  placeholder="Reply to messages..."
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleReplySubmit(e);
                    }
                  }}
                  style={{
                    width: '100%',
                    height: '80px',
                    borderRadius: '8px',
                    border: '1px solid var(--Foundation-neutral-neutral-100, #D4D5D8)',
                    background: '#FFF',
                    padding: '12px',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'Inter, sans-serif',
                  }}
                />
              </form>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Report_Bug;
