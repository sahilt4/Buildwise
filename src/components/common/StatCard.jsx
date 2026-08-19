import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export const StatCard = ({
  label,
  value,
  trend,
  trendDirection = 'up', // 'up' | 'down' | 'neutral'
  trendPositive = true,
  icon: Icon,
  iconTheme = 'amber', // 'amber' | 'blue' | 'green' | 'purple'
  subtitle,
  onClick
}) => {
  return (
    <div className={`stat-card ${onClick ? 'bw-card--interactive' : ''}`} onClick={onClick}>
      <div className="stat-card-header">
        <span className="stat-card-label">{label}</span>
        {Icon && (
          <div className={`stat-card-icon ${iconTheme}`}>
            <Icon size={18} />
          </div>
        )}
      </div>

      <div className="stat-card-value">{value}</div>

      {(trend || subtitle) && (
        <div className="stat-card-trend">
          {trend && (
            <span
              className={`trend-pill ${
                trendDirection === 'neutral'
                  ? 'neutral'
                  : trendPositive
                  ? 'positive'
                  : 'negative'
              }`}
            >
              {trendDirection === 'up' && <ArrowUpRight size={12} />}
              {trendDirection === 'down' && <ArrowDownRight size={12} />}
              {trendDirection === 'neutral' && <Minus size={12} />}
              {trend}
            </span>
          )}
          {subtitle && <span>{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
