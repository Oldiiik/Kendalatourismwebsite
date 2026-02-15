import * as React from "react"

const InputOTP = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input ref={ref} className={className} {...props} />
))
InputOTP.displayName = "InputOTP"

const InputOTPGroup = () => null
const InputOTPSlot = () => null
const InputOTPSeparator = () => null

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }