import React from 'react';
import { Mail, Phone, Star, Users, FileText, TrendingUp, BarChart2, Plus, Target, Eye } from 'lucide-react';

interface SalesCardProps {
  onAssignTask?: () => void;
  onPauseAccount?: () => void;
  onViewTasks?: () => void;
  onDelete?: () => void;
}

const StatBox = ({ icon, value, label }: { icon: React.ReactNode, value: string, label: string }) => (
  <div style={{ 
    flex: '1 0 0', 
    borderRadius: 14, 
    background: 'var(--Foundation-brand-brand-50, #E6E9F1)', 
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '8px 12px', 
    boxSizing: 'border-box', 
    gap: 4 
  }}>
    <div style={{ color: '#4B5563', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
    <div style={{ fontSize: 13, fontWeight: 700, color: '#141414', fontFamily: 'Inter, sans-serif', textAlign: 'center', lineHeight: 'normal' }}>{value}</div>
    <div style={{ fontSize: 12, fontWeight: 500, color: '#747474', fontFamily: 'Inter, sans-serif', textAlign: 'center', lineHeight: 'normal' }}>{label}</div>
  </div>
);

const ProgressBar = ({ icon, label, value, percentage }: { icon: React.ReactNode, label: string, value: string, percentage: number }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#4B5563', fontSize: 14, fontWeight: 500, fontFamily: 'Inter, sans-serif' }}>
        {icon} {label}
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#00236F', fontFamily: 'Inter, sans-serif' }}>{value}</div>
    </div>
    <div style={{ width: '100%', height: 6, borderRadius: 3, background: '#E5E7EB', position: 'relative' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${percentage}%`, background: '#4B5563', borderRadius: 3 }} />
    </div>
  </div>
);

export const Sales_Card: React.FC<SalesCardProps> = ({ onAssignTask, onPauseAccount, onViewTasks, onDelete }) => {
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        padding: 20,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 32,
        borderRadius: 12,
        background: 'var(--Foundation-neutral-white, #FFF)',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.11)',
        boxSizing: 'border-box',
      }}
    >
      {/* Top Section */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16, alignSelf: 'stretch', width: '100%' }}>
        
        {/* Header: Avatar, Name, Badge */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, alignSelf: 'stretch', width: '100%' }}>
          {/* Avatar */}
          <div style={{ width: 48, height: 48, borderRadius: 12, background: '#E2E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#00236F', fontFamily: 'Inter, sans-serif', flexShrink: 0 }}>
            JW
          </div>
          {/* Name & Role */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 4, marginTop: 2 }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: '#141414', fontFamily: 'Inter, sans-serif' }}>Ahmed Galaal</span>
            <span style={{ fontSize: 14, color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>Junior Sales Member</span>
          </div>
          {/* Badge */}
          <div style={{ padding: '4px 8px', borderRadius: 12, background: '#E6F4EA', color: '#1E8E3E', fontSize: 12, fontWeight: 700, fontFamily: 'Inter, sans-serif', marginTop: 4 }}>
            ACTIVE
          </div>
        </div>

        {/* Contact Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#4B5563', fontSize: 14, fontFamily: 'Inter, sans-serif' }}>
            <Mail size={18} /> ahmedgalaal@architectcrm.com
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#4B5563', fontSize: 14, fontFamily: 'Inter, sans-serif' }}>
            <Phone size={18} /> 01120505050
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', marginTop: 4 }}>
          <StatBox 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M6.46508 14.79L5.33008 21.41C5.30008 21.6 5.37508 21.785 5.53008 21.9C5.68508 22.01 5.89008 22.025 6.05508 21.94L12.0001 18.815L17.9451 21.94C18.0201 21.98 18.1001 21.995 18.1751 21.995C18.2801 21.995 18.3801 21.965 18.4701 21.9C18.6251 21.79 18.7001 21.6 18.6701 21.41L17.5351 14.79L22.3451 10.1C22.4801 9.965 22.5301 9.77 22.4701 9.585C22.4101 9.405 22.2551 9.27 22.0651 9.245L15.4151 8.28L12.4501 2.26C12.2801 1.92 11.7201 1.92 11.5551 2.26L8.58008 8.285L1.93008 9.25C1.74008 9.275 1.58508 9.41001 1.52508 9.59C1.46508 9.77 1.51508 9.97 1.65008 10.105L6.46508 14.79ZM8.98008 9.235C9.14508 9.21 9.28508 9.11 9.35508 8.96L12.0001 3.61L14.6401 8.96C14.7151 9.11 14.8551 9.21 15.0151 9.235L20.9201 10.095L16.6451 14.26C16.5251 14.375 16.4751 14.54 16.5001 14.705L17.5101 20.585L12.2301 17.81C12.0851 17.735 11.9101 17.735 11.7651 17.81L6.48508 20.585L7.49508 14.705C7.52508 14.545 7.47008 14.375 7.35008 14.26L3.07508 10.095L8.98008 9.235Z" fill="#464646"/>
              </svg>
            } 
            value="1st" 
            label="Rank" 
          />
          <StatBox 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H6C4.93913 15 3.92172 15.4214 3.17157 16.1716C2.42143 16.9217 2 17.9391 2 19V21" stroke="#464646" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="#464646" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 21.0009V19.0009C21.9993 18.1146 21.7044 17.2536 21.1614 16.5532C20.6184 15.8527 19.8581 15.3524 19 15.1309" stroke="#464646" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 3.13086C16.8604 3.35116 17.623 3.85156 18.1676 4.55317C18.7122 5.25478 19.0078 6.11769 19.0078 7.00586C19.0078 7.89403 18.7122 8.75694 18.1676 9.45855C17.623 10.1602 16.8604 10.6606 16 10.8809" stroke="#464646" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            } 
            value="28" 
            label="Leads" 
          />
          <StatBox 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <g clipPath="url(#clip0_2169_16354)">
                  <path d="M12.75 6.75H12C11.8011 6.75 11.6103 6.67098 11.4697 6.53033C11.329 6.38968 11.25 6.19891 11.25 6C11.25 5.90055 11.2105 5.80516 11.1402 5.73484C11.0698 5.66451 10.9745 5.625 10.875 5.625C10.7755 5.625 10.6802 5.66451 10.6098 5.73484C10.5395 5.80516 10.5 5.90055 10.5 6C10.5 6.39783 10.658 6.77936 10.9393 7.06066C11.2206 7.34197 11.6022 7.5 12 7.5V7.875C12 7.97446 12.0395 8.06984 12.1098 8.14017C12.1802 8.21049 12.2755 8.25 12.375 8.25C12.4745 8.25 12.5698 8.21049 12.6402 8.14017C12.7105 8.06984 12.75 7.97446 12.75 7.875V7.5C13.1478 7.5 13.5294 7.34197 13.8107 7.06066C14.092 6.77936 14.25 6.39783 14.25 6C14.25 5.60218 14.092 5.22065 13.8107 4.93934C13.5294 4.65804 13.1478 4.5 12.75 4.5H12C11.8011 4.5 11.6103 4.42098 11.4697 4.28033C11.329 4.13968 11.25 3.94891 11.25 3.75C11.25 3.55109 11.329 3.36032 11.4697 3.21967C11.6103 3.07902 11.8011 3 12 3H12.75C12.9489 3 13.1397 3.07902 13.2803 3.21967C13.421 3.36032 13.5 3.55109 13.5 3.75C13.5 3.84946 13.5395 3.94484 13.6098 4.01517C13.6802 4.08549 13.7755 4.125 13.875 4.125C13.9745 4.125 14.0698 4.08549 14.1402 4.01517C14.2105 3.94484 14.25 3.84946 14.25 3.75C14.25 3.35218 14.092 2.97065 13.8107 2.68934C13.5294 2.40804 13.1478 2.25 12.75 2.25V1.875C12.75 1.77555 12.7105 1.68016 12.6402 1.60984C12.5698 1.53951 12.4745 1.5 12.375 1.5C12.2755 1.5 12.1802 1.53951 12.1098 1.60984C12.0395 1.68016 12 1.77555 12 1.875V2.25C11.6022 2.25 11.2206 2.40804 10.9393 2.68934C10.658 2.97065 10.5 3.35218 10.5 3.75C10.5 4.14783 10.658 4.52936 10.9393 4.81066C11.2206 5.09197 11.6022 5.25 12 5.25H12.75C12.9489 5.25 13.1397 5.32902 13.2803 5.46967C13.421 5.61032 13.5 5.80109 13.5 6C13.5 6.19891 13.421 6.38968 13.2803 6.53033C13.1397 6.67098 12.9489 6.75 12.75 6.75ZM12.375 9.75C13.3392 9.75 14.2817 9.46409 15.0834 8.92842C15.8851 8.39275 16.5099 7.63137 16.8789 6.74058C17.2479 5.84979 17.3444 4.86959 17.1563 3.92394C16.9682 2.97828 16.5039 2.10964 15.8221 1.42786C15.1404 0.746076 14.2717 0.281777 13.3261 0.093674C12.3804 -0.094429 11.4002 0.00211226 10.5094 0.371089C9.61863 0.740067 8.85726 1.36491 8.32159 2.1666C7.78591 2.96829 7.5 3.91082 7.5 4.875C7.50159 6.16745 8.01571 7.4065 8.92961 8.32039C9.8435 9.23429 11.0826 9.74841 12.375 9.75ZM12.375 0.750002C13.1908 0.750002 13.9884 0.991929 14.6667 1.44519C15.3451 1.89845 15.8738 2.54269 16.186 3.29643C16.4982 4.05018 16.5799 4.87958 16.4207 5.67975C16.2616 6.47992 15.8687 7.21493 15.2918 7.79182C14.7149 8.36871 13.9799 8.76158 13.1797 8.92074C12.3796 9.07991 11.5502 8.99822 10.7964 8.686C10.0427 8.37379 9.39845 7.84508 8.94519 7.16673C8.49193 6.48838 8.25 5.69085 8.25 4.875C8.25119 3.78135 8.68617 2.73283 9.4595 1.9595C10.2328 1.18617 11.2813 0.751193 12.375 0.750002ZM23.625 11.1H20.625C20.3712 11.1005 20.1251 11.1869 19.9266 11.3449C19.7281 11.503 19.5889 11.7236 19.5315 11.9708L15.3143 10.6763C14.7706 10.5105 14.1879 10.5247 13.653 10.7168L13.0253 10.9418L10.083 10.296C9.46152 10.1593 8.81403 10.2014 8.2155 10.4175L4.41225 11.7885C4.32632 11.5844 4.18206 11.4102 3.99754 11.2877C3.81303 11.1652 3.59647 11.0999 3.375 11.1H0.375C0.275544 11.1 0.180161 11.1395 0.109835 11.2098C0.0395088 11.2802 0 11.3755 0 11.475L0 18.975C0 19.0745 0.0395088 19.1698 0.109835 19.2402C0.180161 19.3105 0.275544 19.35 0.375 19.35H3.375C3.56014 19.3498 3.74237 19.3039 3.90551 19.2164C4.06866 19.1288 4.20768 19.0024 4.31025 18.8483C5.69744 20.6071 7.45981 22.0341 9.46875 23.025L11.0872 23.8215C11.3332 23.9437 11.6069 23.9989 11.881 23.9817C12.155 23.9644 12.4197 23.8753 12.6483 23.7232C12.877 23.5711 13.0615 23.3615 13.1834 23.1154C13.3052 22.8694 13.3601 22.5955 13.3425 22.3215C13.4441 22.3477 13.5482 22.3631 13.653 22.3673C13.7558 22.3671 13.8583 22.3566 13.959 22.3358C14.2874 22.269 14.5836 22.0935 14.7998 21.8374C15.0159 21.5814 15.1393 21.2599 15.15 20.925C15.3632 21.0449 15.6029 21.1101 15.8475 21.1148C15.9501 21.1146 16.0523 21.104 16.1528 21.0833C16.5024 21.0123 16.8149 20.8182 17.0336 20.5363C17.2523 20.2545 17.3626 19.9035 17.3445 19.5473C17.6348 19.6196 17.9407 19.597 18.2172 19.4828C18.4938 19.3686 18.7265 19.1688 18.8812 18.9128C18.9939 18.7426 19.0705 18.5512 19.1063 18.3503H19.5128C19.5434 18.6242 19.6737 18.8774 19.8787 19.0617C20.0837 19.246 20.3493 19.3486 20.625 19.35H23.625C23.7245 19.35 23.8198 19.3105 23.8902 19.2402C23.9605 19.1698 24 19.0745 24 18.975V11.475C24 11.3755 23.9605 11.2802 23.8902 11.2098C23.8198 11.1395 23.7245 11.1 23.625 11.1ZM3.75 18.225C3.75 18.3245 3.71049 18.4198 3.64016 18.4902C3.56984 18.5605 3.47446 18.6 3.375 18.6H0.75V11.85H3.375C3.47446 11.85 3.56984 11.8895 3.64016 11.9598C3.71049 12.0302 3.75 12.1255 3.75 12.225V18.225ZM18.2557 18.5033C18.2016 18.5855 18.1318 18.6564 18.0503 18.7117C17.9688 18.767 17.8773 18.8057 17.7808 18.8256C17.6843 18.8456 17.5849 18.8463 17.4882 18.8278C17.3914 18.8093 17.2993 18.7719 17.217 18.7178L13.7347 16.425L13.5743 16.6688C13.5497 16.6853 13.5286 16.7065 13.5123 16.7313C13.4959 16.756 13.4846 16.7837 13.479 16.8128L13.3223 17.0513L13.6095 17.2403C13.6132 17.2403 13.6155 17.247 13.6193 17.25L16.263 18.9915C16.4255 19.1024 16.5379 19.2728 16.576 19.4658C16.614 19.6589 16.5747 19.8592 16.4664 20.0235C16.3582 20.1878 16.1897 20.303 15.9974 20.3442C15.805 20.3855 15.6041 20.3495 15.438 20.244L14.4915 19.6208L14.481 19.6125L12.18 18.0975H12.174L11.9557 17.9535C11.8727 17.9008 11.7723 17.8828 11.6761 17.9034C11.5799 17.924 11.4956 17.9816 11.4415 18.0638C11.3874 18.1459 11.3677 18.2461 11.3868 18.3426C11.4058 18.4391 11.462 18.5243 11.5433 18.5798L14.073 20.2455C14.1948 20.3281 14.2896 20.4446 14.3456 20.5806C14.4016 20.7167 14.4164 20.8662 14.3881 21.0105C14.3598 21.1549 14.2897 21.2878 14.1864 21.3926C14.0832 21.4974 13.9514 21.5695 13.8075 21.6C13.6128 21.6398 13.4102 21.6007 13.2443 21.4913L10.7048 19.8188C10.6636 19.7907 10.6174 19.7711 10.5686 19.7611C10.5199 19.7511 10.4696 19.7509 10.4208 19.7605C10.3719 19.7702 10.3255 19.7894 10.2842 19.8172C10.2429 19.8449 10.2075 19.8806 10.1801 19.9222C10.1528 19.9637 10.1339 20.0103 10.1247 20.0593C10.1156 20.1082 10.1162 20.1584 10.1266 20.2071C10.1371 20.2557 10.1571 20.3018 10.1855 20.3427C10.214 20.3835 10.2502 20.4183 10.2922 20.445L10.4242 20.532C10.428 20.532 10.4303 20.5395 10.4347 20.5425L12.2347 21.7268C12.4187 21.8371 12.5521 22.0151 12.6064 22.2226C12.6607 22.4301 12.6316 22.6506 12.5253 22.837C12.419 23.0233 12.244 23.1606 12.0377 23.2194C11.8315 23.2782 11.6103 23.254 11.4218 23.1518L9.7995 22.35C7.68963 21.3089 5.86931 19.7632 4.5 17.85V12.5535L8.469 11.124C8.93472 10.9565 9.43825 10.9237 9.92175 11.0295L11.7015 11.4203L10.4145 11.8845C10.0192 12.0199 9.69379 12.3067 9.50995 12.682C9.32612 13.0572 9.29889 13.4902 9.43425 13.8855C9.56961 14.2808 9.85647 14.6062 10.2317 14.79C10.607 14.9739 11.0399 15.0011 11.4352 14.8658L13.218 14.2875L18.042 17.4638C18.1313 17.5227 18.2069 17.6 18.2638 17.6905C18.3207 17.7811 18.3576 17.8828 18.372 17.9888C18.3726 18.0071 18.3744 18.0254 18.3773 18.0435C18.3879 18.2057 18.3452 18.3676 18.2557 18.5033ZM19.5 17.6025H19.05C18.943 17.2883 18.7339 17.019 18.456 16.8375L13.482 13.5615C13.4351 13.5306 13.3818 13.5107 13.3261 13.5031C13.2704 13.4956 13.2137 13.5007 13.1603 13.518L11.2057 14.1525C11.054 14.2019 10.8912 14.2062 10.737 14.165C10.5829 14.1237 10.444 14.0386 10.3372 13.92C10.2464 13.8195 10.1816 13.6982 10.1488 13.5667C10.1159 13.4352 10.116 13.2977 10.1489 13.1663C10.1818 13.0348 10.2466 12.9135 10.3375 12.813C10.4284 12.7126 10.5427 12.6361 10.6702 12.5903L13.9095 11.4218C14.2916 11.2845 14.7078 11.2745 15.096 11.3933L19.5 12.7463V17.6025ZM23.25 18.6H20.625C20.5255 18.6 20.4302 18.5605 20.3598 18.4902C20.2895 18.4198 20.25 18.3245 20.25 18.225V12.225C20.25 12.1255 20.2895 12.0302 20.3598 11.9598C20.4302 11.8895 20.5255 11.85 20.625 11.85H23.25V18.6Z" fill="#464646"/>
                </g>
                <defs>
                  <clipPath id="clip0_2169_16354">
                    <rect width="24" height="24" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            } 
            value="7" 
            label="Deals" 
          />
          <StatBox 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V7L15 2Z" stroke="#464646" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 2V6C14 6.53043 14.2107 7.03914 14.5858 7.41421C14.9609 7.78929 15.4696 8 16 8H20" stroke="#464646" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 9H8" stroke="#464646" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 13H8" stroke="#464646" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 17H8" stroke="#464646" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            } 
            value="10" 
            label="Reports" 
          />
        </div>

        {/* Progress Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', marginTop: 8 }}>
          <ProgressBar label="Conv. Rate" value="82%" icon={<TrendingUp size={16} />} percentage={82} />
          <ProgressBar label="Monthly Target" value="91%" icon={<BarChart2 size={16} />} percentage={91} />
        </div>
      </div>

      {/* Actions Row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, alignSelf: 'stretch' }}>
        <button 
          onClick={onDelete}
          style={{ width: 48, height: 48, borderRadius: 12, border: 'none', padding: 12, background: '#FDF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, aspectRatio: '1/1' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ width: 24, height: 24, flexShrink: 0 }}>
            <path d="M4 6.17647H20M10 16.7647V10.4118M14 16.7647V10.4118M16 21H8C6.89543 21 6 20.0519 6 18.8824V7.23529C6 6.65052 6.44772 6.17647 7 6.17647H17C17.5523 6.17647 18 6.65052 18 7.23529V18.8824C18 20.0519 17.1046 21 16 21ZM10 6.17647H14C14.5523 6.17647 15 5.70242 15 5.11765V4.05882C15 3.47405 14.5523 3 14 3H10C9.44772 3 9 3.47405 9 4.05882V5.11765C9 5.70242 9.44772 6.17647 10 6.17647Z" stroke="#A80D0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button 
          onClick={onPauseAccount}
          style={{ width: 48, height: 48, borderRadius: 12, border: '1px solid var(--Foundation-neutral-neutral-100, #D4D5D8)', padding: 12, background: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, aspectRatio: '1/1' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ width: 18, height: 18, flexShrink: 0 }}>
            <path d="M15.625 1H4.375C2.51104 1 1 2.51104 1 4.375V15.625C1 17.489 2.51104 19 4.375 19H15.625C17.489 19 19 17.489 19 15.625V4.375C19 2.51104 17.489 1 15.625 1Z" stroke="#A80D0B" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M6.625 7.89062C6.625 7.19164 7.19164 6.625 7.89062 6.625H12.1094C12.8084 6.625 13.375 7.19164 13.375 7.89062V12.1094C13.375 12.8084 12.8084 13.375 12.1094 13.375H7.89062C7.19164 13.375 6.625 12.8084 6.625 12.1094V7.89062Z" stroke="#A80D0B" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
        </button>
        <button 
          onClick={onViewTasks}
          style={{ width: 48, height: 48, borderRadius: 12, border: '1px solid var(--Foundation-neutral-neutral-100, #D4D5D8)', padding: 12, background: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, aspectRatio: '1/1' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ width: 22, height: 22, flexShrink: 0 }}>
            <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="#141414" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 2V8H20" stroke="#141414" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 8H10" stroke="#141414" strokeWidth="2" strokeLinecap="round"/>
            <path d="M8 12H14" stroke="#141414" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="15" cy="16" r="2.5" stroke="#141414" strokeWidth="2"/>
            <path d="M17 18L19.5 20.5" stroke="#141414" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <button 
          onClick={onAssignTask}
          style={{ flex: "1 0 0", height: 48, borderRadius: 12, background: 'var(--Foundation-brand-brand-500, #00236F)', color: '#FFF', fontSize: 14, fontWeight: 600, fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '8px 24px', cursor: 'pointer', border: 'none' }}
        >
          <Plus size={18} /> Assign Task
        </button>
      </div>
    </div>
  );
};
