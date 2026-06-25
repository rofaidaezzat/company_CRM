import React, { useState, useEffect } from 'react';
import closeIcon from '../../assets/x-02.svg';
import "../../styles/leads-modal-mobile.css";
import {
  useGetNotesForLeadQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
  Note
} from '../../app/service/crudnote';
import { validateNote } from '../../validation';
import { toast } from 'sonner';

interface NotesProps {
  onClose?: () => void;
  leadId?: string;
  leadName?: string;
}

const Notes = ({ onClose, leadId, leadName }: NotesProps) => {
  const [noteText, setNoteText] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<'PRIVATE' | 'PUBLIC'>('PRIVATE');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [contentError, setContentError] = useState<string>("");
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // RTK Query API Hooks (skipped if leadId is not provided)
  const { data: notesResponse, error: fetchError } = useGetNotesForLeadQuery(leadId || "", { skip: !leadId });
  const [createNote] = useCreateNoteMutation();
  const [updateNote] = useUpdateNoteMutation();
  const [deleteNote] = useDeleteNoteMutation();

  // If the query returns a 403 error, we set isUnauthorized to true
  useEffect(() => {
    if (fetchError && 'status' in fetchError && fetchError.status === 403) {
      setIsUnauthorized(true);
    }
  }, [fetchError]);

  // Derived notes list filtered by selected activeTab
  const activeNotes = (notesResponse?.data || []).filter(note => note.note_type === activeTab);

  // Handle Note Submission (Create or Edit)
  const handleSubmitNote = async () => {
    if (isUnauthorized) return;

    // Validate content before submitting
    const validation = validateNote({ content: noteText });
    if (!validation.isValid) {
      setContentError(validation.errors.content || 'Invalid note content');
      return;
    }
    setContentError("");

    if (editingNoteId) {
      if (leadId) {
        try {
          await updateNote({
            id: editingNoteId,
            body: { content: noteText }
          }).unwrap();
          setNoteText("");
          setEditingNoteId(null);
          setIsAdding(false);
          setIsSubmitted(true);
          setTimeout(() => setIsSubmitted(false), 2000);
        } catch (err: any) {
          console.error("Failed to edit note:", err);
          if (err?.status === 403) {
            setIsUnauthorized(true);
          } else if (err?.status === 404 || err?.data?.code === 404 || err?.data?.message === "Note not found") {
            toast.error(err?.data?.message || "Note not found");
            setNoteText("");
            setEditingNoteId(null);
            setIsAdding(false);
          }
        }
      }
    } else {
      if (leadId) {
        try {
          await createNote({
            lead_id: leadId,
            content: noteText,
            note_type: activeTab,
          }).unwrap();
          setNoteText("");
          setIsAdding(false);
          setIsSubmitted(true);
          setTimeout(() => setIsSubmitted(false), 2000);
        } catch (err: any) {
          console.error("Failed to create note:", err);
          if (err?.status === 403) {
            setIsUnauthorized(true);
          }
        }
      }
    }
  };

  // Handle Note Deletion
  const handleDeleteNote = async (id: string) => {
    if (isUnauthorized) return;
    if (leadId) {
      try {
        await deleteNote(id).unwrap();
        if (editingNoteId === id) {
          setNoteText("");
          setEditingNoteId(null);
          setIsAdding(false);
        }
      } catch (err: any) {
        console.error("Failed to delete note:", err);
        if (err?.status === 403) {
          setIsUnauthorized(true);
        } else if (err?.status === 404 || err?.data?.code === 404 || err?.data?.message === "Note not found") {
          toast.error(err?.data?.message || "Note not found");
          if (editingNoteId === id) {
            setNoteText("");
            setEditingNoteId(null);
            setIsAdding(false);
          }
        }
      }
    }
  };

  // Handle Pin/Unpin Note Toggle
  const handleTogglePin = async (note: Note) => {
    if (isUnauthorized) return;
    if (leadId) {
      try {
        await updateNote({
          id: note.id,
          body: { pinned: !note.pinned }
        }).unwrap();
      } catch (err: any) {
        console.error("Failed to pin note:", err);
        if (err?.status === 403) {
          setIsUnauthorized(true);
        } else if (err?.status === 404 || err?.data?.code === 404 || err?.data?.message === "Note not found") {
          toast.error(err?.data?.message || "Note not found");
        }
      }
    }
  };

  // Handle Edit Action Click
  const handleEditClick = (note: Note) => {
    if (isUnauthorized) return;
    setEditingNoteId(note.id);
    setNoteText(note.content);
    setIsAdding(true);
  };

  return (
    <div
      className="leads-modal-root"
      style={{
        width: 462,
        height: 528,
        display: "flex",
        flexDirection: "column",
        fontFamily: "Inter, sans-serif",
        boxShadow: "0px 4px 6px -1px rgba(0, 0, 0, 0.1)",
        borderRadius: 12,
        background: "rgba(245, 246, 250, 1)",
        overflow: "hidden",
      }}
    >
      {/* ── First Part (Header) ── */}
      <div
        className="leads-modal-header"
        style={{
          background: "rgba(245, 246, 250, 1)",
          width: "100%",
          height: 91,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          borderBottom: "1px solid rgba(212, 213, 216, 1)",
          padding: "20px 24px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Chat bubble icon */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M8 10H16M8 14H13M21 12C21 16.9706 16.9706 21 12 21C10.1554 21 8.44857 20.4433 7.03159 19.4891L3 21L4.51094 16.9684C3.55668 15.5514 3 13.8446 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#141414" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                fontSize: 19,
                color: "#141414",
                lineHeight: "100%",
              }}
            >
              Notes
            </span>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                fontSize: 13,
                color: "rgba(116, 116, 116, 1)",
                lineHeight: "100%",
              }}
            >
              for "{leadName || "leads name"}"
            </span>
          </div>
        </div>
        {/* Close Button */}
        <div
          onClick={onClose}
          style={{
            boxShadow: "0px 1px 3px 0px rgba(0, 0, 0, 0.11)",
            background: "rgba(255, 255, 255, 1)",
            width: 36,
            height: 36,
            borderRadius: 99,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <img src={closeIcon} alt="close" width={20} height={20} />
        </div>
      </div>
      {/* ── Tab Bar ── */}
      <div
        style={{
          width: "100%",
          height: 48,
          background: "rgba(245, 246, 250, 1)",
          display: "flex",
          borderBottom: "1px solid rgba(212, 213, 216, 1)",
          boxSizing: "border-box",
        }}
      >
        <div
          onClick={() => { setActiveTab('PRIVATE'); setEditingNoteId(null); setNoteText(""); }}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            fontSize: 14,
            fontWeight: activeTab === 'PRIVATE' ? 600 : 400,
            color: activeTab === 'PRIVATE' ? "#00236F" : "rgba(116, 116, 116, 1)",
            borderBottom: activeTab === 'PRIVATE' ? "2px solid #00236F" : "none",
            height: "100%",
            boxSizing: "border-box",
            transition: "color 0.2s, border-bottom 0.2s",
          }}
        >
          Private
        </div>
        <div
          onClick={() => { setActiveTab('PUBLIC'); setEditingNoteId(null); setNoteText(""); }}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            fontSize: 14,
            fontWeight: activeTab === 'PUBLIC' ? 600 : 400,
            color: activeTab === 'PUBLIC' ? "#00236F" : "rgba(116, 116, 116, 1)",
            borderBottom: activeTab === 'PUBLIC' ? "2px solid #00236F" : "none",
            height: "100%",
            boxSizing: "border-box",
            transition: "color 0.2s, border-bottom 0.2s",
          }}
        >
          Public
        </div>
      </div>

      {/* ── Second Section (Body) ── */}
      <div
        className="leads-modal-body"
        style={{
          background: "rgba(245, 246, 250, 1)",
          width: "100%",
          height: 389,
          minHeight: 389,
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
          flexDirection: "column",
          boxSizing: "border-box",
          padding: "24px 20px 24px 20px",
          position: "relative",
          display: "flex",
          flex: 1,
        }}
      >
        {/* Scrollable list of Note Cards */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            overflowY: "auto",
            paddingRight: 4,
            height: "260px",
            maxHeight: "260px",
            paddingBottom: 8,
          }}
        >
          {activeNotes.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                color: "#9CA3AF",
                fontSize: 14,
                marginTop: 40,
                fontFamily: "Inter, sans-serif"
              }}
            >
              No {activeTab.toLowerCase()} notes yet.
            </div>
          ) : (
            activeNotes.map((note) => (
              <div
                key={note.id}
                style={{
                  boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.059)",
                  background: "#FFFFFF",
                  width: "100%",
                  borderRadius: 12,
                  padding: 12,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  boxSizing: "border-box",
                  opacity: 1,
                  position: "relative",
                }}
              >
                {/* Header of card */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {/* Timestamp */}
                  <div
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 400,
                      fontSize: 13,
                      lineHeight: "140%",
                      color: "rgba(116, 116, 116, 1)",
                      height: 18,
                    }}
                  >
                    {new Date(note.created_at).toLocaleDateString('en-GB')} , {new Date(note.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                  </div>

                  {/* Action Icons Group */}
                  <div style={{ display: "flex", gap: 8, width: 88, height: 24, justifyContent: "flex-end" }}>
                    {/* Flag/Pin Icon */}
                    <svg
                      onClick={isUnauthorized ? undefined : () => handleTogglePin(note)}
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill={note.pinned ? "#00236F" : "none"}
                      style={{
                        cursor: isUnauthorized ? "not-allowed" : "pointer",
                        opacity: isUnauthorized ? 0.5 : 1
                      }}
                    >
                      <path d="M3 21H7.90909M5.45455 12.3913V3H21L18.5455 7.69565L21 12.3913H5.45455ZM5.45455 12.3913V20.2174" stroke={note.pinned ? "#00236F" : "#141414"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {/* Edit Icon */}
                    <svg
                      onClick={isUnauthorized ? undefined : () => handleEditClick(note)}
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      style={{
                        cursor: isUnauthorized ? "not-allowed" : "pointer",
                        opacity: isUnauthorized ? 0.5 : 1
                      }}
                    >
                      <path d="M13.7992 19.5514H19.7992M4.19922 19.5514L8.5652 18.6717C8.79698 18.625 9.0098 18.5109 9.17694 18.3437L18.9506 8.56461C19.4192 8.09576 19.4189 7.33577 18.9499 6.86731L16.8795 4.79923C16.4107 4.33097 15.6511 4.33129 15.1827 4.79995L5.40798 14.58C5.24117 14.7469 5.12727 14.9593 5.08052 15.1906L4.19922 19.5514Z" stroke="#141414" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {/* Trash/Delete Icon */}
                    <svg
                      onClick={isUnauthorized ? undefined : () => handleDeleteNote(note.id)}
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      style={{
                        cursor: isUnauthorized ? "not-allowed" : "pointer",
                        opacity: isUnauthorized ? 0.5 : 1
                      }}
                    >
                      <path d="M4 6.17647H20M10 16.7647V10.4118M14 16.7647V10.4118M16 21H8C6.89543 21 6 20.0519 6 18.8824V7.23529C6 6.65052 6.44772 6.17647 7 6.17647H17C17.5523 6.17647 18 6.65052 18 7.23529V18.8824C18 20.0519 17.1046 21 16 21ZM10 6.17647H14C14.5523 6.17647 15 5.70242 15 5.11765V4.05882C15 3.47405 14.5523 3 14 3H10C9.44772 3 9 3.47405 9 4.05882V5.11765C9 5.70242 9.44772 6.17647 10 6.17647Z" stroke="#A80D0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>

                {/* Text Content */}
                <div
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 400,
                    fontSize: 13,
                    lineHeight: "140%",
                    color: "rgba(70, 70, 70, 1)",
                    width: "100%",
                  }}
                >
                  {note.content}
                </div>

                {/* Author Info */}
                <div
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 400,
                    fontSize: 12,
                    color: "rgba(116, 116, 116, 1)",
                    marginTop: -4,
                  }}
                >
                  By {note.author ? `${note.author.first_name} ${note.author.last_name}` : "Unknown"}
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Input Box / Success Bar or Floating Add Note Button ── */}
        {!isAdding && !isSubmitted ? (
          <button
            onClick={() => {
              if (!isUnauthorized) {
                setIsAdding(true);
              }
            }}
            disabled={isUnauthorized}
            style={{
              position: "absolute",
              bottom: "24px",
              right: "20px",
              zIndex: 10,
              borderRadius: "12px",
              background: "var(--Foundation-brand-brand-500, #00236F)",
              boxShadow: "0 0 3px 3px rgba(0, 0, 0, 0.13)",
              display: "inline-flex",
              height: "48px",
              padding: "8px 24px",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              border: "none",
              cursor: isUnauthorized ? "not-allowed" : "pointer",
              opacity: isUnauthorized ? 0.6 : 1,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 5V19M5 12H19"
                stroke="var(--Foundation-neutral-neutral-25, #F5F6FA)"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              style={{
                color: "var(--Foundation-neutral-neutral-25, #F5F6FA)",
                textAlign: "center",
                fontFamily: "Inter, sans-serif",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "normal",
              }}
            >
              Add Note
            </span>
          </button>
        ) : (
          <div
            style={{
              position: "absolute",
              bottom: 24,
              left: 20,
              right: 20,
              height: isSubmitted ? 48 : 85,
              boxSizing: "border-box",
              transition: "height 0.2s",
            }}
          >
            {isSubmitted ? (
              <div
                style={{
                  borderRadius: 12,
                  background: "#00236F",
                  display: "flex",
                  width: "100%",
                  height: 48,
                  padding: "8px 24px",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 8,
                  boxSizing: "border-box",
                }}
              >
                <span style={{ color: "#fff", fontFamily: "Inter, sans-serif", fontSize: 14 }}>
                  {editingNoteId ? "Changes Saved" : "Save"}
                </span>
              </div>
            ) : (
              <>
                <textarea
                  autoFocus
                  disabled={isUnauthorized}
                  value={noteText}
                  onChange={(e) => { setNoteText(e.target.value); if (contentError) setContentError(""); }}
                  placeholder={isUnauthorized ? "You do not have permission to add or edit notes" : (editingNoteId ? "Edit note..." : `Add ${activeTab.toLowerCase()} note...`)}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: noteText ? 8 : 12,
                    border: contentError
                      ? "1px solid #E03131"
                      : noteText
                        ? "1px solid #00236F"
                        : "1px solid rgba(212, 213, 216, 1)",
                    padding: "12px 56px 12px 16px",
                    outline: "none",
                    fontFamily: "Inter, sans-serif",
                    fontSize: 14,
                    resize: "none",
                    boxSizing: "border-box",
                    background: isUnauthorized ? "#E9ECEF" : "#fff",
                    cursor: isUnauthorized ? "not-allowed" : "text",
                    transition: "border 0.2s, border-radius 0.2s",
                  }}
                  onBlur={() => {
                    if (!noteText.trim()) {
                      setIsAdding(false);
                      setEditingNoteId(null);
                    }
                  }}
                />
                {contentError && (
                  <span
                    style={{
                      position: "absolute",
                      bottom: -20,
                      left: 0,
                      fontFamily: "Inter, sans-serif",
                      fontSize: 12,
                      color: "#E03131",
                    }}
                  >
                    {contentError}
                  </span>
                )}
                {noteText && !isUnauthorized && (
                  <div
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={handleSubmitNote}
                    style={{
                      position: "absolute",
                      top: "50%",
                      transform: "translateY(-50%)",
                      right: 12,
                      display: "flex",
                      width: 36,
                      height: 36,
                      padding: 6,
                      justifyContent: "center",
                      alignItems: "center",
                      flexShrink: 0,
                      borderRadius: 12,
                      background: "#00236F",
                      boxShadow: "0px 1px 3px 0px rgba(0, 0, 0, 0.11)",
                      cursor: "pointer",
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="7" height="12" viewBox="0 0 7 12" fill="none">
                      <path d="M1 1L6 6L1 11" stroke="#F5F6FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
