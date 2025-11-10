import { NextResponse } from "next/server";

import { supabaseClient } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabaseClient
    .from("shops")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

