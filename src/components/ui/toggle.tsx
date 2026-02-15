import * as React from "react"
import { cn } from "./utils"

const Toggle = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { pressed?: boolean; onPressedChange?: (pressed: boolean) => void }
>(({ className, pressed, onPressedChange, ...props }, ref) => {
  const [internalPressed, setInternalPressed] = React.useState(false)
  const isControlled = pressed !== undefined
  const finalPressed = isControlled ? pressed : internalPressed
  
  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={finalPressed}
      data-state={finalPressed ? "on" : "off"}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
        className
      )}
      onClick={() => {
        if (!isControlled) setInternalPressed(!finalPressed)
        onPressedChange?.(!finalPressed)
      }}
      {...props}
    />
  )
})
Toggle.displayName = "Toggle"

export { Toggle }
