import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Define reusable button style variants using class-variance-authority (cva).
 * Each variant (e.g., default, destructive, outline) maps to a set of Tailwind classes.
 * Also defines size variants for different button dimensions.
 */
const buttonVariants = cva(
  // Base classes shared across all variants
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      // Visual styles for different button types
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      // Size options for padding and height
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    // Default props if none are specified
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * Reusable Button component.
 *
 * Props:
 * - variant: choose a style variant (default, destructive, etc.)
 * - size: choose a size variant (default, sm, lg, icon)
 * - asChild: if true, renders a Radix Slot to pass styles to a child component
 * - className: additional custom classes
 * - ...props: any standard button props (onClick, type, etc.)
 */
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  // If asChild is true, render a Slot (allows styling of nested elements);
  // otherwise render a native <button>.
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      // Combine selected variant and size with any custom className
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

// Export the Button component and the buttonVariants function for reuse
export { Button, buttonVariants }
