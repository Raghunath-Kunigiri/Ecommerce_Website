import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[color:var(--surface-2)] text-[color:var(--fg)]",
        brand:
          "border-transparent bg-[color:var(--brand-soft)] text-[color:var(--brand-strong)]",
        outline: "border-[color:var(--border)] text-[color:var(--fg)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

