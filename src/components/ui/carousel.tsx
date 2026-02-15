import * as React from "react"

const Carousel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={className} {...props} />
))
Carousel.displayName = "Carousel"

const CarouselContent = () => null
const CarouselItem = () => null
const CarouselPrevious = () => null
const CarouselNext = () => null

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}