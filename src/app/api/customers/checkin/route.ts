import { NextResponse } from "next/server";
import { z } from "zod";

import { hashPin } from "@/lib/auth";
import {
  createServerSupabaseClient,
  getUserWithRole,
} from "@/lib/auth-server";

const CheckinSchema = z.object({
  phoneNumber: z.string(),
  name: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const userWithRole = await getUserWithRole();

    if (!userWithRole) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (userWithRole.role !== "shop") {
      return NextResponse.json(
        { error: "Forbidden - Shop owners only" },
        { status: 403 }
      );
    }

    const rawBody = await request.json();
    const body = {
      ...rawBody,
      phoneNumber: rawBody.phoneNumber?.replace(/\s+/g, ""),
    };

    const validation = CheckinSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { phoneNumber, name } = validation.data;
    const supabase = await createServerSupabaseClient();
    const shopId = userWithRole.user.id;

    let { data: customer, error: customerError } = await supabase
      .from("customers")
      .select("*")
      .eq("phone_number", phoneNumber)
      .single();

    if (customerError && customerError.code !== "PGRST116") {
      throw customerError;
    }

    if (!customer) {
      const { data: newCustomer, error: insertCustomerError } = await supabase
        .from("customers")
        .insert({
          phone_number: phoneNumber,
          name: name || null,
          pin_hash: await hashPin("1234"),
        })
        .select()
        .single();

      if (insertCustomerError) throw insertCustomerError;
      customer = newCustomer;
    }

    const { data: shop, error: shopError } = await supabase
      .from("shops")
      .select("points_per_visit")
      .eq("id", shopId)
      .single();

    if (shopError || !shop) {
      throw shopError || new Error("Shop not found");
    }

    const { data: customerPoints } = await supabase
      .from("customer_points")
      .select("*")
      .eq("customer_id", customer.id)
      .eq("shop_id", shopId)
      .maybeSingle();

    if (customerPoints) {
      const { error: updateError } = await supabase
        .from("customer_points")
        .update({
          points_balance: customerPoints.points_balance + shop.points_per_visit,
          total_visits: customerPoints.total_visits + 1,
          last_visit_at: new Date().toISOString(),
        })
        .eq("id", customerPoints.id);

      if (updateError) throw updateError;
    } else {
      const { error: insertPointsError } = await supabase
        .from("customer_points")
        .insert({
          customer_id: customer.id,
          shop_id: shopId,
          points_balance: shop.points_per_visit,
          total_visits: 1,
          last_visit_at: new Date().toISOString(),
        });

      if (insertPointsError) throw insertPointsError;
    }

    const { error: logError } = await supabase.from("transactions").insert({
      customer_id: customer.id,
      shop_id: shopId,
      transaction_type: "check_in",
      points_change: shop.points_per_visit,
      notes: "Customer check-in",
    });

    if (logError) throw logError;

    const newBalance =
      (customerPoints?.points_balance ?? 0) + shop.points_per_visit;

    return NextResponse.json({
      success: true,
      customer: {
        name: customer.name,
        newBalance,
      },
    });
  } catch (error) {
    console.error("Customer check-in error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

