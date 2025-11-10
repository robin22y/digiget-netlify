"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const UK_PREFIX = "+44";

export interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export function PhoneInput({
  value,
  onChange,
  className,
  label,
  placeholder = "07XXX XXX XXX",
  ...props
}: PhoneInputProps) {
  const formatPhone = (input: string) => {
    const numbers = input.replace(/\D/g, "");
    if (numbers.startsWith("44")) {
      return `0${numbers.slice(2)}`;
    }
    if (numbers.startsWith("0")) {
      return numbers;
    }
    if (numbers.length === 10) {
      return `0${numbers}`;
    }
    return numbers;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(event.target.value);
    onChange(formatted);
  };

  return (
    <div className="space-y-1.5">
      {label ? (
        <label className="block text-sm font-medium text-foreground/80">
          {label}
        </label>
      ) : null}
      <div className="flex items-center rounded-lg border border-border bg-white pr-2 shadow-sm focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 dark:bg-slate-900">
        <span className="px-3 text-sm font-semibold text-foreground/70">
          {UK_PREFIX}
        </span>
        <input
          inputMode="numeric"
          pattern="[0-9]*"
          className={cn(
            "h-11 w-full rounded-lg bg-transparent px-3 text-sm outline-none",
            className
          )}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          {...props}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        UK mobile numbers only. Include the leading 0.
      </p>
    </div>
  );
}

