"use client";

import { Suspense } from "react";
import ShopLoginClient from "./ShopLoginClient";

export default function ShopLoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShopLoginClient />
    </Suspense>
  );
}

