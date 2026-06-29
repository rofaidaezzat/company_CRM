import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, ChevronDown, Wrench, Briefcase, Target, Filter } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import Edit_Profile from '../components/Setting/Edit_Profile';
import Change_password from '../components/Setting/Change_password';
import Monthly from '../components/Setting/Monthly';
import Distribution_Method from '../components/Setting/Distribution_Method';
import Lead_Form_Question from '../components/Setting/Lead_Form_Question';
import { useGetProfileDetailsQuery, useUpdateProfileInfoMutation } from '../app/service/crudsetting';
import '../styles/settings-mobile.css';

import companyLogo from '../assets/7a32fb9fa7972d76a87f5709de18f309ed2c16f1.png';
import userProfileCircleIcon from '../assets/user-profile-circle.svg';
import emailIcon from '../assets/email.svg';
import userProfile01Icon from '../assets/user-profile-01.svg';
import locationIcon from '../assets/boxicons_location.svg';
import phoneIcon from '../assets/phone.svg';
import starsIcon from '../assets/stars.svg';
import edit03Icon from '../assets/edit-03.svg';
import bellIcon from '../assets/bell-ringing-04.svg';
import lockOpen03Icon from '../assets/lock-open-03.svg';
import languageIcon from '../assets/language.svg';

const PRIMARY = 'rgba(0, 35, 111, 1)';
const HEADER_BG = 'rgba(237, 239, 242, 1)';
const CARD_SHADOW = '0px 1px 3px 0px rgba(0, 0, 0, 0.11)';
const BORDER = '1px solid rgba(237, 239, 242, 1)';
const NEUTRAL_BORDER = '1px solid rgba(212, 213, 216, 1)';

const END_GAP = 24;
const PROFILE_HEIGHT = 292;
const BOTTOM_ROW_GAP = 24;
const PROFILE_INFO_GAP = 20;
const PROFILE_INFO_HEIGHT = 172;
const DESCRIPTION_WIDTH = 555;
const DESCRIPTION_GAP = 16;

const cardShellStyle: React.CSSProperties = {
  borderRadius: 12,
  boxShadow: CARD_SHADOW,
  background: 'rgba(255, 255, 255, 1)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  boxSizing: 'border-box',
};

const ModalOverlay = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => (
  <div
    style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}
    onClick={onClose}
  >
    <div onClick={(e) => e.stopPropagation()}>{children}</div>
  </div>
);

const CardHeader = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <div
    style={{
      background: HEADER_BG,
      width: '100%',
      height: 72,
      flexShrink: 0,
      padding: '24px 32px',
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
    }}
  >
    {icon}
    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, fontWeight: 500, color: '#4B5563' }}>{title}</span>
  </div>
);

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <div
    onClick={onChange}
    style={{
      width: 44,
      height: 24,
      background: checked ? PRIMARY : 'rgba(212, 213, 216, 1)',
      borderRadius: 12,
      position: 'relative',
      cursor: 'pointer',
      transition: 'all 0.2s',
      flexShrink: 0,
    }}
  >
    <div
      style={{
        width: 20,
        height: 20,
        background: '#fff',
        borderRadius: '50%',
        position: 'absolute',
        top: 2,
        left: checked ? 22 : 2,
        transition: 'all 0.2s',
      }}
    />
  </div>
);

const SubSectionTitle = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
    {icon}
    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 600, color: '#141414' }}>{title}</span>
  </div>
);

const FieldDescription = ({ children }: { children: React.ReactNode }) => (
  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#6B7280', lineHeight: '140%', display: 'block' }}>
    {children}
  </span>
);

const DropdownTrigger = ({
  value,
  onClick,
  width = 140,
}: {
  value: string;
  onClick: () => void;
  width?: number | string;
}) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      position: 'relative',
      width,
      height: 40,
      padding: '8px 32px 8px 12px',
      borderRadius: 8,
      border: NEUTRAL_BORDER,
      fontFamily: 'Inter, sans-serif',
      fontSize: 14,
      color: '#141414',
      background: '#fff',
      cursor: 'pointer',
      boxSizing: 'border-box',
      textAlign: 'left',
    }}
  >
    {value}
    <ChevronDown
      size={16}
      color="#464646"
      style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
    />
  </button>
);

const InfoRow = ({ icon, text }: { icon: string; text: string }) => (
  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
    <img src={icon} alt="" style={{ width: 16, height: 16 }} />
    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#4B5563' }}>{text}</span>
  </div>
);

const Settings = () => {
  const { language: contextLanguage, changeLanguage, t } = useTranslation();
  const language = contextLanguage === 'ar' ? 'Arabic' : 'English';

  // ── API ──────────────────────────────────────────────────────────────────
  const { data: profileResp, isLoading: profileLoading } = useGetProfileDetailsQuery();
  const [updateProfile] = useUpdateProfileInfoMutation();
  const profile = profileResp?.data?.profile;

  // ── Local UI state ────────────────────────────────────────────────────────
  const [taskReminder, setTaskReminder] = useState(false);
  const [followupReminder, setFollowupReminder] = useState(false);
  const [targetPeriod, setTargetPeriod] = useState('Monthly');
  const [targetValue, setTargetValue] = useState('');
  const [commissionPercentage, setCommissionPercentage] = useState('');
  const [distributionMethod, setDistributionMethod] = useState('Automatic distribution');
  const [isPeriodOpen, setIsPeriodOpen] = useState(false);
  const [isDistributionOpen, setIsDistributionOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);

  // Populate toggles from API
  useEffect(() => {
    if (profile) {
      setTaskReminder(profile.task_reminder ?? false);
      setFollowupReminder(profile.follow_up_reminder ?? false);
      setCommissionPercentage(profile.target_percentage != null ? String(profile.target_percentage) : '');
    }
  }, [profile]);

  // Toggle handlers that also update the backend
  const handleToggleTask = async () => {
    const next = !taskReminder;
    setTaskReminder(next);
    try { await updateProfile({ task_reminder: next }).unwrap(); } catch {}
  };
  const handleToggleFollowup = async () => {
    const next = !followupReminder;
    setFollowupReminder(next);
    try { await updateProfile({ follow_up_reminder: next }).unwrap(); } catch {}
  };

  // Profile display helpers
  const fullName = profile ? `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim() : 'Loading...';
  const initials = profile
    ? `${(profile.first_name ?? '').charAt(0)}${(profile.last_name ?? '').charAt(0)}`.toUpperCase()
    : '?';

  const periodRef = useRef<HTMLDivElement>(null);
  const distributionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (periodRef.current && !periodRef.current.contains(e.target as Node)) {
        setIsPeriodOpen(false);
      }
      if (distributionRef.current && !distributionRef.current.contains(e.target as Node)) {
        setIsDistributionOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const descriptionText =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

  return (
    <div
      className="settings-page-root"
      style={{
        width: `calc(100% + ${END_GAP}px)`,
        marginRight: -END_GAP,
        paddingRight: END_GAP,
        paddingBottom: 24,
        paddingTop: 8,
        boxSizing: 'border-box',
      }}
    >
      <div className="settings-page-inner" style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            fontSize: 33,
            lineHeight: '100%',
            color: PRIMARY,
            marginBottom: 24,
          }}
        >
          {t('sidebar.settings')}
        </div>

        {/* Profile */}
        <div
          className="settings-profile-card"
          style={{
            ...cardShellStyle,
            width: '100%',
            height: PROFILE_HEIGHT,
            marginBottom: 24,
          }}
        >
          <CardHeader
            icon={<img src={userProfileCircleIcon} alt="" style={{ width: 24, height: 24 }} />}
            title="Profile"
          />
          <div
            style={{
              flex: 1,
              minHeight: 0,
              padding: 24,
              boxSizing: 'border-box',
              overflow: 'hidden',
            }}
          >
            <div className="settings-profile-body" style={{ display: 'flex', gap: 24, alignItems: 'stretch', height: '100%' }}>
                {/* Profile left: avatar + info */}
              <div
                className="settings-profile-left"
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: PROFILE_INFO_GAP,
                  height: PROFILE_INFO_HEIGHT,
                  flex: 1,
                  minWidth: 0,
                  alignItems: 'flex-start',
                }}
              >
                {/* Avatar */}
                {profile?.avatar ? (
                  <img
                    src={profile.avatar}
                    alt="Avatar"
                    style={{ width: 136, height: 136, borderRadius: 99, objectFit: 'cover', flexShrink: 0 }}
                  />
                ) : (
                  <div
                    style={{
                      width: 136, height: 136, borderRadius: 99,
                      background: '#8FA0C0', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontFamily: 'Inter, sans-serif',
                      fontWeight: 700, fontSize: 40,
                    }}
                  >
                    {profileLoading ? '…' : initials}
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1, minWidth: 0 }}>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, fontWeight: 600, color: '#141414' }}>
                    {fullName}
                  </span>
                  <div
                    style={{
                      background: '#E6E9F1',
                      padding: '4px 8px',
                      borderRadius: 12,
                      display: 'inline-flex',
                      alignSelf: 'flex-start',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 12,
                      color: '#4B5563',
                    }}
                  >
                    {profile?.role?.name ?? 'Sales'}
                  </div>
                  <div
                    className="settings-profile-contact-grid"
                    style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 32px', alignContent: 'start' }}
                  >
                    <InfoRow icon={emailIcon} text={profile?.email ?? '—'} />
                    <InfoRow icon={phoneIcon} text={profile?.phone ?? '—'} />
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <img src={starsIcon} alt="" style={{ width: 16, height: 16 }} />
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#4B5563' }}>
                        Rank #{profile?.current_rank ?? '—'}
                      </span>
                    </div>
                    <InfoRow icon={userProfile01Icon} text={`${profile?.monthly_sales ?? '—'} monthly sales`} />
                    <InfoRow icon={locationIcon} text={[profile?.city, profile?.country].filter(Boolean).join(', ') || '—'} />
                  </div>
                </div>
              </div>

              <div className="settings-profile-divider" style={{ width: 1, background: HEADER_BG, flexShrink: 0, alignSelf: 'stretch' }} />

              <div
                className="settings-profile-description"
                style={{
                  width: DESCRIPTION_WIDTH,
                  maxWidth: '100%',
                  flexShrink: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: DESCRIPTION_GAP,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 600, color: '#141414' }}>
                    Description
                  </span>
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
                    onClick={() => setIsEditProfileOpen(true)}
                  >
                    <img src={edit03Icon} alt="" style={{ width: 16, height: 16 }} />
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 500, color: PRIMARY }}>
                      Edit Profile
                    </span>
                  </div>
                </div>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#4B5563', lineHeight: '150%', margin: 0 }}>
                  {descriptionText}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Account + Business */}
        <div
          className="settings-bottom-row"
          style={{
            display: 'flex',
            width: '100%',
            gap: BOTTOM_ROW_GAP,
            alignItems: 'flex-start',
          }}
        >
          {/* Account Settings */}
          <div
            className="settings-account-card"
            style={{
              ...cardShellStyle,
              flex: 1,
              minWidth: 0,
            }}
          >
            <CardHeader icon={<Wrench size={24} color="#4B5563" strokeWidth={1.5} />} title="Account Settings" />
            <div
              style={{
                flex: 1,
                minHeight: 0,
                padding: '24px 32px',
                boxSizing: 'border-box',
                overflow: 'auto',
              }}
            >
              {/* Notifications */}
              <SubSectionTitle icon={<img src={bellIcon} alt="" style={{ width: 20, height: 20 }} />} title="Notifications" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 24, paddingBottom: 24, borderBottom: BORDER }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 24, borderBottom: BORDER }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: '80%', paddingRight: 16 }}>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 500, color: '#141414' }}>Task Reminder</span>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#6B7280', lineHeight: '140%' }}>
                      Receive Alerts when a scheduled task is approaching its deadline.
                    </span>
                  </div>
                <Toggle checked={taskReminder} onChange={handleToggleTask} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 24 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: '80%', paddingRight: 16 }}>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 500, color: '#141414' }}>Followup Reminder</span>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#6B7280', lineHeight: '140%' }}>
                      Receive Alerts for neglected leads approaching their followup time.
                    </span>
                  </div>
                  <Toggle checked={followupReminder} onChange={handleToggleFollowup} />
                </div>
              </div>

              {/* Security */}
              <SubSectionTitle icon={<img src={lockOpen03Icon} alt="" style={{ width: 20, height: 20 }} />} title="Security" />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: 24,
                  marginBottom: 24,
                  borderBottom: BORDER,
                  cursor: 'pointer',
                }}
                onClick={() => setIsChangePasswordOpen(true)}
              >
                <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 14, color: '#141414' }}>Change Password</span>
                <ChevronRight size={20} color="#6B7280" />
              </div>

              {/* Languages */}
              <SubSectionTitle icon={<img src={languageIcon} alt="" style={{ width: 20, height: 20 }} />} title="Languages" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0, margin: '0 -32px', marginBottom: -24 }}>
                {(['English', 'Arabic'] as const).map((lang, idx) => (
                  <div
                    key={lang}
                    onClick={() => changeLanguage(lang === 'Arabic' ? 'ar' : 'en')}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '16px 32px',
                      background: language === lang ? 'rgba(219, 234, 254, 0.6)' : '#fff',
                      borderBottom: idx === 0 ? BORDER : 'none',
                      cursor: 'pointer',
                      borderBottomLeftRadius: idx === 1 ? 12 : 0,
                      borderBottomRightRadius: idx === 1 ? 12 : 0,
                    }}
                  >
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 500, color: '#141414' }}>{lang}</span>
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        border: language === lang ? `6px solid ${PRIMARY}` : '1px solid rgba(212, 213, 216, 1)',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Business Settings */}
          <div
            className="settings-business-card"
            style={{
              ...cardShellStyle,
              flex: 1,
              minWidth: 0,
            }}
          >
            <CardHeader icon={<Briefcase size={24} color="#4B5563" strokeWidth={1.5} />} title="Business Settings" />
            <div
              style={{
                flex: 1,
                minHeight: 0,
                padding: '24px 32px',
                boxSizing: 'border-box',
                overflow: 'auto',
              }}
            >
              {/* Sales Performance — vertical, width fill, height hug */}
              <div className="settings-sales-performance" style={{ display: 'flex', flexDirection: 'column', width: '100%', marginBottom: 24, paddingBottom: 24, borderBottom: BORDER }}>
                <SubSectionTitle icon={<Target size={20} color="#464646" strokeWidth={1.5} />} title="Sales Performance" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minWidth: 0 }}>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 500, color: '#141414' }}>Target Period</span>
                      <FieldDescription>Define how often this target is measured and reset.</FieldDescription>
                    </div>
                    <div ref={periodRef} style={{ position: 'relative', flexShrink: 0 }}>
                      <DropdownTrigger
                        value={targetPeriod}
                        onClick={() => setIsPeriodOpen((o) => !o)}
                        width={140}
                      />
                      {isPeriodOpen && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 'calc(100% + 4px)',
                            right: 0,
                            zIndex: 50,
                          }}
                        >
                          <Monthly
                            value={targetPeriod}
                            onChange={(v) => {
                              setTargetPeriod(v);
                              setIsPeriodOpen(false);
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 500, color: '#141414' }}>Target Value</span>
                    <FieldDescription>Enter the preferred monthly target value for the team.</FieldDescription>
                    <div
                      style={{
                        display: 'flex',
                        width: 476,
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        gap: 8,
                      }}
                    >
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 500, color: '#141414', marginTop: 4 }}>
                        Value<span style={{ color: '#DC2626' }}>*</span>
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12, width: '100%' }}>
                        <div
                          style={{
                            display: 'flex',
                            height: 48,
                            padding: '0 12px',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flex: 1,
                            borderRadius: 8,
                            background: targetValue.trim() !== '' ? 'var(--Foundation-neutral-neutral-100, #D4D5D8)' : 'transparent',
                            border: targetValue.trim() !== '' ? 'none' : NEUTRAL_BORDER,
                            boxSizing: 'border-box',
                          }}
                        >
                          <input
                            type="text"
                            value={targetValue}
                            onChange={(e) => setTargetValue(e.target.value)}
                            placeholder=""
                            style={{
                              border: 'none',
                              background: 'transparent',
                              outline: 'none',
                              flex: 1,
                              fontFamily: 'Inter, sans-serif',
                              fontSize: 14,
                              color: '#141414',
                              height: '100%',
                              width: '100%',
                              padding: 0,
                            }}
                          />
                          {targetValue.trim() !== '' && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginLeft: 8 }}>
                              <path fillRule="evenodd" clipRule="evenodd" d="M15.325 4.90729C15.7153 4.51674 16.3483 4.51647 16.739 4.9067L19.0924 7.25746C19.4832 7.64784 19.4835 8.28116 19.093 8.67187L9.13519 18.6352C8.99591 18.7745 8.81857 18.8696 8.62542 18.9085L4.2002 19.8002L5.09344 15.3802C5.1324 15.1875 5.22732 15.0105 5.36633 14.8714L15.325 4.90729Z" stroke="black" strokeWidth="2" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#4B5563', whiteSpace: 'nowrap' }}>
                          EGP
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lead Management — vertical, top border, height hug */}
              <div
                className="settings-lead-management"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  borderTop: NEUTRAL_BORDER,
                  paddingTop: 24,
                  gap: 24,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M13.9681 18.2209C13.9681 19.5248 15.0252 20.5818 16.3291 20.5818C17.633 20.5818 18.69 19.5248 18.69 18.2209C18.69 16.917 17.633 15.86 16.3291 15.86C15.0252 15.86 13.9681 16.917 13.9681 18.2209ZM13.9681 18.2209H10.0005C7.79144 18.2209 6.00061 16.4302 6.0005 14.2211L6 4M13.5255 8.77719H6M18.69 8.77719C18.69 10.0811 17.633 11.1381 16.3291 11.1381C15.0252 11.1381 13.9681 10.0811 13.9681 8.77719C13.9681 7.47329 15.0252 6.41626 16.3291 6.41626C17.633 6.41626 18.69 7.47329 18.69 8.77719Z" stroke="#464646" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 19,
                      fontWeight: 500,
                      color: 'var(--Foundation-neutral-neutral-800, #464646)',
                    }}
                  >
                    Lead Management
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 16,
                      fontWeight: 500,
                      color: 'var(--Foundation-neutral-neutral-950, #141414)',
                    }}
                  >
                    Distribution Method
                  </span>
                  <div ref={distributionRef} style={{ position: 'relative', width: '100%' }}>
                    <button
                      type="button"
                      onClick={() => setIsDistributionOpen((o) => !o)}
                      style={{
                        position: 'relative',
                        width: '100%',
                        height: 44,
                        padding: '10px 32px 10px 12px',
                        borderRadius: 8,
                        border: NEUTRAL_BORDER,
                        fontFamily: 'Inter, sans-serif',
                        fontSize: 14,
                        color: '#141414',
                        background: '#fff',
                        cursor: 'pointer',
                        boxSizing: 'border-box',
                        textAlign: 'left',
                      }}
                    >
                      {distributionMethod}
                      <ChevronDown
                        size={16}
                        color="#464646"
                        style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                      />
                    </button>
                    {isDistributionOpen && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 'calc(100% + 4px)',
                          left: 0,
                          zIndex: 50,
                          maxWidth: '100%',
                        }}
                      >
                        <Distribution_Method
                          value={distributionMethod}
                          onChange={(v) => {
                            setDistributionMethod(v);
                            setIsDistributionOpen(false);
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div style={{ marginTop: 4 }}>
                    <FieldDescription>
                      Leads are assigned instantly based on predefined rules, availability, priority, or workload to ensure zero response delay.
                    </FieldDescription>
                  </div>
                </div>

                <div
                  style={{
                    borderTop: NEUTRAL_BORDER,
                    paddingTop: 24,
                    width: '100%',
                  }}
                >
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setIsLeadFormOpen(true)}
                    onKeyDown={(e) => e.key === 'Enter' && setIsLeadFormOpen(true)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      cursor: 'pointer',
                      gap: 16,
                      paddingBottom: 4,
                    }}
                  >
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span
                        style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: 16,
                          fontWeight: 500,
                          color: 'var(--Foundation-neutral-neutral-950, #141414)',
                        }}
                      >
                        Lead Form Questions
                      </span>
                      <FieldDescription>
                        Add questions to qualify leads and capture key details upfront assisted with personalized AI suggestions.
                      </FieldDescription>
                    </div>
                    <ChevronRight size={20} color="#6B7280" style={{ flexShrink: 0, marginTop: 2 }} />
                  </div>
                </div>

                {/* Commission Settings */}
                <div
                  className="settings-commission-settings"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: 16,
                    alignSelf: 'stretch',
                    borderTop: NEUTRAL_BORDER,
                    paddingTop: 24,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                      <path d="M7.72937 19.512C7.20498 19.6853 6.92036 20.2509 7.09367 20.7753C7.26697 21.2997 7.83256 21.5843 8.35695 21.411L8.04316 20.4615L7.72937 19.512ZM13.8622 20.8462L13.7722 19.8502V19.8502L13.8622 20.8462ZM17.3536 20.0769L17.7891 20.9771H17.7891L17.3536 20.0769ZM20.6897 17.0681L19.9153 16.4354V16.4354L20.6897 17.0681ZM18.408 15.1854L19.1121 15.8955V15.8955L18.408 15.1854ZM16.8715 16.7087L17.5756 17.4188V17.4188L16.8715 16.7087ZM12.6984 16.3846C12.1461 16.3846 11.6984 16.8323 11.6984 17.3846C11.6984 17.9369 12.1461 18.3846 12.6984 18.3846V17.3846V16.3846ZM20.335 14.9962L19.7836 15.8305V15.8305L20.335 14.9962ZM9.22402 14.4915L9.66816 15.3875H9.66816L9.22402 14.4915ZM13.4001 14.1128L13.6611 13.1475H13.6611L13.4001 14.1128ZM15.0309 14.5538L14.7699 15.5191H14.7699L15.0309 14.5538ZM15.5476 16.4829L14.8435 15.7727V15.7727L15.5476 16.4829ZM13.934 16.6745C13.5418 17.0633 13.5391 17.6965 13.9279 18.0887C14.3168 18.4809 14.9499 18.4836 15.3421 18.0948L14.6381 17.3846L13.934 16.6745ZM8.04316 20.4615L8.35695 21.411C8.4545 21.3788 8.67974 21.3518 9.10006 21.3815C9.50005 21.4098 9.96832 21.4794 10.5079 21.5634C11.5286 21.7224 12.8321 21.9433 13.9521 21.8421L13.8622 20.8462L13.7722 19.8502C12.9526 19.9242 11.9284 19.7605 10.8156 19.5872C10.2883 19.5051 9.73824 19.4216 9.24113 19.3865C8.76435 19.3528 8.21371 19.352 7.72937 19.512L8.04316 20.4615ZM13.8622 20.8462L13.9521 21.8421C15.4538 21.7065 16.2079 21.7421 17.7891 20.9771L17.3536 20.0769L16.9181 19.1767C15.7223 19.7553 15.3478 19.7079 13.7722 19.8502L13.8622 20.8462ZM17.3536 20.0769L17.7891 20.9771C19.219 20.2853 20.6284 18.7238 21.4642 17.7007L20.6897 17.0681L19.9153 16.4354C19.0698 17.4704 17.9056 18.699 16.9181 19.1767L17.3536 20.0769ZM18.408 15.1854L17.7039 14.4753L16.1675 15.9986L16.8715 16.7087L17.5756 17.4188L19.1121 15.8955L18.408 15.1854ZM15.2257 17.3846V16.3846H12.6984V17.3846V18.3846H15.2257V17.3846ZM16.8715 16.7087L16.1675 15.9986C15.9191 16.2448 15.5805 16.3846 15.2257 16.3846V17.3846V18.3846C16.1054 18.3846 16.9509 18.0382 17.5756 17.4188L16.8715 16.7087ZM20.335 14.9962L20.8864 14.162C19.8866 13.5011 18.5558 13.6307 17.7039 14.4753L18.408 15.1854L19.1121 15.8955C19.2897 15.7194 19.572 15.6906 19.7836 15.8305L20.335 14.9962ZM20.6897 17.0681L21.4642 17.7007C22.4053 16.5487 22.046 14.9284 20.8864 14.162L20.335 14.9962L19.7836 15.8305C20.0394 15.9995 20.0448 16.2769 19.9153 16.4354L20.6897 17.0681ZM3.77587 13.5385V14.5385H6.87935V13.5385V12.5385H3.77587V13.5385ZM7.65522 14.3077H6.65522V21.2308H7.65522H8.65522V14.3077H7.65522ZM6.87935 22V21H3.77587V22V23H6.87935V22ZM3 21.2308H4V14.3077H3H2V21.2308H3ZM3.77587 22V21C3.89153 21 4 21.0952 4 21.2308H3H2C2 22.216 2.80321 23 3.77587 23V22ZM7.65522 21.2308H6.65522C6.65522 21.0952 6.76369 21 6.87935 21V22V23C7.85201 23 8.65522 22.216 8.65522 21.2308H7.65522ZM6.87935 13.5385V14.5385C6.76369 14.5385 6.65522 14.4432 6.65522 14.3077H7.65522H8.65522C8.65522 13.3225 7.85202 12.5385 6.87935 12.5385V13.5385ZM3.77587 13.5385V12.5385C2.8032 12.5385 2 13.3225 2 14.3077H3H4C4 14.4432 3.89153 14.5385 3.77587 14.5385V13.5385ZM8.04316 15.0769L8.4873 15.9729L9.66816 15.3875L9.22402 14.4915L8.77987 13.5956L7.59901 14.181L8.04316 15.0769ZM11.6529 13.9231V14.9231H11.9711V13.9231V12.9231H11.6529V13.9231ZM13.4001 14.1128L13.1391 15.0781L14.7699 15.5191L15.0309 14.5538L15.2919 13.5884L13.6611 13.1475L13.4001 14.1128ZM15.5476 16.4829L14.8435 15.7727L13.934 16.6745L14.6381 17.3846L15.3421 18.0948L16.2517 17.193L15.5476 16.4829ZM15.0309 14.5538L14.7699 15.5191C14.8963 15.5533 14.922 15.6949 14.8435 15.7727L15.5476 16.4829L16.2517 17.193C17.4369 16.0179 16.8897 14.0205 15.2919 13.5884L15.0309 14.5538ZM11.9711 13.9231V14.9231C12.3657 14.9231 12.7585 14.9752 13.1391 15.0781L13.4001 14.1128L13.6611 13.1475C13.1102 12.9985 12.5419 12.9231 11.9711 12.9231V13.9231ZM9.22402 14.4915L9.66816 15.3875C10.284 15.0822 10.9635 14.9231 11.6529 14.9231V13.9231V12.9231C10.6559 12.9231 9.67231 13.1532 8.77987 13.5956L9.22402 14.4915ZM17.7415 8.15385H16.7415C16.7415 9.29281 15.8079 10.2308 14.6381 10.2308V11.2308V12.2308C16.8962 12.2308 18.7415 10.4136 18.7415 8.15385H17.7415ZM14.6381 11.2308V10.2308C13.4682 10.2308 12.5346 9.29281 12.5346 8.15385H11.5346H10.5346C10.5346 10.4136 12.3799 12.2308 14.6381 12.2308V11.2308ZM11.5346 8.15385H12.5346C12.5346 7.01488 13.4682 6.07692 14.6381 6.07692V5.07692V4.07692C12.3799 4.07692 10.5346 5.89414 10.5346 8.15385H11.5346ZM14.6381 5.07692V6.07692C15.8079 6.07692 16.7415 7.01488 16.7415 8.15385H17.7415H18.7415C18.7415 5.89414 16.8962 4.07692 14.6381 4.07692V5.07692ZM11.5346 8.15385H12.5346C12.5346 7.01488 13.4682 6.07692 14.6381 6.07692V5.07692V4.07692C12.3799 4.07692 10.5346 5.89414 10.5346 8.15385H11.5346ZM14.6381 5.07692V6.07692C15.8079 6.07692 16.7415 7.01488 16.7415 8.15385H17.7415H18.7415C18.7415 5.89414 16.8962 4.07692 14.6381 4.07692V5.07692ZM11.5346 8.15385V7.15385C10.3647 7.15385 9.43109 6.21589 9.43109 5.07692H8.43109H7.43109C7.43109 7.33663 9.2764 9.15385 11.5346 9.15385V8.15385ZM8.43109 5.07692H9.43109C9.43109 3.93796 10.3647 3 11.5346 3V2V1C9.2764 1 7.43109 2.81722 7.43109 5.07692H8.43109ZM11.5346 2V3C12.7044 3 13.6381 3.93796 13.6381 5.07692H14.6381H15.6381C15.6381 2.81722 13.7927 1 11.5346 1V2Z" fill="#464646"/>
                    </svg>
                    <span
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: 19,
                        fontWeight: 500,
                        color: 'var(--Foundation-neutral-neutral-800, #464646)',
                      }}
                    >
                      Commission Settings
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      width: 476,
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'flex-start',
                      gap: 8,
                    }}
                  >
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 500, color: '#141414' }}>
                      Percentage<span style={{ color: '#00236F' }}>*</span>
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12, width: '100%' }}>
                      <div
                        style={{
                          display: 'flex',
                          height: 48,
                          padding: '0 12px',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flex: 1,
                          borderRadius: 8,
                          background: commissionPercentage.trim() !== '' ? 'var(--Foundation-neutral-neutral-100, #D4D5D8)' : 'transparent',
                          border: commissionPercentage.trim() !== '' ? 'none' : NEUTRAL_BORDER,
                          boxSizing: 'border-box',
                        }}
                      >
                        <input
                          type="text"
                          value={commissionPercentage}
                          onChange={(e) => setCommissionPercentage(e.target.value)}
                          placeholder=""
                          style={{
                            border: 'none',
                            background: 'transparent',
                            outline: 'none',
                            flex: 1,
                            fontFamily: 'Inter, sans-serif',
                            fontSize: 14,
                            color: '#141414',
                            height: '100%',
                            width: '100%',
                            padding: 0,
                          }}
                        />
                        {commissionPercentage.trim() !== '' && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginLeft: 8 }}>
                            <path fillRule="evenodd" clipRule="evenodd" d="M15.325 4.90729C15.7153 4.51674 16.3483 4.51647 16.739 4.9067L19.0924 7.25746C19.4832 7.64784 19.4835 8.28116 19.093 8.67187L9.13519 18.6352C8.99591 18.7745 8.81857 18.8696 8.62542 18.9085L4.2002 19.8002L5.09344 15.3802C5.1324 15.1875 5.22732 15.0105 5.36633 14.8714L15.325 4.90729Z" stroke="black" strokeWidth="2" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#4B5563', whiteSpace: 'nowrap' }}>
                        % Per Deal
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isEditProfileOpen && (
        <ModalOverlay onClose={() => setIsEditProfileOpen(false)}>
          <Edit_Profile onClose={() => setIsEditProfileOpen(false)} />
        </ModalOverlay>
      )}
      {isChangePasswordOpen && (
        <ModalOverlay onClose={() => setIsChangePasswordOpen(false)}>
          <Change_password onClose={() => setIsChangePasswordOpen(false)} />
        </ModalOverlay>
      )}
      {isLeadFormOpen && (
        <ModalOverlay onClose={() => setIsLeadFormOpen(false)}>
          <Lead_Form_Question onClose={() => setIsLeadFormOpen(false)} />
        </ModalOverlay>
      )}
    </div>
  );
};

export default Settings;
