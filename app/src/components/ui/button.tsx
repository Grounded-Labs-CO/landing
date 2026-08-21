import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding font-mono text-[11px] font-medium tracking-[0.12em] uppercase whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-[#B4552B] text-[#0E1214] hover:bg-[#9A4A24]",
        outline:
          "border-[#2F3A3D] bg-transparent text-[#9AA3A1] hover:bg-[#1C2427] hover:text-[#F1F3F2] aria-expanded:bg-[#1C2427] aria-expanded:text-[#F1F3F2]",
        secondary:
          "bg-[#1C2427] text-[#F1F3F2] border border-[#262E31] hover:bg-[#242F33] aria-expanded:bg-[#242F33] aria-expanded:text-[#F1F3F2]",
        ghost:
          "hover:bg-[#1C2427] hover:text-[#F1F3F2] aria-expanded:bg-[#1C2427] aria-expanded:text-[#F1F3F2]",
        destructive:
          "bg-[#B4552B]/10 text-[#B4552B] hover:bg-[#B4552B]/20 focus-visible:border-[#B4552B]/40 focus-visible:ring-[#B4552B]/20",
        link: "text-[#B4552B] underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-9 gap-1.5 px-5 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        xs: "h-7 gap-1 px-3 text-[11px] has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1 px-4 text-[11px] has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-10 gap-1.5 px-6 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        icon: "size-9",
        "icon-xs": "size-7 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
