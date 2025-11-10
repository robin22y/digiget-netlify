import { NextResponse } from "next/server";

import { supabaseClient } from "@/lib/supabase";

export async function POST(request: Request) {
  const { phoneNumber } = await request.json();

  if (!phoneNumber) {
    return NextResponse.json({ error: "Phone number required" }, { status: 400 });
  }

  const sanitized = phoneNumber.replace(/\s+/g, "");

  const { data, error } = await supabaseClient
    .from("customers")
    .select(
      `
        id,
        name,
        phone_number,
        last_seen_at,
        points:customer_points!inner(points_balance, last_visit_at)
      `
    )
    .eq("phone_number", sanitized)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json(null);
  }

  type PointsRow = { points_balance: number; last_visit_at: string | null };
  type CustomerRow = {
    id: string;
    name: string | null;
    phone_number: string;
    last_seen_at: string | null;
    points: PointsRow | PointsRow[];
  };

  const row = data as CustomerRow;
  const pointsRecord = Array.isArray(row.points) ? row.points[0] : row.points;

  return NextResponse.json({
    id: row.id,
    name: row.name,
    phone_number: row.phone_number,
    points: pointsRecord?.points_balance ?? 0,
    last_visit: pointsRecord?.last_visit_at ?? row.last_seen_at,
  });
}

