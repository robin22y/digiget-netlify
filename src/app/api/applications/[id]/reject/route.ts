import { NextResponse } from "next/server";

import { supabaseClient } from "@/lib/supabase";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { reason } = await request.json();

  await supabaseClient
    .from("shop_applications")
    .update({
      status: "rejected",
      admin_notes: reason,
      processed_at: new Date().toISOString(),
    })
    .eq("id", params.id);

  return NextResponse.json({ status: "rejected" });
}

