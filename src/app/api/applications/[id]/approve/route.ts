import { NextResponse } from "next/server";

import { supabaseClient } from "@/lib/supabase";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { nfcTagId, trialDays = 30 } = await request.json();

  if (!nfcTagId) {
    return NextResponse.json(
      { error: "nfcTagId is required" },
      { status: 400 }
    );
  }

  const supabase = supabaseClient;

  const { data: application, error: appError } = await supabase
    .from("shop_applications")
    .select("*")
    .eq("id", id)
    .single();

  if (appError || !application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  const trialEndsAt = new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + Number(trialDays));

  const { error: shopError } = await supabase.from("shops").insert({
    application_id: application.id,
    shop_name: application.shop_name,
    shop_type: application.shop_type,
    shop_address_line1: application.shop_address_line1,
    shop_address_line2: application.shop_address_line2,
    shop_postcode: application.shop_postcode,
    owner_name: application.owner_name,
    owner_email: application.owner_email,
    owner_phone: application.owner_phone,
    points_per_visit: application.points_per_visit,
    nfc_tag_id: nfcTagId,
    trial_ends_at: trialEndsAt.toISOString(),
  });

  if (shopError) {
    return NextResponse.json(
      { error: shopError.message },
      { status: 400 }
    );
  }

  await supabase
    .from("shop_applications")
    .update({
      status: "approved",
      processed_at: new Date().toISOString(),
    })
    .eq("id", id);

  return NextResponse.json({ status: "approved" });
}

