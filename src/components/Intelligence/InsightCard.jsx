import React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  TrendingUp,
  PiggyBank,
  PieChart,
  Repeat,
  Target,
  CheckCircle2,
  Calendar,
  Coins,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Tag
} from 'lucide-react';

const ICON_MAP = {
  ShieldAlert,
  AlertTriangle,
  TrendingUp,
  PiggyBank,
  PieChart,
  Repeat,
  Target,
  CheckCircle2,
  Calendar,
  Coins,
  Sparkles
};

const PRIORITY_THEMES = {
  high: {
    badgeClass: 'high',
    badgeText: 'Action Required',
    iconColor: '#dc2626',
    iconBg: '#fee2e2'
  },
  medium: {
    badgeClass: 'medium',
    badgeText: 'Notice',
    iconColor: '#d97706',
    iconBg: '#fffbeb'
  },
  positive: {
    badgeClass: 'positive',
    badgeText: 'Positive Trend',
    iconColor: '#059669',
    iconBg: '#ecfdf5'
  },
  neutral: {
    badgeClass: 'neutral',
    badgeText: 'Insight',
    iconColor: '#475569',
    iconBg: '#f1f5f9'
  }
};

export function InsightCard({ insight }) {
  if (!insight) return null;

  const {
    title,
    description,
    priority = 'neutral',
    value,
    comparison,
    category,
    icon
  } = insight;

  const theme = PRIORITY_THEMES[priority] || PRIORITY_THEMES.neutral;
  const IconComponent = (icon && ICON_MAP[icon]) || Tag;

  return (
    <div className="insight-card">
      <div>
        <div className="insight-card-top">
          <div
            className="insight-icon-box"
            style={{ backgroundColor: theme.iconBg, color: theme.iconColor }}
          >
            <IconComponent size={20} strokeWidth={2.2} />
          </div>

          <span className={`insight-priority-badge ${theme.badgeClass}`}>
            {theme.badgeText}
          </span>
        </div>

        <div style={{ marginTop: '0.65rem' }}>
          <h4 className="insight-card-title">{title}</h4>
          <p className="insight-card-desc">{description}</p>
        </div>
      </div>

      <div className="insight-card-bottom">
        <span className="insight-val-pill">{value}</span>
        <span className="insight-comp-pill">{comparison || category}</span>
      </div>
    </div>
  );
}
