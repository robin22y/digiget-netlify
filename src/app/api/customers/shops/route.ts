import { NextResponse } from "next/server";

import { supabaseClient } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabaseClient
    .from("customer_points")
    .select(
      `
      shop:shops (
        id,
        shop_name,
        shop_type,
        points_per_visit
      ),
      points_balance,
      last_visit_at
    `
    )
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const response =
    data?.map((row) => ({
      id: row.shop?.id,
      shop_name: row.shop?.shop_name,
      shop_type: row.shop?.shop_type,
      points: row.points_balance,
      points_needed_for_reward: row.shop?.points_per_visit ?? 10,
      progress: Math.min(
        1,
        (row.points_balance ?? 0) / (row.shop?.points_per_visit ?? 10)
      ),
      last_visit: row.last_visit_at,
    })) ?? [];

  return NextResponse.json(response);
}

