"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface PinInputProps {
  length?: 4 | 6;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function PinInput({
  length = 4,
  value,
  onChange,
  disabled,
}: PinInputProps) {
  const inputsRef = React.useRef<Array<HTMLInputElement | null>>([]);

  const handleInputChange = (index: number, digit: string) => {
    const sanitized = digit.replace(/\D/g, "").slice(0, 1);
    if (!sanitized && !value[index]) {
      return;
    }

    const nextValue =
      value.slice(0, index) + sanitized + value.slice(index + 1, length);
    onChange(nextValue.slice(0, length));

    if (sanitized && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent) => {
    if (event.key === "Backspace" && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-3">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(element) => {
            inputsRef.current[index] = element;
          }}
          type="password"
          inputMode="numeric"
          maxLength={1}
          disabled={disabled}
          value={value[index] ?? ""}
          onChange={(event) => handleInputChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          className={cn(
            "h-12 w-12 rounded-xl border border-border text-center text-xl font-semibold tracking-widest shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50"
          )}
        />
      ))}
    </div>
  );
}

