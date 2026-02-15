import * as React from "react"
import { cn } from "./utils"

const Slider = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { value?: number[]; onValueChange?: (value: number[]) => void; max?: number; step?: number }
>(({ className, value, onValueChange, max = 100, step = 1, ...props }, ref) => (
  <div className={cn("relative flex w-full touch-none select-none items-center", className)}>
    <input 
      type="range"
      min={0}
      max={max}
      step={step}
      value={value ? value[0] : 0}
      onChange={(e) => onValueChange?.([parseFloat(e.target.value)])}
      className="w-full h-2 bg-secondary rounded-full appearance-none cursor-pointer"
      ref={ref}
      {...props}
    />
  </div>
))
Slider.displayName = "Slider"

export { Slider }
