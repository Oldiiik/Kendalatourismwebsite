import React from 'react';
import { motion } from 'motion/react';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

// Snappy expo-out easing — fast attack, smooth settle
const SNAP = [0.16, 1, 0.3, 1] as const;

const variants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
      staggerChildren: 0.02,
      delayChildren: 0.01,
    }
  },
};

const childVariants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.15,
      ease: 'easeOut',
    }
  },
};

export const PageTransition = ({ children, className = '' }: PageTransitionProps) => {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="enter"
      className={`w-full min-h-screen ${className}`}
    >
      {children}
    </motion.div>
  );
};

// Wrap individual sections for staggered entrance
export const PageSection = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  return (
    <motion.div variants={childVariants} className={className}>
      {children}
    </motion.div>
  );
};