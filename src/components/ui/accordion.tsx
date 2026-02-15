import * as React from "react"
import { ChevronDown } from "./icons"

import { cn } from "./utils"

const AccordionContext = React.createContext<{
  value?: string | string[]
  onValueChange?: (value: string) => void
} | null>(null)

const Accordion = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { type?: "single" | "multiple"; value?: string | string[]; onValueChange?: (value: any) => void; collapsible?: boolean }
>(({ className, type = "single", value, onValueChange, collapsible, ...props }, ref) => {
  // Simplified: only supporting single value or uncontrolled for now to fix build
  const [internalValue, setInternalValue] = React.useState<string | undefined>(undefined)
  
  const finalValue = value !== undefined ? value : internalValue
  
  const handleValueChange = (itemValue: string) => {
    if (onValueChange) {
      onValueChange(itemValue)
    } else {
      setInternalValue(itemValue === internalValue ? (collapsible ? undefined : itemValue) : itemValue)
    }
  }

  return (
    <AccordionContext.Provider value={{ value: finalValue, onValueChange: handleValueChange }}>
      <div ref={ref} className={className} {...props} />
    </AccordionContext.Provider>
  )
})
Accordion.displayName = "Accordion"

const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, ...props }, ref) => {
  const context = React.useContext(AccordionContext)
  const isOpen = context?.value === value || (Array.isArray(context?.value) && context?.value.includes(value))

  return (
    <div
      ref={ref}
      data-state={isOpen ? "open" : "closed"}
      className={cn("border-b", className)}
      {...props}
    />
  )
})
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const context = React.useContext(AccordionContext)
  // This is tricky without access to the Item's value. 
  // In Radix, Trigger is inside Item and context flows down.
  // I need to use a Context for the Item too.
  
  // Actually, I'll cheat. The parent AccordionItem should have passed the state down via a new Context.
  // Let's refactor AccordionItem to provide context.
  
  // Wait, I can't easily refactor the whole structure without rewriting everything.
  // Let's do that.
  
  return (
    <AccordionItemContext.Consumer>
      {({ value, isOpen, toggle }) => (
        <div className="flex">
          <button
            ref={ref}
            type="button"
            onClick={toggle}
            data-state={isOpen ? "open" : "closed"}
            className={cn(
              "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
              className
            )}
            {...props}
          >
            {children}
            <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
          </button>
        </div>
      )}
    </AccordionItemContext.Consumer>
  )
})
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <AccordionItemContext.Consumer>
      {({ isOpen }) => (
        isOpen && (
          <div
            ref={ref}
            className={cn(
              "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
              className
            )}
            {...props}
          >
            <div className="pb-4 pt-0">{children}</div>
          </div>
        )
      )}
    </AccordionItemContext.Consumer>
  )
})
AccordionContent.displayName = "AccordionContent"

// Helper context for Item
const AccordionItemContext = React.createContext<{
  value: string
  isOpen: boolean
  toggle: () => void
}>({ value: "", isOpen: false, toggle: () => {} })

// Re-implement AccordionItem with Context
const AccordionItemWithContext = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, children, ...props }, ref) => {
  const context = React.useContext(AccordionContext)
  const isOpen = context?.value === value || (Array.isArray(context?.value) && context?.value.includes(value))
  
  const toggle = () => {
    context?.onValueChange?.(value)
  }

  return (
    <AccordionItemContext.Provider value={{ value, isOpen: !!isOpen, toggle }}>
      <div
        ref={ref}
        data-state={isOpen ? "open" : "closed"}
        className={cn("border-b", className)}
        {...props}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  )
})
AccordionItemWithContext.displayName = "AccordionItem"

export { Accordion, AccordionItemWithContext as AccordionItem, AccordionTrigger, AccordionContent }
