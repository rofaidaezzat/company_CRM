import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import rightImage from '../assets/7a32fb9fa7972d76a87f5709de18f309ed2c16f1.png';

const Update_Password: React.FC = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isFormComplete = newPassword !== '' && confirmPassword !== '';

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Add update password API call here
    console.log("Updating password...");
    navigate('/login');
  };

  return (
    <div style={{
      width: "100%",
      height: "100vh",
      background: "#F5F6FA",
      display: "flex",
      padding: "88px 24px",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "Inter, sans-serif",
      boxSizing: "border-box",
      overflow: "hidden"
    }}>
      {/* Main Container */}
      <div style={{
        display: "flex",
        width: "100%",
        height: "100%",
        gap: 24,
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        
        {/* Left Part */}
        <div style={{
          boxShadow: "0px 1px 3px 0px rgba(0, 0, 0, 0.11)",
          background: "rgba(255, 255, 255, 1)",
          flex: 1,
          height: "100%",
          borderRadius: 12,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative" // For absolute back button positioning
        }}>
          {/* Back Button */}
          <button 
            onClick={() => navigate("/otp-verification")}
            style={{
              position: "absolute",
              top: 32,
              left: 32,
              borderRadius: 12,
              border: "1px solid var(--Foundation-neutral-neutral-800, #464646)",
              display: "inline-flex",
              height: 32,
              padding: "8px 16px",
              justifyContent: "center",
              alignItems: "center",
              gap: 8,
              background: "transparent",
              cursor: "pointer",
              boxSizing: "border-box"
            }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 12 11" 
              fill="none" 
              style={{
                width: 10,
                height: 8.75,
                flexShrink: 0
              }}
            >
              <path 
                d="M5.16667 1L1 5.375L5.16667 9.75M1 5.375H11" 
                stroke="var(--Foundation-neutral-neutral-950, #141414)" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            <span style={{
              color: "var(--Foundation-neutral-neutral-950, #141414)",
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
              fontWeight: 500,
              lineHeight: "normal"
            }}>Back</span>
          </button>

          {/* Logo and Form Container */}
          <div style={{
            display: "flex",
            width: 380,
            flexDirection: "column",
            alignItems: "center",
            gap: 56,
            flexShrink: 0
          }}>
            
            {/* Header (Logo + Update Password) */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, width: "100%" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" fill="none">
                <g clipPath="url(#clip0_2268_44812)">
                  <path fillRule="evenodd" clipRule="evenodd" d="M35.778 16.3594C33.4757 14.8211 30.7689 14 28 14V0C33.5378 0 38.9514 1.64217 43.556 4.71885C48.1606 7.79552 51.7493 12.1685 53.8686 17.2848C55.9878 22.4011 56.5424 28.0311 55.462 33.4625C54.3816 38.894 51.7149 43.8831 47.7989 47.7989C43.8831 51.7149 38.894 54.3816 33.4625 55.462C28.0311 56.5424 22.4011 55.9878 17.2848 53.8686C12.1685 51.7493 7.79552 48.1606 4.71885 43.556C1.64217 38.9514 0 33.5378 0 28H14C14 30.7689 14.8211 33.4757 16.3594 35.778C17.8977 38.0803 20.0843 39.8747 22.6425 40.9343C25.2006 41.994 28.0155 42.2712 30.7313 41.7309C33.447 41.1908 35.9415 39.8574 37.8995 37.8995C39.8574 35.9415 41.1908 33.447 41.7309 30.7313C42.2712 28.0155 41.994 25.2006 40.9343 22.6425C39.8747 20.0843 38.0803 17.8977 35.778 16.3594Z" fill="#007DFC"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M14 6.06375e-06C14 1.83851 13.6379 3.65901 12.9343 5.35756C12.2308 7.05613 11.1995 8.59947 9.89948 9.8995C8.59949 11.1995 7.05613 12.2308 5.35756 12.9343C3.659 13.6379 1.83851 14 6.11954e-07 14L0 28C3.67702 28 7.31801 27.2758 10.7152 25.8686C14.1123 24.4615 17.199 22.399 19.7989 19.7989C22.399 17.199 24.4615 14.1123 25.8686 10.7151C27.2758 7.31801 28 3.677 28 0L14 6.06375e-06Z" fill="#007DFC"/>
                </g>
                <defs>
                  <clipPath id="clip0_2268_44812">
                    <rect width="56" height="56" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
              
              <h1 style={{
                margin: 0,
                color: "var(--Foundation-neutral-neutral-950, #141414)",
                fontFamily: "Inter, sans-serif",
                fontSize: "23px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "normal"
              }}>Update Password</h1>

              <p style={{
                margin: 0,
                color: "var(--Foundation-neutral-neutral-800, #464646)",
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "140%",
                textAlign: "center"
              }}>
                Check your Whatsapp we’ve sent you a one-time verification code.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleUpdatePassword} style={{ display: "flex", flexDirection: "column", width: "100%", gap: 32 }}>
              
              {/* Inputs Wrapper */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                
                {/* New Password */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
                  <label style={{ fontSize: 14, color: "var(--Foundation-neutral-neutral-950, #141414)", fontFamily: "Inter, sans-serif", fontWeight: 500 }}>New password<span style={{ color: "#00236F" }}>*</span></label>
                  <div style={{ position: "relative", width: "100%" }}>
                    <input 
                      type={showNewPassword ? "text" : "password"} 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      style={{
                        borderRadius: 8,
                        background: "transparent",
                        border: newPassword ? "1px solid var(--Foundation-neutral-neutral-500, #808080)" : "1px solid #D4D5D8",
                        display: "flex",
                        height: 36,
                        padding: "12px 40px 12px 12px",
                        alignItems: "center",
                        boxSizing: "border-box",
                        width: "100%",
                        outline: "none",
                        fontSize: 14,
                        transition: "border 0.2s ease"
                      }}
                    />
                    {newPassword && (
                      <div 
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", cursor: "pointer", display: "flex", alignItems: "center" }}
                      >
                        {showNewPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--Foundation-neutral-neutral-800, #464646)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--Foundation-neutral-neutral-800, #464646)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                            <line x1="1" y1="1" x2="23" y2="23"></line>
                          </svg>
                        )}
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: 12, color: "var(--Foundation-neutral-neutral-800, #464646)", fontFamily: "Inter, sans-serif", marginTop: 4 }}>Must be at least 12 characters</span>
                </div>

                {/* Confirm Password */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
                  <label style={{ fontSize: 14, color: "var(--Foundation-neutral-neutral-950, #141414)", fontFamily: "Inter, sans-serif", fontWeight: 500 }}>Confirm password<span style={{ color: "#00236F" }}>*</span></label>
                  <div style={{ position: "relative", width: "100%" }}>
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={{
                        borderRadius: 8,
                        background: "transparent",
                        border: confirmPassword ? "1px solid var(--Foundation-neutral-neutral-500, #808080)" : "1px solid #D4D5D8",
                        display: "flex",
                        height: 36,
                        padding: "12px 40px 12px 12px",
                        alignItems: "center",
                        boxSizing: "border-box",
                        width: "100%",
                        outline: "none",
                        fontSize: 14,
                        transition: "border 0.2s ease"
                      }}
                    />
                    {confirmPassword && (
                      <div 
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", cursor: "pointer", display: "flex", alignItems: "center" }}
                      >
                        {showConfirmPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--Foundation-neutral-neutral-800, #464646)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--Foundation-neutral-neutral-800, #464646)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                            <line x1="1" y1="1" x2="23" y2="23"></line>
                          </svg>
                        )}
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Verify Button */}
              <button 
                type="submit"
                disabled={!isFormComplete}
                style={{
                  borderRadius: 12,
                  background: isFormComplete ? "var(--Foundation-brand-brand-500, #00236F)" : "var(--Foundation-neutral-neutral-100, #D4D5D8)",
                  display: "flex",
                  height: 48,
                  padding: "8px 24px",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 8,
                  alignSelf: "stretch",
                  color: isFormComplete ? "#FFF" : "var(--Foundation-neutral-neutral-500, #808080)",
                  fontSize: 16,
                  fontWeight: 500,
                  border: "none",
                  cursor: isFormComplete ? "pointer" : "not-allowed",
                  transition: "all 0.3s ease"
                }}
              >
                Verify
              </button>

            </form>

          </div>
        </div>

        {/* Right Part (Image Container) */}
        <div style={{
          flex: 1,
          height: "100%",
          borderRadius: 12,
          overflow: "hidden",
          background: "#081329",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <img 
            src={rightImage} 
            alt="Login banner" 
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center"
            }}
          />
        </div>

      </div>
    </div>
  );
};

export default Update_Password;
