"use client";

import * as React from "react";
import { CheckCircle2 } from "lucide-react";

import { Input, type InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface EmailInputProps
  extends Omit<InputProps, "value" | "onChange"> {
  value: string;
  onChange: (value: string) => void;
  verified?: boolean;
}

export function EmailInput({
  value,
  onChange,
  verified,
  className,
  ...props
}: EmailInputProps) {
  return (
    <div className="space-y-1.5">
      <div className="relative">
        <Input
          {...props}
          type="email"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={cn(verified ? "pr-12" : "", className)}
        />
        {verified ? (
          <span className="absolute inset-y-0 right-3 flex items-center text-success">
            <CheckCircle2 className="h-5 w-5" aria-label="Verified" />
          </span>
        ) : null}
      </div>
      <p className="text-xs text-muted-foreground">
        We’ll send notifications and receipts to this email.
      </p>
    </div>
  );
}

