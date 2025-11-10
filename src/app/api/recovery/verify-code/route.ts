import { NextResponse } from "next/server";

import { supabaseClient } from "@/lib/supabase";

export async function POST(request: Request) {
  const { phoneNumber, code } = await request.json();

  if (!phoneNumber || !code) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { data } = await supabaseClient
    .from("pin_reset_tokens")
    .select("*")
    .eq("phone_number", phoneNumber)
    .eq("reset_code", code)
    .order("created_at", { ascending: false })
    .maybeSingle();

  if (!data) {
    return NextResponse.json({ error: "Invalid code" }, { status: 400 });
  }

  await supabaseClient
    .from("pin_reset_tokens")
    .update({ used_at: new Date().toISOString() })
    .eq("id", data.id);

  return NextResponse.json({ status: "verified" });
}

