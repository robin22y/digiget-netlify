import { NextResponse } from "next/server";

import { supabaseClient } from "@/lib/supabase";
import { hashPin } from "@/lib/auth";

export async function POST(request: Request) {
  const { customerId, newPin } = await request.json();

  if (!customerId || !newPin) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const hashedPin = await hashPin(newPin);
  const { error } = await supabaseClient
    .from("customers")
    .update({ pin_hash: hashedPin })
    .eq("id", customerId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ status: "ok" });
}

