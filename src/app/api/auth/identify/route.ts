import { NextResponse } from "next/server";

import { identifyUser } from "@/lib/auth";

export async function POST(request: Request) {
  const { phoneNumber } = await request.json();

  if (!phoneNumber) {
    return NextResponse.json(
      { error: "Phone number is required" },
      { status: 400 }
    );
  }

  try {
    const result = await identifyUser(phoneNumber.replace(/\s+/g, ""));
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { role: "new", data: null, error: "Unable to identify user" },
      { status: 500 }
    );
  }
}

