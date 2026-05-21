import closeIcon from "../../assets/x-02.svg";
import plusIcon from "../../assets/plus-02.svg";
import "../../styles/leads-modal-mobile.css";

const Add_new_deal = ({ onClose }: { onClose?: () => void }) => {
  return (
    <div
      className="leads-modal-root"
      style={{
        width: 462,
        maxHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Inter, sans-serif",
        boxShadow: "0px 4px 6px -1px rgba(0, 0, 0, 0.1)", // Default shadow for modals
        position: "relative",
      }}
    >
      {/* ── First Part (Header) ── */}
      <div
        className="leads-modal-header"
        style={{
          background: "rgba(245, 246, 250, 1)",
          width: 462,
          height: 76,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          borderBottom: "1px solid rgba(212, 213, 216, 1)",
          padding: 20,
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img src={plusIcon} alt="add" width={20} height={20} />
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              fontSize: 19,
              color: "#141414",
              lineHeight: "100%",
            }}
          >
            Add New Deal
          </span>
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

      {/* ── Second Part (Body) ── */}
      <div
        className="leads-modal-body"
        style={{
          background: "rgba(245, 246, 250, 1)",
          width: 462,
          flex: 1,
          minHeight: 0,
          borderBottomRightRadius: 12,
          borderBottomLeftRadius: 12,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ── Form Container ── */}
        <div
          style={{
            width: "calc(100% - 40px)",
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            gap: 16,
            marginTop: 32,
            marginLeft: 20,
            marginRight: 20,
            boxSizing: "border-box",
            overflowY: "auto", // In case it overflows
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ fontSize: 14, fontWeight: 500, color: "#4B5563" }}>
              Customer name
              <span style={{ color: "rgba(0, 35, 111, 1)" }}>*</span>
            </label>
            <input
              type="text"
              style={{
                width: "100%",
                height: 44,
                borderRadius: 12,
                border: "1px solid rgba(212, 213, 216, 1)",
                padding: "0 16px",
                outline: "none",
                fontFamily: "Inter",
                fontSize: 14,
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ fontSize: 14, fontWeight: 500, color: "#4B5563" }}>
              Company name
              <span style={{ color: "rgba(0, 35, 111, 1)" }}>*</span>
            </label>
            <input
              type="text"
              style={{
                width: "100%",
                height: 44,
                borderRadius: 12,
                border: "1px solid rgba(212, 213, 216, 1)",
                padding: "0 16px",
                outline: "none",
                fontFamily: "Inter",
                fontSize: 14,
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ fontSize: 14, fontWeight: 500, color: "#4B5563" }}>
              Phone number
              <span style={{ color: "rgba(0, 35, 111, 1)" }}>*</span>
            </label>
            <input
              type="text"
              style={{
                width: "100%",
                height: 44,
                borderRadius: 12,
                border: "1px solid rgba(212, 213, 216, 1)",
                padding: "0 16px",
                outline: "none",
                fontFamily: "Inter",
                fontSize: 14,
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ fontSize: 14, fontWeight: 500, color: "#4B5563" }}>
              City<span style={{ color: "rgba(0, 35, 111, 1)" }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <select
                style={{
                  width: "100%",
                  height: 44,
                  borderRadius: 12,
                  border: "1px solid rgba(212, 213, 216, 1)",
                  padding: "0 16px",
                  outline: "none",
                  fontFamily: "Inter",
                  fontSize: 14,
                  boxSizing: "border-box",
                  appearance: "none",
                  color: "#6B7280",
                }}
              >
                <option value="" disabled selected>
                  Choose a lead source
                </option>
                <option value="Cairo">Cairo</option>
                <option value="Alexandria">Alexandria</option>
              </select>
              {/* Custom dropdown arrow if needed, native works for now */}
              <div
                style={{
                  position: "absolute",
                  right: 16,
                  top: 18,
                  pointerEvents: "none",
                }}
              >
                <svg
                  width="12"
                  height="8"
                  viewBox="0 0 12 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 1.5L6 6.5L11 1.5"
                    stroke="#141414"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ fontSize: 14, fontWeight: 500, color: "#4B5563" }}>
              Value<span style={{ color: "rgba(0, 35, 111, 1)" }}>*</span>
            </label>
            <input
              type="number"
              style={{
                width: "100%",
                height: 44,
                borderRadius: 12,
                border: "1px solid rgba(212, 213, 216, 1)",
                padding: "0 16px",
                outline: "none",
                fontFamily: "Inter",
                fontSize: 14,
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ fontSize: 14, fontWeight: 500, color: "#4B5563" }}>
              Service Details
              <span style={{ color: "rgba(0, 35, 111, 1)" }}>*</span>
            </label>
            <textarea
              style={{
                width: "100%",
                height: 96,
                borderRadius: 12,
                border: "1px solid rgba(212, 213, 216, 1)",
                padding: "12px 16px",
                outline: "none",
                fontFamily: "Inter",
                fontSize: 14,
                boxSizing: "border-box",
                resize: "none",
              }}
            />
          </div>
        </div>

        {/* ── Submit Button Container ── */}
        <div
          style={{
            marginTop: 48,
            marginLeft: 20,
            marginRight: 20,
            width: "calc(100% - 40px)",
            paddingBottom: 32,
            flexShrink: 0,
          }}
        >
          <button
            style={{
              background: "rgba(0, 35, 111, 1)",
              width: "100%",
              height: 48,
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              cursor: "pointer",
              color: "#fff",
              fontFamily: "Inter, sans-serif",
              fontSize: 16,
              fontWeight: 500,
              boxSizing: "border-box",
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Add_new_deal;
