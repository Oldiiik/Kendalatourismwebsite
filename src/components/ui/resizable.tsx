import * as React from "react"

const ResizablePanelGroup = ({ children }: { children: React.ReactNode }) => <>{children}</>
const ResizablePanel = ({ children }: { children: React.ReactNode }) => <>{children}</>
const ResizableHandle = () => null

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }