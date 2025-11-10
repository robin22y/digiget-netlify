"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

import { Input, type InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const getStrengthLabel = (value: string) => {
  if (value.length >= 14 && /[A-Z]/.test(value) && /[0-9]/.test(value)) {
    return { label: "Strong", score: 3 };
  }
  if (value.length >= 10 && /[0-9]/.test(value)) {
    return { label: "Good", score: 2 };
  }
  if (value.length >= 8) {
    return { label: "Weak", score: 1 };
  }
  if (value.length > 0) {
    return { label: "Too short", score: 0 };
  }
  return { label: "", score: 0 };
};

export interface PasswordInputProps
  extends Omit<InputProps, "type" | "value" | "onChange"> {
  value: string;
  onChange: (value: string) => void;
}

export function PasswordInput({
  value,
  onChange,
  className,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = React.useState(false);
  const strength = getStrengthLabel(value);

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          {...props}
          className={cn("pr-12", className)}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-3 flex items-center text-muted-foreground"
          onClick={() => setVisible((prev) => !prev)}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>

      {strength.label && (
        <div>
          <div className="mb-1 flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span>Password strength</span>
            <span>{strength.label}</span>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 3 }).map((_, index) => (
              <span
                key={index}
                className={cn(
                  "h-1.5 flex-1 rounded-full bg-muted",
                  index < strength.score && "bg-success"
                )}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

