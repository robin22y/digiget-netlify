import { NextResponse } from "next/server";

import { supabaseClient } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabaseClient
    .from("customer_points")
    .select(
      `
      id,
      points_balance,
      last_visit_at,
      customers (
        id,
        name,
        phone_number
      )
    `
    )
    .order("last_visit_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const result =
    data?.map((row) => ({
      id: row.customers?.id ?? row.id,
      name: row.customers?.name ?? null,
      phone_number: row.customers?.phone_number ?? "",
      points: row.points_balance ?? 0,
      last_visit_at: row.last_visit_at,
    })) ?? [];

  return NextResponse.json(result);
}

