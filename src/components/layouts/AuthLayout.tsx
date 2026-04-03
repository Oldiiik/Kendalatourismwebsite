import React from 'react';
import { Outlet, Navigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { useSeason } from '../../contexts/SeasonContext';
import { motion } from 'motion/react';

export const AuthLayout = () => {
  const { user, authChecked, isGuest } = useAuth();
  const { theme } = useSeason();

  if (!authChecked) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center"
        style={{ backgroundColor: theme?.background || '#1C1E26' }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <div className="w-10 h-[2px] mx-auto mb-4 overflow-hidden rounded-full" style={{ backgroundColor: `${theme?.text || '#E0E2E8'}15` }}>
            <motion.div
              className="w-full h-full"
              style={{ backgroundColor: theme?.primary || '#00B4D8' }}
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
          <p
            className="text-[10px] uppercase tracking-[0.3em] font-medium"
            style={{ color: `${theme?.text || '#E0E2E8'}50` }}
          >
            Authenticating...
          </p>
        </motion.div>
      </div>
    );
  }

  if (!user && !isGuest) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};