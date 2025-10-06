import React from 'react';

const iconProps = {
  className: "w-6 h-6",
  strokeWidth: "1.5",
  stroke: "currentColor",
  fill: "none",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const DashboardIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className || iconProps.className} viewBox="0 0 24 24">
    <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
  </svg>
);

export const InventoryIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className || iconProps.className} viewBox="0 0 24 24">
    <path d="M21 8V4H3v4M3 8v12h18V8M12 12v4" />
    <path d="M3.5 8L6 12l2.5-4" />
    <path d="M20.5 8L18 12l-2.5-4" />
  </svg>
);

export const OrderIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className || iconProps.className} viewBox="0 0 24 24">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
  </svg>
);

export const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className || iconProps.className} viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
  </svg>
);

export const SettingsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className || iconProps.className} viewBox="0 0 24 24">
    <path d="M19.14 12.94a2 2 0 0 0 0-1.88l-1.42-1.42a2 2 0 0 1-.59-1.41v-2a2 2 0 0 0-2-2h-2a2 2 0 0 1-1.41-.59l-1.42-1.42a2 2 0 0 0-1.88 0l-1.42 1.42A2 2 0 0 1 6.1 4.1H4.1a2 2 0 0 0-2 2v2a2 2 0 0 1-.59 1.41l-1.42 1.42a2 2 0 0 0 0 1.88l1.42 1.42a2 2 0 0 1 .59 1.41v2a2 2 0 0 0 2 2h2a2 2 0 0 1 1.41.59l1.42 1.42a2 2 0 0 0 1.88 0l1.42-1.42a2 2 0 0 1 1.41-.59h2a2 2 0 0 0 2-2v-2a2 2 0 0 1 .59-1.41z" />
    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
  </svg>
);

export const LogoutIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className || iconProps.className} viewBox="0 0 24 24">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />
  </svg>
);

export const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className || iconProps.className} viewBox="0 0 24 24">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="M17 8l-5-5-5 5M12 3v12" />
  </svg>
);

export const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className || iconProps.className} viewBox="0 0 24 24">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
);

export const ChatIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className || iconProps.className} viewBox="0 0 24 24">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

export const PlugIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className || iconProps.className} viewBox="0 0 24 24">
    <path d="M12 22v-5M9 17H7.5a4.5 4.5 0 1 1 0-9H9m6 9h1.5a4.5 4.5 0 1 0 0-9H15M2 9.5a4.5 4.5 0 0 0 4.5 4.5H9V5H6.5A4.5 4.5 0 0 0 2 9.5zM22 9.5a4.5 4.5 0 0 1-4.5 4.5H15V5h1.5A4.5 4.5 0 0 1 22 9.5z" />
  </svg>
);

export const FileTextIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className || iconProps.className} viewBox="0 0 24 24">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
  </svg>
);

export const YoutubeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className || iconProps.className} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M21.58 7.19c-.23-.86-.9-1.52-1.76-1.76C18.25 5 12 5 12 5s-6.25 0-7.82.43c-.86.23-1.52.9-1.76 1.76C2 8.75 2 12 2 12s0 3.25.43 4.81c.23.86.9 1.52 1.76 1.76C5.75 19 12 19 12 19s6.25 0 7.82-.43c.86-.23-1.52.9-1.76 1.76C22 15.25 22 12 22 12s0-3.25-.42-4.81zM9.5 15.5V8.5l6 3.5-6 3.5z"/>
  </svg>
);

export const MessageSquareIcon: React.FC<{ className?: string, stroke?: string }> = ({ className, stroke }) => (
    <svg {...iconProps} className={className || iconProps.className} stroke={stroke || iconProps.stroke} viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
);

export const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className || iconProps.className} viewBox="0 0 24 24">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

export const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className || iconProps.className} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

export const BotIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className || iconProps.className} viewBox="0 0 24 24">
    <rect x="3" y="11" width="18" height="10" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    <line x1="8" y1="16" x2="8.01" y2="16"></line>
    <line x1="16" y1="16" x2="16.01" y2="16"></line>
  </svg>
);
