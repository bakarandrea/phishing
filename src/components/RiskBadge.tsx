import React from 'react';
import { RiskLevel } from '../types';

interface RiskBadgeProps {
  level: RiskLevel;
}

export default function RiskBadge({ level }: RiskBadgeProps) {
  const styles = {
    High: 'bg-red-50 text-red-700 border-red-200 shadow-sm',
    Medium: 'bg-amber-50 text-amber-700 border-amber-200 shadow-sm',
    Low: 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm',
    Safe: 'bg-green-50 text-green-700 border-green-200 shadow-sm',
  };

  return (
    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black border uppercase tracking-widest ${styles[level] || styles.Safe}`}>
      {level}
    </span>
  );
}
