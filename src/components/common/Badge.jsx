import React from 'react';

export const Badge = ({
  children,
  variant = 'neutral', // success, warning, danger, info, neutral, purple
  dot = true,
  className = ''
}) => {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {dot && <span className="badge-dot" />}
      {children}
    </span>
  );
};
