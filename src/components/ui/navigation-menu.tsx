import * as React from "react";
import { ChevronDownIcon } from "./icons";

import { cn } from "./utils";

const NavigationMenuContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
}>({
  value: "",
  onValueChange: () => {},
});

function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}: React.ComponentProps<"nav"> & {
  viewport?: boolean;
}) {
  const [value, setValue] = React.useState("");

  return (
    <NavigationMenuContext.Provider
      value={{ value, onValueChange: setValue }}
    >
      <nav
        className={cn(
          "relative z-10 flex max-w-max flex-1 items-center justify-center",
          className
        )}
        {...props}
      >
        {children}
        {/* Viewport is not really used in this simplified version but we keep the prop API */}
      </nav>
    </NavigationMenuContext.Provider>
  );
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      className={cn(
        "group flex flex-1 list-none items-center justify-center gap-1",
        className
      )}
      {...props}
    />
  );
}

const NavigationMenuItemContext = React.createContext<{
  value: string;
}>({
  value: "",
});

function NavigationMenuItem({
  className,
  children,
  ...props
}: React.ComponentProps<"li">) {
  // Generate a unique ID for this item if one isn't provided
  const id = React.useId();

  return (
    <NavigationMenuItemContext.Provider value={{ value: id }}>
      <li className={cn("relative", className)} {...props}>
        {children}
      </li>
    </NavigationMenuItemContext.Provider>
  );
}

const navigationMenuTriggerStyle = () => {
  return "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 outline-none transition-colors";
};

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<"button">) {
  const { value, onValueChange } = React.useContext(NavigationMenuContext);
  const { value: itemValue } = React.useContext(NavigationMenuItemContext);
  const isOpen = value === itemValue;

  return (
    <button
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      onClick={() => onValueChange(isOpen ? "" : itemValue)}
      data-state={isOpen ? "open" : "closed"}
      {...props}
    >
      {children}{" "}
      <ChevronDownIcon
        className={cn(
          "relative top-[1px] ml-1 size-3 transition duration-200",
          isOpen && "rotate-180"
        )}
        aria-hidden="true"
      />
    </button>
  );
}

function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { value } = React.useContext(NavigationMenuContext);
  const { value: itemValue } = React.useContext(NavigationMenuItemContext);
  const isOpen = value === itemValue;

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "absolute left-0 top-full w-[200px] p-2 mt-1.5 rounded-md border bg-popover text-popover-foreground shadow-lg animate-in fade-in-0 zoom-in-95",
        "md:w-auto", // Responsive width adjustment
        className
      )}
      {...props}
    />
  );
}

function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<"a">) {
  return (
    <a
      className={cn(
        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        className
      )}
      {...props}
    />
  );
}

function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return null;
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return null;
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
};
