"use client";

import * as React from "react";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "./icons";
import { cn } from "./utils";

const ContextMenuContext = React.createContext<{
  open: boolean;
  position: { x: number; y: number };
  onOpenChange: (open: boolean, pos?: { x: number; y: number }) => void;
}>({
  open: false,
  position: { x: 0, y: 0 },
  onOpenChange: () => {},
});

function ContextMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  const onOpenChange = (newOpen: boolean, newPos?: { x: number; y: number }) => {
    setOpen(newOpen);
    if (newPos) setPosition(newPos);
  };

  // Close on global click
  React.useEffect(() => {
    if (!open) return;
    const handleClick = () => setOpen(false);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [open]);

  return (
    <ContextMenuContext.Provider value={{ open, position, onOpenChange }}>
      {children}
    </ContextMenuContext.Provider>
  );
}

function ContextMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { onOpenChange } = React.useContext(ContextMenuContext);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onOpenChange(true, { x: e.clientX, y: e.clientY });
  };

  return (
    <div
      className={className}
      onContextMenu={handleContextMenu}
      {...props}
    >
      {children}
    </div>
  );
}

function ContextMenuContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { open, position } = React.useContext(ContextMenuContext);

  if (!open) return null;

  return (
    <div
      className={cn(
        "fixed z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80",
        className
      )}
      style={{
        left: position.x,
        top: position.y,
      }}
      {...props}
    />
  );
}

function ContextMenuItem({
  className,
  inset,
  ...props
}: React.ComponentProps<"div"> & { inset?: boolean }) {
  return (
    <div
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        inset && "pl-8",
        className
      )}
      {...props}
    />
  );
}

function ContextMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<"div"> & { checked?: boolean }) {
  return (
    <div
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {checked && <CheckIcon className="h-4 w-4" />}
      </span>
      {children}
    </div>
  );
}

function ContextMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <CircleIcon className="h-2 w-2 fill-current" />
      </span>
      {children}
    </div>
  );
}

function ContextMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<"div"> & { inset?: boolean }) {
  return (
    <div
      className={cn(
        "px-2 py-1.5 text-sm font-semibold text-foreground",
        inset && "pl-8",
        className
      )}
      {...props}
    />
  );
}

function ContextMenuSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />
  );
}

function ContextMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

function ContextMenuGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("", className)} {...props} />;
}

function ContextMenuPortal({ children }: any) {
  return <>{children}</>;
}

function ContextMenuSub({ children }: any) {
  return <>{children}</>;
}

function ContextMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<"div"> & { inset?: boolean }) {
  return (
    <div
      className={cn(
        "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
        inset && "pl-8",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto h-4 w-4" />
    </div>
  );
}

function ContextMenuSubContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  // Simplification: Sub-menus are hard to position without a library.
  // We'll just hide them or render them inline for now if this is a strict requirement?
  // Or maybe just absolute position them to the right.
  return (
    <div
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80",
        // Dummy positioning for subcontent
        "absolute left-full top-0 ml-1",
        className
      )}
      {...props}
    />
  );
}

function ContextMenuRadioGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("", className)} {...props} />;
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
};
