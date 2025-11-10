import { NextResponse } from "next/server";

import { supabaseClient } from "@/lib/supabase";

export async function POST(request: Request) {
  const { token } = await request.json();

  if (!token) {
    return NextResponse.json({ error: "Token required" }, { status: 400 });
  }

  const { data, error } = await supabaseClient
    .from("email_verification_tokens")
    .select("*")
    .eq("token", token)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  await supabaseClient
    .from("email_verification_tokens")
    .update({ verified_at: new Date().toISOString() })
    .eq("id", data.id);

  return NextResponse.json({ status: "verified" });
}

