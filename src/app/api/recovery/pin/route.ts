import { NextResponse } from "next/server";

import { supabaseClient } from "@/lib/supabase";
import { generateSmsCode } from "@/lib/auth";

export async function POST(request: Request) {
  const { phoneNumber } = await request.json();

  if (!phoneNumber) {
    return NextResponse.json({ error: "Phone required" }, { status: 400 });
  }

  const code = generateSmsCode();
  const expires = new Date(Date.now() + 1000 * 60 * 10).toISOString();

  await supabaseClient.from("pin_reset_tokens").insert({
    phone_number: phoneNumber,
    reset_code: code,
    expires_at: expires,
    user_type: "customer",
    user_id: crypto.randomUUID(),
  });

  console.log("[pin reset] code:", code);

  return NextResponse.json({ status: "sent" });
}

