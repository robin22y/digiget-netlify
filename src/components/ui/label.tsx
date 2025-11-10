"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  requiredIndicator?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, requiredIndicator, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium text-foreground/80 dark:text-foreground",
        className
      )}
      {...props}
    >
      {children}
      {requiredIndicator && (
        <span className="ml-1 text-danger" aria-hidden>
          *
        </span>
      )}
    </label>
  )
);
Label.displayName = "Label";

export { Label };

