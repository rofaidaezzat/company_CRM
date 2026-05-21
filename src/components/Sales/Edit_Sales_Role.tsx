import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';

interface EditSalesRoleProps {
  salesName: string;
  currentRole: string;
  currentTargetAdjustment: string;
  onClose: () => void;
  onSave: (newRole: string, newTargetAdj: string) => void;
}

export const Edit_Sales_Role: React.FC<EditSalesRoleProps> = ({
  salesName,
  currentRole,
  currentTargetAdjustment,
  onClose,
  onSave,
}) => {
  const [role, setRole] = useState(currentRole);
  const [targetAdj, setTargetAdj] = useState(currentTargetAdjustment);

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isTargetDropdownOpen, setIsTargetDropdownOpen] = useState(false);

  const roles = ['Sales member', 'Sales manager'];
  const targetOptions = ['Allow', "Don't allow"];

  const handleSave = () => {
    onSave(role, targetAdj);
    onClose();
  };

  return (
    <div
      style={{
        display: "flex",
        width: 462,
        flexDirection: "column",
        alignItems: "flex-start",
        background: "#FFF",
        borderRadius: 12,
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        overflow: "visible",
        position: "relative",
      }}
    >
      {/* ── First Part (Header) ── */}
      <div
        style={{
          borderRadius: "12px 12px 0 0",
          borderBottom: "1px solid var(--Foundation-neutral-neutral-100, #D4D5D8)",
          background: "var(--Foundation-neutral-neutral-25, #F5F6FA)",
          display: "flex",
          padding: "20px",
          justifyContent: "space-between",
          alignItems: "center",
          alignSelf: "stretch",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M12.6529 4.20709C13.0432 3.81654 13.6762 3.81628 14.0669 4.2065L15.7922 5.9299C16.1831 6.32028 16.1833 6.95361 15.7928 7.34432L7.6481 15.4935C7.50881 15.6329 7.33147 15.728 7.13832 15.7669L3.5 16.5L4.23442 12.866C4.27337 12.6732 4.36829 12.4962 4.5073 12.3571L12.6529 4.20709Z" stroke="#00236F" strokeWidth={2} strokeLinejoin="round"/>
            </svg>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 20,
                fontWeight: 700,
                color: "#00236F",
              }}
            >
              Edit Sales Role
            </span>
          </div>
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 14,
              color: "#747474",
            }}
          >
            for "{salesName}"
          </span>
        </div>

        <button
          onClick={onClose}
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "#FFF",
            border: "1px solid #D4D5D8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0px 1px 2px rgba(0,0,0,0.05)",
          }}
        >
          <X size={18} color="#464646" />
        </button>
      </div>

      {/* ── Second Part (Body) ── */}
      <div
        style={{
          borderRadius: "0 0 12px 12px",
          background: "var(--Foundation-neutral-neutral-25, #F5F6FA)",
          display: "flex",
          padding: "24px 0",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 32,
          alignSelf: "stretch",
          boxSizing: "border-box",
        }}
      >
        {/* Sales Role Dropdown Input */}
        <div
          style={{
            display: "flex",
            height: 75,
            padding: "0 20px",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 8,
            alignSelf: "stretch",
            position: "relative",
            boxSizing: "border-box",
          }}
        >
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 500, color: "#464646" }}>
            Sales Role<span style={{ color: "#00236F" }}>*</span>
          </span>
          <div
            onClick={() => {
              setIsRoleDropdownOpen(!isRoleDropdownOpen);
              setIsTargetDropdownOpen(false);
            }}
            style={{
              display: "flex",
              width: 422,
              height: 48,
              padding: "0 16px",
              justifyContent: "space-between",
              alignItems: "center",
              borderRadius: 12,
              border: "1px solid var(--Foundation-neutral-neutral-100, #D4D5D8)",
              background: "transparent",
              cursor: "pointer",
              boxSizing: "border-box",
            }}
          >
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 15, color: "#141414" }}>
              {role || 'Select Sales Role'}
            </span>
            <ChevronDown size={20} color="#747474" />
          </div>

          {/* Custom Options Menu */}
          {isRoleDropdownOpen && (
            <div
              style={{
                position: "absolute",
                top: 80,
                left: 20,
                zIndex: 999,
                display: "flex",
                width: 422,
                padding: "8px",
                flexDirection: "column",
                gap: 4,
                borderRadius: 12,
                background: "var(--Foundation-neutral-white, #FFF)",
                boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.17)",
                boxSizing: "border-box",
              }}
            >
              {roles.map((r) => {
                const isSelected = role === r;
                return (
                  <div
                    key={r}
                    onClick={() => {
                      setRole(r);
                      setIsRoleDropdownOpen(false);
                    }}
                    style={{
                      display: "flex",
                      width: "100%",
                      padding: 12,
                      alignItems: "center",
                      gap: 8,
                      borderRadius: 8,
                      background: isSelected ? "#F0F4FF" : "transparent",
                      cursor: "pointer",
                      boxSizing: "border-box",
                    }}
                  >
                    {isSelected ? (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="10" cy="10" r="9" stroke="#00236F" strokeWidth="2"/>
                        <circle cx="10" cy="10" r="5" fill="#00236F"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="10" cy="10" r="9" stroke="#9CA3AF" strokeWidth="2"/>
                      </svg>
                    )}
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#141414" }}>
                      {r}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {role.toLowerCase() === 'sales manager' && (
          /* Target Adjustment Dropdown Input */
          <div
            style={{
              display: "flex",
              height: 75,
              padding: "0 20px",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 8,
              alignSelf: "stretch",
              position: "relative",
              boxSizing: "border-box",
            }}
          >
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 500, color: "#464646" }}>
              Target Adjustment<span style={{ color: "#00236F" }}>*</span>
            </span>
            <div
              onClick={() => {
                setIsTargetDropdownOpen(!isTargetDropdownOpen);
                setIsRoleDropdownOpen(false);
              }}
              style={{
                display: "flex",
                width: 422,
                height: 48,
                padding: "0 16px",
                justifyContent: "space-between",
                alignItems: "center",
                borderRadius: 12,
                border: "1px solid var(--Foundation-neutral-neutral-100, #D4D5D8)",
                background: "transparent",
                cursor: "pointer",
                boxSizing: "border-box",
              }}
            >
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 15, color: targetAdj ? "#141414" : "#9CA3AF" }}>
                {targetAdj || 'Choose to allow/disallow target adjustment permissions'}
              </span>
              <ChevronDown size={20} color="#747474" />
            </div>

            {/* Custom Options Menu */}
            {isTargetDropdownOpen && (
              <div
                style={{
                  position: "absolute",
                  top: 80,
                  left: 20,
                  zIndex: 999,
                  display: "flex",
                  width: 422,
                  padding: "8px",
                  flexDirection: "column",
                  gap: 4,
                  borderRadius: 12,
                  background: "var(--Foundation-neutral-white, #FFF)",
                  boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.17)",
                  boxSizing: "border-box",
                }}
              >
                {targetOptions.map((t) => {
                  const isSelected = targetAdj === t;
                  return (
                    <div
                      key={t}
                      onClick={() => {
                        setTargetAdj(t);
                        setIsTargetDropdownOpen(false);
                      }}
                      style={{
                        display: "flex",
                        width: "100%",
                        padding: 12,
                        alignItems: "center",
                        gap: 8,
                        borderRadius: 8,
                        background: isSelected ? "#F0F4FF" : "transparent",
                        cursor: "pointer",
                        boxSizing: "border-box",
                      }}
                    >
                      {isSelected ? (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="10" cy="10" r="9" stroke="#00236F" strokeWidth="2"/>
                          <circle cx="10" cy="10" r="5" fill="#00236F"/>
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="10" cy="10" r="9" stroke="#9CA3AF" strokeWidth="2"/>
                        </svg>
                      )}
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#141414" }}>
                        {t}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={handleSave}
          style={{
            borderRadius: 12,
            background: "var(--Foundation-brand-brand-500, #00236F)",
            display: "flex",
            width: 422,
            height: 48,
            padding: "8px 24px",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
            border: "none",
            cursor: "pointer",
            color: "#FFF",
            fontFamily: "Inter, sans-serif",
            fontSize: 16,
            fontWeight: 600,
            boxSizing: "border-box",
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
};
