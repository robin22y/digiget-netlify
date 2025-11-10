import { NextResponse } from "next/server";
import { supabaseClient } from "@/lib/supabase";
import { hashPassword } from "@/lib/auth";
import { generateToken } from "@/lib/auth";

export async function POST(request: Request) {
  const { email } = await request.json();
  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const token = generateToken();
  const expires = new Date(Date.now() + 1000 * 60 * 60).toISOString();

  await supabaseClient.from("password_reset_tokens").insert({
    email,
    token,
    expires_at: expires,
    user_type: "shop",
    user_id: crypto.randomUUID(),
  });

  console.log("[password reset] token:", token);

  return NextResponse.json({ status: "sent" });
}

export async function PUT(request: Request) {
  const { token, password } = await request.json();
  if (!token || !password) {
    return NextResponse.json({ error: "Token and password required" }, { status: 400 });
  }

  const hashed = await hashPassword(password);

  const { data } = await supabaseClient
    .from("password_reset_tokens")
    .select("*")
    .eq("token", token)
    .maybeSingle();

  if (!data) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  await supabaseClient
    .from("shops")
    .update({ password_hash: hashed })
    .eq("id", data.user_id);

  await supabaseClient
    .from("password_reset_tokens")
    .update({ used_at: new Date().toISOString() })
    .eq("id", data.id);

  return NextResponse.json({ status: "updated" });
}

