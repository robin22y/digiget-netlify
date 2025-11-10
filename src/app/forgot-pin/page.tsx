"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/auth/PhoneInput";
import { VerificationCodeInput } from "@/components/auth/VerificationCodeInput";

export default function ForgotPinPage() {
  const [phone, setPhone] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");

  const handleRequestCode = async () => {
    await fetch("/api/recovery/pin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber: phone }),
    });
    setCodeSent(true);
  };

  const handleVerify = async () => {
    await fetch("/api/recovery/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber: phone, code }),
    });
    alert("Code verified! A new PIN has been sent via SMS.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-white p-8 shadow-xl dark:bg-slate-900">
        <h1 className="text-2xl font-semibold text-foreground">Reset PIN</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your phone number to receive a reset code.
        </p>

        <div className="mt-6 space-y-6">
          <PhoneInput value={phone} onChange={setPhone} />
          <Button onClick={() => void handleRequestCode()} className="w-full" disabled={!phone}>
            Send code
          </Button>

          {codeSent && (
            <div className="space-y-4">
              <VerificationCodeInput value={code} onChange={setCode} />
              <Button
                onClick={() => void handleVerify()}
                className="w-full"
                disabled={code.length !== 6}
              >
                Verify code
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

