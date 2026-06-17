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
  const { language: contextLanguage, changeLanguage } = useTranslation();
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
          Settings
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
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 500, color: '#141414', marginTop: 4 }}>
                      Value<span style={{ color: '#DC2626' }}>*</span>
                    </span>
                    <input
                      type="text"
                      value={targetValue}
                      onChange={(e) => setTargetValue(e.target.value)}
                      placeholder=""
                      style={{
                        width: '100%',
                        height: 44,
                        padding: '10px 12px',
                        borderRadius: 8,
                        border: NEUTRAL_BORDER,
                        fontFamily: 'Inter, sans-serif',
                        fontSize: 14,
                        color: '#141414',
                        boxSizing: 'border-box',
                      }}
                    />
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
                <SubSectionTitle icon={<Filter size={20} color="#464646" strokeWidth={1.5} />} title="Lead Management" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 500, color: '#141414' }}>Distribution Method</span>
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
                </div>
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
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 500, color: '#141414' }}>Lead Form Questions</span>
                    <FieldDescription>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </FieldDescription>
                  </div>
                  <ChevronRight size={20} color="#6B7280" style={{ flexShrink: 0, marginTop: 2 }} />
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
