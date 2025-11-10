"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface VerificationCodeInputProps {
  digits?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function VerificationCodeInput({
  digits = 6,
  value,
  onChange,
  disabled,
}: VerificationCodeInputProps) {
  const refs = React.useRef<Array<HTMLInputElement | null>>([]);

  const handleValueChange = (index: number, input: string) => {
    const sanitized = input.replace(/\D/g, "").slice(0, 1);
    const nextValue =
      value.slice(0, index) + sanitized + value.slice(index + 1, digits);
    onChange(nextValue.slice(0, digits));

    if (sanitized && index < digits - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent) => {
    if (event.key === "Backspace" && !value[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex items-center justify-center gap-3">
      {Array.from({ length: digits }).map((_, index) => (
        <input
          key={index}
          ref={(element) => {
            refs.current[index] = element;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          disabled={disabled}
          value={value[index] ?? ""}
          onChange={(event) => handleValueChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          className={cn(
            "h-12 w-12 rounded-xl border border-border text-center text-xl font-semibold tracking-widest shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50"
          )}
        />
      ))}
    </div>
  );
}

