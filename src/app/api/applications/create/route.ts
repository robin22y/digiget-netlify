import { NextResponse } from "next/server";

import { supabaseClient } from "@/lib/supabase";
import { generateReferenceCode } from "@/lib/auth";
import { shopApplicationSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const json = await request.json();

  const parseResult = shopApplicationSchema.safeParse({
    shopName: json.shopName,
    shopType: json.shopType,
    addressLine1: json.addressLine1,
    addressLine2: json.addressLine2,
    postcode: json.postcode,
    ownerName: json.ownerName,
    ownerEmail: json.ownerEmail,
    ownerPhone: json.ownerPhone,
    pointsPerVisit: Number(json.pointsPerVisit),
    rewardDescription: json.rewardDescription,
  });

  if (!parseResult.success) {
    return NextResponse.json(
      { error: parseResult.error.flatten().formErrors.join(", ") },
      { status: 400 }
    );
  }

  const referenceCode = generateReferenceCode();

  const { error } = await supabaseClient.from("shop_applications").insert({
    reference_code: referenceCode,
    shop_name: parseResult.data.shopName,
    shop_type: parseResult.data.shopType,
    shop_address_line1: parseResult.data.addressLine1,
    shop_address_line2: parseResult.data.addressLine2,
    shop_postcode: parseResult.data.postcode,
    owner_name: parseResult.data.ownerName,
    owner_email: parseResult.data.ownerEmail,
    owner_phone: parseResult.data.ownerPhone,
    points_per_visit: parseResult.data.pointsPerVisit,
    reward_description: parseResult.data.rewardDescription,
    status: "pending",
  });

  if (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unable to save application" },
      { status: 500 }
    );
  }

  return NextResponse.json({ referenceCode }, { status: 201 });
}

