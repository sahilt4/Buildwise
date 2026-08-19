import React from 'react';

export const ProgressBar = ({
  progress = 0,
  variant = 'warning', // 'warning' | 'success' | 'danger' | 'info'
  thickness = 'default', // 'thin' | 'default' | 'thick'
  showLabel = false,
  labelPrefix = '',
  className = ''
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  // Determine auto variant if not explicitly forced
  let colorVariant = variant;
  if (variant === 'auto') {
    if (clampedProgress >= 80) colorVariant = 'danger';
    else if (clampedProgress >= 50) colorVariant = 'warning';
    else colorVariant = 'success';
  }

  return (
    <div className={`progress-container ${className}`}>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.35rem', fontWeight: 600, color: 'var(--text-muted)' }}>
          <span>{labelPrefix}</span>
          <span style={{ color: 'var(--text-primary)' }}>{clampedProgress}%</span>
        </div>
      )}
      <div className={`progress-track ${thickness}`}>
        <div
          className={`progress-fill ${colorVariant}`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};
