import * as React from "react"
import { cn } from "./utils"
import { Toggle } from "./toggle"

const ToggleGroupContext = React.createContext<{
  size?: any
  variant?: any
  value: any
  onValueChange: (value: any) => void
  type: "single" | "multiple"
} | null>(null)

const ToggleGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { type: "single" | "multiple"; value?: any; onValueChange?: (value: any) => void }
>(({ className, type, value, onValueChange, children, ...props }, ref) => {
  const [internalValue, setInternalValue] = React.useState<any>(type === "multiple" ? [] : undefined)
  const finalValue = value !== undefined ? value : internalValue

  const handleValueChange = (itemValue: string) => {
    let newValue
    if (type === "single") {
      newValue = finalValue === itemValue ? undefined : itemValue
    } else {
      const arr = Array.isArray(finalValue) ? finalValue : []
      if (arr.includes(itemValue)) {
        newValue = arr.filter((v: string) => v !== itemValue)
      } else {
        newValue = [...arr, itemValue]
      }
    }
    
    if (value === undefined) setInternalValue(newValue)
    onValueChange?.(newValue)
  }

  return (
    <ToggleGroupContext.Provider value={{ type, value: finalValue, onValueChange: handleValueChange }}>
      <div ref={ref} className={cn("flex items-center justify-center gap-1", className)} {...props}>
        {children}
      </div>
    </ToggleGroupContext.Provider>
  )
})
ToggleGroup.displayName = "ToggleGroup"

const ToggleGroupItem = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Toggle> & { value: string }
>(({ className, value, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext)
  const pressed = context?.type === "single" 
    ? context.value === value 
    : (Array.isArray(context?.value) && context.value.includes(value))

  return (
    <Toggle
      ref={ref}
      className={cn("", className)}
      pressed={pressed}
      onPressedChange={() => context?.onValueChange(value)}
      {...props}
    />
  )
})
ToggleGroupItem.displayName = "ToggleGroupItem"

export { ToggleGroup, ToggleGroupItem }
