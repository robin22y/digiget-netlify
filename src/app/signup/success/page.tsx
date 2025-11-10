"use client";

import { Suspense } from "react";
import SignupSuccessClient from "./SignupSuccessClient";

export default function SignupSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupSuccessClient />
    </Suspense>
  );
}

