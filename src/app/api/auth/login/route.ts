import { NextResponse } from "next/server";

import { supabaseClient } from "@/lib/supabase";
import { verifyPassword, verifyPin } from "@/lib/auth";

export async function POST(request: Request) {
  const { role, phone, email, password, pin } = await request.json();

  if (!role) {
    return NextResponse.json({ error: "Role required" }, { status: 400 });
  }

  const supabase = supabaseClient;

  if (role === "admin") {
    const { data: admin } = await supabase
      .from("admins")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (!admin || !password || !(await verifyPassword(admin.password_hash, password))) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    return NextResponse.json({ status: "ok", role });
  }

  if (role === "shop") {
    const { data: shop } = await supabase
      .from("shops")
      .select("*")
      .eq("owner_phone", phone)
      .maybeSingle();

    if (!shop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    if (pin) {
      if (!shop.pin_hash || !(await verifyPin(shop.pin_hash, pin))) {
        return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
      }
    } else if (password) {
      if (!shop.password_hash || !(await verifyPassword(shop.password_hash, password))) {
        return NextResponse.json({ error: "Invalid password" }, { status: 401 });
      }
    } else {
      return NextResponse.json({ error: "PIN or password required" }, { status: 400 });
    }

    return NextResponse.json({ status: "ok", role });
  }

  if (role === "customer") {
    const { data: customer } = await supabase
      .from("customers")
      .select("*")
      .eq("phone_number", phone)
      .maybeSingle();

    if (!customer || !pin || !(await verifyPin(customer.pin_hash, pin))) {
      return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
    }

    return NextResponse.json({ status: "ok", role });
  }

  return NextResponse.json({ error: "Unsupported role" }, { status: 400 });
}

