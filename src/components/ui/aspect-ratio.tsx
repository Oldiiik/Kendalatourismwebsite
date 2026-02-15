import * as React from "react"
import { cn } from "./utils"

const AspectRatio = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { ratio?: number }
>(({ className, ratio = 1, style, ...props }, ref) => (
  <div
    ref={ref}
    style={{
      position: "relative",
      width: "100%",
      paddingBottom: `${100 / ratio}%`,
      ...style,
    }}
    className={cn(className)}
    {...props}
  >
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      }}
    >
      {props.children}
    </div>
  </div>
))
AspectRatio.displayName = "AspectRatio"

export { AspectRatio }
