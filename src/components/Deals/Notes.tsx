import React, { useState } from 'react';
import closeIcon from '../../assets/x-02.svg';
import "../../styles/leads-modal-mobile.css";
import { toast } from 'sonner';
import {
  useGetNotesForLeadQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} from '../../app/service/crudnote';

interface NotesProps {
  leadId?: string;
  onClose?: () => void;
}

const Notes: React.FC<NotesProps> = ({ leadId, onClose }) => {
  const [noteText, setNoteText] = useState("");
  const [editingNoteId, setEditingNoteId] = useState("");
  const [editingContent, setEditingContent] = useState("");
  const [activeTab, setActiveTab] = useState<'PUBLIC' | 'PRIVATE'>('PRIVATE');

  // RTK Query API
  const { data: notesResponse, isLoading, error } = useGetNotesForLeadQuery(leadId || "", { skip: !leadId });
  const [createNote] = useCreateNoteMutation();
  const [updateNote] = useUpdateNoteMutation();
  const [deleteNote] = useDeleteNoteMutation();

  const isLeadNotFoundError = 
    !!error && 
    typeof error === 'object' && 
    'status' in error && 
    error.status === 404;

  // Mock state fallback if leadId is not provided (e.g. from Deals page)
  const [mockNotes, setMockNotes] = useState<any[]>([
    {
      id: 'mock-1',
      created_at: new Date('2026-03-25T07:22:00.000Z').toISOString(),
      content: 'Lorem ipsum dolor sit amet consectetur. Nec enim morbi tristique amet urna. Commodo venenatis libero in id aliquet morbi purus. Interdum commodo at amet eget. Tempor morbi tristique dapibus a dolor blandit.',
      pinned: false,
      note_type: 'PRIVATE'
    }
  ]);

  const notesList = leadId ? (notesResponse?.data || []) : mockNotes;
  const filteredNotes = notesList.filter(
    (note: any) => (note.note_type || 'PUBLIC') === activeTab
  );

  const handleCreate = async () => {
    if (!noteText.trim()) return;
    if (leadId) {
      try {
        await createNote({
          lead_id: leadId,
          content: noteText.trim(),
          note_type: activeTab,
        }).unwrap();
        setNoteText("");
      } catch (err: any) {
        console.error("Failed to create note:", err);
        const errMsg = err?.data?.message || err?.message || "Failed to create note";
        toast.error(Array.isArray(errMsg) ? errMsg.join(", ") : errMsg);
      }
    } else {
      const newNote = {
        id: `mock-${Date.now()}`,
        created_at: new Date().toISOString(),
        content: noteText.trim(),
        pinned: false,
        note_type: activeTab,
      };
      setMockNotes((prev) => [newNote, ...prev]);
      setNoteText("");
    }
  };

  const handleTogglePin = async (note: any) => {
    if (leadId) {
      try {
        await updateNote({
          id: note.id,
          body: { pinned: !note.pinned }
        }).unwrap();
      } catch (err: any) {
        console.error("Failed to update note pin:", err);
        const errMsg = err?.data?.message || err?.message || "Failed to update note pin";
        toast.error(Array.isArray(errMsg) ? errMsg.join(", ") : errMsg);
      }
    } else {
      setMockNotes((prev) =>
        prev.map((n) => (n.id === note.id ? { ...n, pinned: !n.pinned } : n))
      );
    }
  };

  const handleSaveEdit = async (noteId: string) => {
    if (!editingContent.trim()) return;
    if (leadId) {
      try {
        await updateNote({
          id: noteId,
          body: { content: editingContent.trim() }
        }).unwrap();
        setEditingNoteId("");
        setEditingContent("");
      } catch (err: any) {
        console.error("Failed to edit note:", err);
        const errMsg = err?.data?.message || err?.message || "Failed to edit note";
        toast.error(Array.isArray(errMsg) ? errMsg.join(", ") : errMsg);
      }
    } else {
      setMockNotes((prev) =>
        prev.map((n) => (n.id === noteId ? { ...n, content: editingContent.trim() } : n))
      );
      setEditingNoteId("");
      setEditingContent("");
    }
  };

  const handleDelete = async (noteId: string) => {
    if (leadId) {
      try {
        await deleteNote(noteId).unwrap();
      } catch (err: any) {
        console.error("Failed to delete note:", err);
        const errMsg = err?.data?.message || err?.message || "Failed to delete note";
        toast.error(Array.isArray(errMsg) ? errMsg.join(", ") : errMsg);
      }
    } else {
      setMockNotes((prev) => prev.filter((n) => n.id !== noteId));
    }
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
      }}
    >
      {/* ── Header ── */}
      <div
        className="leads-modal-header"
        style={{
          background: "rgba(245, 246, 250, 1)",
          width: 462,
          height: 91,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          borderBottom: "none",
          padding: 20,
          boxSizing: "border-box",
        }}
      >
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

      {/* ── Tabs ── */}
      <div
        style={{
          borderBottom: "1px solid var(--Foundation-neutral-neutral-100, #D4D5D8)",
          display: "flex",
          width: 462,
          justifyContent: "center",
          alignItems: "center",
          background: "rgba(245, 246, 250, 1)",
          boxSizing: "border-box",
        }}
      >
        {/* Private Tab */}
        <div
          onClick={() => setActiveTab('PRIVATE')}
          style={{
            borderBottom: activeTab === 'PRIVATE'
              ? "1px solid var(--Foundation-brand-brand-500, #00236F)"
              : "1px solid transparent",
            display: "flex",
            padding: "8px",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            flex: "1 0 0",
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            fontWeight: activeTab === 'PRIVATE' ? 600 : 500,
            fontSize: 14,
            color: activeTab === 'PRIVATE' ? "var(--Foundation-brand-brand-500, #00236F)" : "#747474",
            textAlign: "center",
          }}
        >
          Private
        </div>
        {/* Public Tab */}
        <div
          onClick={() => setActiveTab('PUBLIC')}
          style={{
            borderBottom: activeTab === 'PUBLIC'
              ? "1px solid var(--Foundation-brand-brand-500, #00236F)"
              : "1px solid transparent",
            display: "flex",
            padding: "8px",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            flex: "1 0 0",
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            fontWeight: activeTab === 'PUBLIC' ? 600 : 500,
            fontSize: 14,
            color: activeTab === 'PUBLIC' ? "var(--Foundation-brand-brand-500, #00236F)" : "#747474",
            textAlign: "center",
          }}
        >
          Public
        </div>
      </div>

      {/* ── Body ── */}
      <div
        className="leads-modal-body"
        style={{
          background: "rgba(245, 246, 250, 1)",
          width: 462,
          flex: 1,
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
          boxSizing: "border-box",
          padding: "24px 20px",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Scrollable Notes List */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            flex: 1,
            overflowY: "auto",
            marginBottom: 16,
            paddingRight: 4,
          }}
        >
          {isLoading ? (
            <div style={{ textAlign: "center", color: "#6B7280", fontFamily: "Inter, sans-serif", fontSize: 14, padding: 12 }}>
              Loading notes...
            </div>
          ) : isLeadNotFoundError ? (
            <div style={{ textAlign: "center", color: "#A80D0B", fontFamily: "Inter, sans-serif", fontSize: 14, padding: 16, fontWeight: 500, background: "rgba(168, 13, 11, 0.05)", borderRadius: 8, border: "1px dashed rgba(168, 13, 11, 0.2)" }}>
              The lead associated with this deal was not found (it may have been deleted). You cannot add notes.
            </div>
          ) : filteredNotes.length === 0 ? (
            <div style={{ textAlign: "center", color: "#6B7280", fontFamily: "Inter, sans-serif", fontSize: 14, padding: 12 }}>
              No notes found.
            </div>
          ) : (
            [...filteredNotes]
              .sort((a, b) => {
                // Sort pinned first, then by date descending
                if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
              })
              .map((note) => {
                const formattedDate = new Date(note.created_at).toLocaleString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                }).replace(',', ' ,');
                
                const isPinned = note.pinned;
                const isEditing = editingNoteId === note.id;

                return (
                  <div
                    key={note.id}
                    style={{
                      boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.06)",
                      background: "#FFFFFF",
                      width: "100%",
                      borderRadius: 12,
                      padding: 12,
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                      boxSizing: "border-box",
                      border: isPinned ? "1px solid rgba(0, 35, 111, 1)" : "none",
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
                        }}
                      >
                        {formattedDate}
                      </div>

                      {/* Action Icons Group */}
                      <div style={{ display: "flex", gap: 12, height: 24, alignItems: "center" }}>
                        {/* Pin/Flag Icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill={isPinned ? "rgba(0, 35, 111, 1)" : "none"}
                          onClick={() => handleTogglePin(note)}
                          style={{ cursor: "pointer" }}
                        >
                          <path d="M3 21H7.90909M5.45455 12.3913V3H21L18.5455 7.69565L21 12.3913H5.45455ZM5.45455 12.3913V20.2174" stroke={isPinned ? "rgba(0, 35, 111, 1)" : "#141414"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {/* Edit Icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          onClick={() => {
                            if (isEditing) {
                              setEditingNoteId("");
                              setEditingContent("");
                            } else {
                              setEditingNoteId(note.id);
                              setEditingContent(note.content);
                            }
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          <path d="M13.7992 19.5514H19.7992M4.19922 19.5514L8.5652 18.6717C8.79698 18.625 9.0098 18.5109 9.17694 18.3437L18.9506 8.56461C19.4192 8.09576 19.4189 7.33577 18.9499 6.86731L16.8795 4.79923C16.4107 4.33097 15.6511 4.33129 15.1827 4.79995L5.40798 14.58C5.24117 14.7469 5.12727 14.9593 5.08052 15.1906L4.19922 19.5514Z" stroke={isEditing ? "rgba(0, 35, 111, 1)" : "#141414"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {/* Trash Icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          onClick={() => handleDelete(note.id)}
                          style={{ cursor: "pointer" }}
                        >
                          <path d="M4 6.17647H20M10 16.7647V10.4118M14 16.7647V10.4118M16 21H8C6.89543 21 6 20.0519 6 18.8824V7.23529C6 6.65052 6.44772 6.17647 7 6.17647H17C17.5523 6.17647 18 6.65052 18 7.23529V18.8824C18 20.0519 17.1046 21 16 21ZM10 6.17647H14C14.5523 6.17647 15 5.70242 15 5.11765V4.05882C15 3.47405 14.5523 3 14 3H10C9.44772 3 9 3.47405 9 4.05882V5.11765C9 5.70242 9.44772 6.17647 10 6.17647Z" stroke="#A80D0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>

                    {/* Text Content */}
                    {isEditing ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <textarea
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          style={{
                            width: "100%",
                            height: 60,
                            borderRadius: 8,
                            border: "1px solid rgba(0, 35, 111, 1)",
                            padding: 8,
                            fontFamily: "Inter, sans-serif",
                            fontSize: 13,
                            outline: "none",
                            resize: "none",
                            boxSizing: "border-box",
                          }}
                        />
                        <button
                          onClick={() => handleSaveEdit(note.id)}
                          disabled={!editingContent.trim()}
                          style={{
                            alignSelf: "flex-end",
                            background: "rgba(0, 35, 111, 1)",
                            color: "#fff",
                            border: "none",
                            borderRadius: 6,
                            padding: "4px 12px",
                            fontFamily: "Inter, sans-serif",
                            fontSize: 12,
                            fontWeight: 500,
                            cursor: "pointer",
                          }}
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 400,
                          fontSize: 13,
                          lineHeight: "140%",
                          color: "rgba(70, 70, 70, 1)",
                          width: "100%",
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                        }}
                      >
                        {note.content}
                      </div>
                    )}
                  </div>
                );
              })
          )}
        </div>

        {/* ── Input Box ── */}
        <div
          style={{
            width: "100%",
            height: 85,
            boxSizing: "border-box",
            position: "relative",
          }}
        >
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder={isLeadNotFoundError ? "Cannot add note for non-existent lead" : "Add note..."}
            disabled={isLeadNotFoundError}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: noteText ? 8 : 12,
              border: noteText ? "1px solid rgba(0, 35, 111, 1)" : "1px solid rgba(212, 213, 216, 1)",
              padding: "12px 48px 12px 16px",
              outline: "none",
              fontFamily: "Inter, sans-serif",
              fontSize: 14,
              resize: "none",
              boxSizing: "border-box",
              background: isLeadNotFoundError ? "rgba(237, 239, 242, 1)" : "#fff",
              cursor: isLeadNotFoundError ? "not-allowed" : "text",
              transition: "border 0.2s, border-radius 0.2s",
            }}
          />
          {noteText.trim() && (
            <div
              onClick={handleCreate}
              style={{
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                right: 12,
                display: "flex",
                width: 36,
                height: 36,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 12,
                background: "rgba(0, 35, 111, 1)",
                boxShadow: "0px 1px 3px 0px rgba(0, 0, 0, 0.11)",
                cursor: "pointer",
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="7" height="12" viewBox="0 0 7 12" fill="none">
                <path d="M1 1L6 6L1 11" stroke="#F5F6FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes;
