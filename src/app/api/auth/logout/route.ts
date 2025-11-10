import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ status: "logged_out" });
  response.cookies.set("dg_role", "", { maxAge: 0 });
  return response;
}

