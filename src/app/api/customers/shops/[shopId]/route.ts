import { NextResponse } from "next/server";

import { supabaseClient } from "@/lib/supabase";

export async function GET(
  _request: Request,
  { params }: { params: { shopId: string } }
) {
  const shopId = params.shopId;

  const { data: points, error } = await supabaseClient
    .from("customer_points")
    .select(
      `
      points_balance,
      shops (
        id,
        shop_name,
        points_per_visit,
        reward_description
      )
    `
    )
    .eq("shop_id", shopId)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: transactions } = await supabaseClient
    .from("transactions")
    .select("id, created_at, points_change, transaction_type")
    .eq("shop_id", shopId)
    .order("created_at", { ascending: false })
    .limit(20);

  return NextResponse.json({
    id: points?.shops?.id ?? shopId,
    shop_name: points?.shops?.shop_name ?? "Unknown shop",
    reward_description: points?.shops?.reward_description ?? "",
    points_per_visit: points?.shops?.points_per_visit ?? 10,
    points_balance: points?.points_balance ?? 0,
    transactions: transactions ?? [],
  });
}

