import React from 'react';
import { useNavigate } from 'react-router';
import { usePremium } from '../../contexts/PremiumContext';
import { useSeason } from '../../contexts/SeasonContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Crown, Lock, ArrowRight, Zap } from '../ui/icons';
import { motion } from 'motion/react';

/* ─── Premium Badge (inline indicator) ─── */
export const PremiumBadge = ({ size = 'sm' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const { theme } = useSeason();
  const sizeMap = { sm: 'text-[7px] px-1.5 py-0.5 gap-1', md: 'text-[8px] px-2 py-1 gap-1.5', lg: 'text-[9px] px-3 py-1.5 gap-2' };
  const iconSize = { sm: 'w-2.5 h-2.5', md: 'w-3 h-3', lg: 'w-3.5 h-3.5' };

  return (
    <span
      className={`inline-flex items-center font-black uppercase tracking-[0.2em] ${sizeMap[size]}`}
      style={{ backgroundColor: '#D4AF37', color: '#1a1a1a' }}
    >
      <Crown className={iconSize[size]} />
      NOMAD
    </span>
  );
};

/* ─── Premium Gate (blocks content) ─── */
interface PremiumGateProps {
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  compact?: boolean;
}

export const PremiumGate = ({ feature, children, fallback, compact = false }: PremiumGateProps) => {
  // All features are now free — no gating
  return <>{children}</>;
};

/* ─── AI Message Limit Banner ─── */
export const AILimitBanner = () => {
  // All features are now free — no limit banner
  return null;
};