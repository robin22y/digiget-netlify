import { NextResponse } from "next/server";

import { supabaseClient } from "@/lib/supabase";
import { generateToken } from "@/lib/auth";

export async function POST(request: Request) {
  const { email, userId, userType } = await request.json();

  if (!email || !userId || !userType) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const token = generateToken();
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString();

  await supabaseClient.from("email_verification_tokens").insert({
    email,
    token,
    user_id: userId,
    user_type: userType,
    expires_at: expires,
  });

  console.log("[email verification] token:", token);
  return NextResponse.json({ status: "sent" });
}

