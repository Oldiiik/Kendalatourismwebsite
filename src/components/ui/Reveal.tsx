import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation, Variant } from 'motion/react';

const SNAP = [0.16, 1, 0.3, 1] as const;

interface RevealProps {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
  delay?: number;
  duration?: number;
  yOffset?: number;
  className?: string;
}

export const Reveal = ({ 
  children, 
  width = "fit-content", 
  delay = 0.06, 
  duration = 0.35,
  yOffset = 24,
  className = ""
}: RevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView, mainControls]);

  return (
    <div ref={ref} style={{ position: "relative", width, overflow: "hidden" }} className={className}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: yOffset },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration, delay, ease: SNAP }}
        style={{ willChange: 'opacity, transform' }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export const FadeIn = ({ 
    children, 
    delay = 0, 
    duration = 0.35, 
    className = "" 
}: { children: React.ReactNode, delay?: number, duration?: number, className?: string }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration, delay, ease: SNAP }}
            className={className}
            style={{ willChange: 'opacity, transform' }}
        >
            {children}
        </motion.div>
    )
}

export const ScaleIn = ({
    children,
    delay = 0,
    className = ""
}: { children: React.ReactNode, delay?: number, className?: string }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.3, delay, ease: SNAP }}
            className={className}
            style={{ willChange: 'opacity, transform' }}
        >
            {children}
        </motion.div>
    )
}
