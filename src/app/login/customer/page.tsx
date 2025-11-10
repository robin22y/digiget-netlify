"use client";

import { Suspense } from "react";
import CustomerLoginClient from "./CustomerLoginClient";

export default function CustomerLoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CustomerLoginClient />
    </Suspense>
  );
}

