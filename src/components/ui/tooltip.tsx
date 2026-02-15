import * as React from "react"
import { cn } from "./utils"

const TooltipProvider = ({ children }: any) => <>{children}</>

const Tooltip = ({ children, open, onOpenChange }: any) => {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isControlled = open !== undefined
  const finalOpen = isControlled ? open : internalOpen
  
  return (
    <div 
      className="relative inline-block group"
      onMouseEnter={() => !isControlled && setInternalOpen(true)}
      onMouseLeave={() => !isControlled && setInternalOpen(false)}
    >
      {React.Children.map(children, child => 
        React.isValidElement(child) 
          ? React.cloneElement(child as any, { open: finalOpen }) 
          : child
      )}
    </div>
  )
}

const TooltipTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(({ className, ...props }, ref) => (
  <button ref={ref} className={className} {...props} />
))
TooltipTrigger.displayName = "TooltipTrigger"

const TooltipContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { open?: boolean }>(({ className, sideOffset = 4, open, ...props }, ref) => {
  // In a real tooltip, this is rendered in a portal. Here we use group-hover trick or state.
  // The 'open' prop is injected by the parent Tooltip cloneElement.
  if (!open) return null
  
  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        "bottom-full mb-2 left-1/2 -translate-x-1/2 w-max", // Simple positioning
        className
      )}
      {...props}
    />
  )
})
TooltipContent.displayName = "TooltipContent"

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
