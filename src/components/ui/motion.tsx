import React from "react";

// Simplified motion replacement that renders standard HTML elements
// and safely strips Framer Motion props to avoid DOM warnings.
// This removes any potential complex runtime evaluation.

const safeProps = (props: any) => {
  const {
    initial,
    animate,
    exit,
    transition,
    variants,
    whileHover,
    whileTap,
    viewport,
    whileInView,
    onPan,
    layout,
    layoutId,
    ...validProps
  } = props;
  return validProps;
};

// Create a proxy to handle any motion.tagname access dynamically but safely
export const motion = new Proxy({}, {
  get: (_, tag: string) => {
    return React.forwardRef((props: any, ref) => {
      // @ts-ignore
      const Component = tag;
      return <Component ref={ref} {...safeProps(props)} />;
    });
  }
}) as any;

export const AnimatePresence = ({ children }: { children: React.ReactNode }) => <>{children}</>;
