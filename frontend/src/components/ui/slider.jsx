import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'

import { cn } from '../../lib/utils'

const Slider = React.forwardRef(({ className, 'aria-label': ariaLabel, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn('relative flex w-full touch-none items-center select-none', className)}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-line">
      <SliderPrimitive.Range className="absolute h-full bg-moss" />
    </SliderPrimitive.Track>
    {(props.value || props.defaultValue || [0]).map((_, i) => (
      <SliderPrimitive.Thumb
        key={i}
        aria-label={i === 0 ? `${ariaLabel} minimum` : `${ariaLabel} maximum`}
        className="block h-5 w-5 rounded-full border-2 border-moss bg-white shadow transition-transform hover:scale-110 focus-visible:ring-4 focus-visible:ring-moss/25 focus-visible:outline-none"
      />
    ))}
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
