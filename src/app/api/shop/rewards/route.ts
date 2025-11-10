import { NextResponse } from "next/server";

import { supabaseClient } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabaseClient
    .from("rewards")
    .select("*")
    .order("reward_order", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

