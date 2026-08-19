import React from 'react';

export const Avatar = ({
  src,
  name = 'User',
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  status, // 'active' | 'away' | 'offline'
  className = ''
}) => {
  const getInitials = (n) => {
    if (!n) return 'U';
    const parts = n.split(' ');
    return parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : n.substring(0, 2).toUpperCase();
  };

  return (
    <div className={`avatar avatar-${size} ${className}`} title={name}>
      {src ? (
        <img src={src} alt={name} onError={(e) => { e.target.style.display = 'none'; }} />
      ) : (
        <span>{getInitials(name)}</span>
      )}
      {status && <span className={`avatar-status-dot ${status}`} />}
    </div>
  );
};
