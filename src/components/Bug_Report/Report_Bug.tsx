import React, { useState, useRef } from 'react';

interface Report_BugProps {
  isOpen: boolean;
  onClose: () => void;
}

const Report_Bug: React.FC<Report_BugProps> = ({ isOpen, onClose }) => {
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering file selection window
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !file) return;

    // Add submit bug API logic here
    console.log("Submitting bug report:", { description, file });
    
    // Clear form and close modal
    setDescription('');
    setFile(null);
    setPreviewUrl(null);
    onClose();
  };

  const isFormComplete = description !== '' && file !== null;

  return (
    <div 
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(20, 20, 20, 0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2000,
        backdropFilter: "blur(4px)",
        boxSizing: "border-box"
      }}
    >
      {/* Modal Container */}
      <div 
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        style={{
          display: "flex",
          width: 462,
          height: 443,
          flexDirection: "column",
          alignItems: "flex-start",
          borderRadius: 12,
          boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.16)",
          background: "var(--Foundation-neutral-neutral-25, #F5F6FA)",
          overflow: "hidden",
          fontFamily: "Inter, sans-serif",
          boxSizing: "border-box"
        }}
      >
        {/* First Part (Header) */}
        <div style={{
          borderRadius: "12px 12px 0 0",
          borderBottom: "1px solid var(--Foundation-neutral-neutral-100, #D4D5D8)",
          background: "var(--Foundation-neutral-neutral-25, #F5F6FA)",
          display: "flex",
          padding: 20,
          justifyContent: "space-between",
          alignItems: "center",
          alignSelf: "stretch",
          boxSizing: "border-box"
        }}>
          {/* Header Title with SVG */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none"
              style={{ width: 24, height: 24, flexShrink: 0 }}
            >
              <path 
                d="M11.9991 15.375V12M11.9991 8.625V8.70959M20.9983 12C20.9983 13.2938 20.7253 14.5238 20.2338 15.6356L21 20.9991L16.4039 19.85C15.1019 20.5823 13.5993 21 11.9991 21C7.02906 21 3 16.9706 3 12C3 7.02944 7.02906 3 11.9991 3C16.9692 3 20.9983 7.02944 20.9983 12Z" 
                stroke="#141414" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            <span style={{
              color: "var(--Foundation-neutral-neutral-950, #141414)",
              fontSize: 16,
              fontWeight: 600,
              lineHeight: "normal"
            }}>Report a Bug</span>
          </div>

          {/* Close Button */}
          <button 
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "none",
              background: "#FFF",
              boxShadow: "0px 1px 3px rgba(0,0,0,0.1)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              transition: "background 0.2s ease"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#F3F4F6")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#FFF")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#464646" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Second Part (Form & Save Button) */}
        <form 
          onSubmit={handleSubmit}
          style={{
            borderRadius: "0 0 12px 12px",
            background: "var(--Foundation-neutral-neutral-25, #F5F6FA)",
            display: "flex",
            padding: "24px 20px 20px 20px",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            flex: "1 0 0",
            alignSelf: "stretch",
            boxSizing: "border-box",
            width: "100%"
          }}
        >
          {/* Inputs Section */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", alignItems: "center" }}>
            
            {/* Description */}
            <div style={{
              display: "flex",
              width: 422,
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 8,
              boxSizing: "border-box"
            }}>
              <label style={{
                fontSize: 14,
                fontWeight: 500,
                color: "var(--Foundation-neutral-neutral-950, #141414)"
              }}>
                Description<span style={{ color: "#00236F" }}>*</span>
              </label>
              
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the bug..."
                style={{
                  width: "100%",
                  height: 104,
                  borderRadius: 8,
                  border: description ? "1px solid var(--Foundation-neutral-neutral-500, #808080)" : "1px solid #D4D5D8",
                  background: "transparent",
                  padding: 12,
                  fontSize: 14,
                  outline: "none",
                  resize: "none",
                  boxSizing: "border-box",
                  transition: "border 0.2s ease"
                }}
              />
            </div>

            {/* Attachment */}
            <div style={{
              display: "flex",
              width: 422,
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 8,
              boxSizing: "border-box"
            }}>
              <label style={{
                fontSize: 14,
                fontWeight: 500,
                color: "var(--Foundation-neutral-neutral-950, #141414)"
              }}>
                Attachment<span style={{ color: "#00236F" }}>*</span>
              </label>
              
              {/* Hidden file input */}
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: "none" }}
              />

              {/* Upload trigger container */}
              <div 
                onClick={handleUploadClick}
                style={{
                  display: "flex",
                  width: "100%",
                  height: 38,
                  padding: "0 12px",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderRadius: 8,
                  border: file ? "1px solid var(--Foundation-neutral-neutral-500, #808080)" : "1px solid #D4D5D8",
                  background: "transparent",
                  cursor: "pointer",
                  boxSizing: "border-box",
                  transition: "border 0.2s ease"
                }}
              >
                <span style={{
                  fontSize: 14,
                  color: file ? "var(--Foundation-neutral-neutral-950, #141414)" : "var(--Foundation-neutral-neutral-500, #808080)"
                }}>
                  {file ? "Image uploaded" : "Upload an image of an issue"}
                </span>

                {file && previewUrl ? (
                  <div 
                    style={{ 
                      position: "relative", 
                      width: 24, 
                      height: 24,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      style={{ 
                        width: 24, 
                        height: 24, 
                        borderRadius: 4, 
                        objectFit: "cover",
                        border: "1px solid #E5E7EB"
                      }}
                    />
                    {/* Small Close Button */}
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      style={{
                        position: "absolute",
                        top: -5,
                        right: -5,
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        border: "1px solid #D4D5D8",
                        background: "#FFF",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                        padding: 0,
                        boxShadow: "0px 1px 2px rgba(0,0,0,0.15)"
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 24 24" fill="none" stroke="#464646" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                ) : (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none"
                    style={{ width: 24, height: 24, flexShrink: 0 }}
                  >
                    <path 
                      d="M4 15.2044V18.8925C4 19.4514 4.21071 19.9875 4.58579 20.3827C4.96086 20.778 5.46957 21 6 21H18C18.5304 21 19.0391 20.778 19.4142 20.3827C19.7893 19.9875 20 19.4514 20 18.8925V15.2044M12.0007 14.9425L12.0007 3M16.5722 7.56318L12.0007 3L7.42931 7.56318" 
                      stroke="#464646" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </div>

          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={!isFormComplete}
            style={{
              borderRadius: 12,
              background: isFormComplete ? "var(--Foundation-brand-brand-500, #00236F)" : "var(--Foundation-neutral-neutral-100, #D4D5D8)",
              display: "flex",
              width: 422,
              height: 48,
              padding: "8px 24px",
              justifyContent: "center",
              alignItems: "center",
              gap: 8,
              color: isFormComplete ? "#FFF" : "var(--Foundation-neutral-neutral-500, #808080)",
              fontSize: 16,
              fontWeight: 500,
              border: "none",
              cursor: isFormComplete ? "pointer" : "not-allowed",
              transition: "all 0.3s ease",
              boxSizing: "border-box"
            }}
          >
            Save
          </button>
        </form>

      </div>
    </div>
  );
};

export default Report_Bug;
