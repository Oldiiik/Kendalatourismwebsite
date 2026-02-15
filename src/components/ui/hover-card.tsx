"use client";

import * as React from "react";
import { cn } from "./utils";

const HoverCardContext = React.createContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  openDelay: number;
  closeDelay: number;
}>({
  open: false,
  onOpenChange: () => {},
  openDelay: 700,
  closeDelay: 300,
});

interface HoverCardProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  openDelay?: number;
  closeDelay?: number;
}

function HoverCard({
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  defaultOpen = false,
  openDelay = 700,
  closeDelay = 300,
}: HoverCardProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);

  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
  const onOpenChange =
    controlledOnOpenChange !== undefined
      ? controlledOnOpenChange
      : setUncontrolledOpen;

  return (
    <HoverCardContext.Provider
      value={{ open, onOpenChange, openDelay, closeDelay }}
    >
      <div className="relative inline-block group">{children}</div>
    </HoverCardContext.Provider>
  );
}

function HoverCardTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<"a">) {
  const { onOpenChange, openDelay, closeDelay } =
    React.useContext(HoverCardContext);
  const openTimeoutRef = React.useRef<NodeJS.Timeout>();
  const closeTimeoutRef = React.useRef<NodeJS.Timeout>();

  const handleMouseEnter = () => {
    clearTimeout(closeTimeoutRef.current);
    openTimeoutRef.current = setTimeout(() => {
      onOpenChange(true);
    }, openDelay);
  };

  const handleMouseLeave = () => {
    clearTimeout(openTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      onOpenChange(false);
    }, closeDelay);
  };

  return (
    <a
      className={cn("inline-block cursor-pointer", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </a>
  );
}

function HoverCardContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: React.ComponentProps<"div"> & {
  align?: "start" | "center" | "end";
  sideOffset?: number;
}) {
  const { open } = React.useContext(HoverCardContext);

  if (!open) return null;

  return (
    <div
      className={cn(
        "absolute z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95",
        // Simple positioning logic
        "top-full mt-2", // Default to bottom
        align === "center" && "left-1/2 -translate-x-1/2",
        align === "start" && "left-0",
        align === "end" && "right-0",
        className
      )}
      {...props}
    />
  );
}

export { HoverCard, HoverCardTrigger, HoverCardContent };
