import * as React from "react"

const Form = ({ children }: { children: React.ReactNode }) => <>{children}</>
const FormItem = ({ children }: { children: React.ReactNode }) => <div>{children}</div>
const FormLabel = ({ children }: { children: React.ReactNode }) => <label>{children}</label>
const FormControl = ({ children }: { children: React.ReactNode }) => <div>{children}</div>
const FormDescription = ({ children }: { children: React.ReactNode }) => <p>{children}</p>
const FormMessage = ({ children }: { children: React.ReactNode }) => <p>{children}</p>
const FormField = () => null
const useFormField = () => ({})

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}
