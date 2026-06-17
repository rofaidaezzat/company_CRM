import React, { useEffect, useRef, useState } from "react";
import closeIcon from "../../assets/x-02.svg";
import cameraIcon from "../../assets/carbon_camera.svg";
import "../../styles/leads-modal-mobile.css";
import {
  useGetProfileDetailsQuery,
  useUpdateProfileInfoMutation,
  useUploadProfilePictureMutation,
} from "../../app/service/crudsetting";
import { toast } from "sonner";

interface EditProfileProps {
  onClose?: () => void;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 48,
  border: "1px solid rgba(212, 213, 216, 1)",
  borderRadius: 8,
  padding: "0 14px",
  fontFamily: "Inter, sans-serif",
  fontSize: 14,
  color: "#141414",
  background: "#fff",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "Inter, sans-serif",
  fontWeight: 500,
  fontSize: 13,
  color: "#4B5563",
  marginBottom: 6,
  display: "block",
};

const Edit_Profile: React.FC<EditProfileProps> = ({ onClose }) => {
  const { data: profileData, isLoading: isProfileLoading } = useGetProfileDetailsQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileInfoMutation();
  const [uploadPhoto, { isLoading: isUploading }] = useUploadProfilePictureMutation();

  const profile = profileData?.data?.profile;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Populate fields once profile loads
  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
      setPhone(profile.phone || "");
      setAvatarPreview(profile.avatar || null);
    }
  }, [profile]);

  const handlePhotoClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      toast.error("First name and last name are required.");
      return;
    }
    try {
      // Upload photo first if changed
      if (pendingFile) {
        const formData = new FormData();
        formData.append("photo", pendingFile);
        await uploadPhoto(formData).unwrap();
      }
      // Update profile info
      await updateProfile({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      }).unwrap();
      toast.success("Profile updated successfully.");
      onClose?.();
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        (Array.isArray(err?.data?.message) ? err.data.message.join(", ") : null) ||
        "Failed to update profile.";
      toast.error(msg);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "#3B5BDB";
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "rgba(212, 213, 216, 1)";
  };

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "?";
  const isBusy = isUpdating || isUploading;

  return (
    <div
      className="leads-modal-root"
      style={{
        width: 462,
        height: 540,
        opacity: 1,
        display: "flex",
        flexDirection: "column",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.12)",
        background: "rgba(245, 246, 250, 1)",
      }}
    >
      {/* ── Header ── */}
      <div
        className="leads-modal-header"
        style={{
          width: 462,
          height: 76,
          background: "rgba(245, 246, 250, 1)",
          borderBottom: "1px solid rgba(212, 213, 216, 1)",
          padding: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxSizing: "border-box",
          flexShrink: 0,
        }}
      >
        <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 16, color: "#141414" }}>
          Edit Profile
        </span>
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            width: 32, height: 32, borderRadius: "50%",
            border: "1px solid rgba(212, 213, 216, 1)",
            background: "#fff", display: "flex", alignItems: "center",
            justifyContent: "center", cursor: "pointer", flexShrink: 0,
          }}
        >
          <img src={closeIcon} alt="Close" width={14} height={14} />
        </button>
      </div>

      {/* ── Body ── */}
      <div
        className="leads-modal-body"
        style={{
          width: 462, flex: 1,
          background: "rgba(245, 246, 250, 1)",
          padding: "24px 20px",
          boxSizing: "border-box",
          display: "flex", flexDirection: "column",
          gap: 20, overflowY: "auto",
        }}
      >
        {isProfileLoading ? (
          <div style={{ textAlign: "center", color: "#6B7280", fontFamily: "Inter, sans-serif", paddingTop: 40 }}>
            Loading profile...
          </div>
        ) : (
          <>
            {/* Avatar Section */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{ position: "relative" }}>
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    style={{ width: 80, height: 80, borderRadius: 16, objectFit: "cover" }}
                  />
                ) : (
                  <div
                    style={{
                      width: 80, height: 80, borderRadius: 16,
                      background: "#8FA0C0", display: "flex",
                      alignItems: "center", justifyContent: "center",
                      color: "#fff", fontFamily: "Inter, sans-serif",
                      fontWeight: 700, fontSize: 28,
                    }}
                  >
                    {initials}
                  </div>
                )}
                <div
                  onClick={handlePhotoClick}
                  style={{
                    position: "absolute", bottom: -4, right: -4,
                    width: 28, height: 28, borderRadius: "50%",
                    background: "rgba(0, 35, 111, 1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", border: "2px solid #fff",
                  }}
                >
                  <img src={cameraIcon} alt="Change Photo" width={16} height={16} />
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </div>
              <span
                onClick={handlePhotoClick}
                style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#6B7280", cursor: "pointer" }}
              >
                Tap to change photo
              </span>
            </div>

            {/* Form Fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 8 }}>
              <div>
                <label style={labelStyle}>First name<span style={{ color: "#00236F" }}>*</span></label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
              <div>
                <label style={labelStyle}>Last name<span style={{ color: "#00236F" }}>*</span></label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
              <div>
                <label style={labelStyle}>Phone number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ ...inputStyle, background: "rgba(212,213,216,0.3)", cursor: "default" }}
                  readOnly
                />
              </div>
            </div>

            {/* Actions */}
            <div style={{ marginTop: "auto", display: "flex", gap: 12 }}>
              <button
                onClick={onClose}
                style={{
                  flex: 1, height: 48, borderRadius: 12,
                  border: "1px solid rgba(212, 213, 216, 1)",
                  background: "transparent", color: "#141414",
                  fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 15,
                  cursor: "pointer", transition: "background 0.2s",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isBusy}
                style={{
                  flex: 1, height: 48, borderRadius: 12, border: "none",
                  background: isBusy ? "rgba(212,213,216,1)" : "rgba(0, 35, 111, 1)",
                  color: isBusy ? "#9CA3AF" : "#fff",
                  fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 15,
                  cursor: isBusy ? "not-allowed" : "pointer", transition: "background 0.2s",
                }}
              >
                {isBusy ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Edit_Profile;
