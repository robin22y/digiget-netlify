import { NextResponse } from "next/server";

import { supabaseClient } from "@/lib/supabase";

export async function POST(request: Request) {
  const { shopName, pointsPerVisit, loyaltyEnabled } = await request.json();

  console.log("[settings] update", { shopName, pointsPerVisit, loyaltyEnabled });

  await supabaseClient
    .from("shops")
    .update({
      shop_name: shopName,
      points_per_visit: pointsPerVisit,
    })
    .limit(1)
    .select();

  return NextResponse.json({ status: "saved" });
}

