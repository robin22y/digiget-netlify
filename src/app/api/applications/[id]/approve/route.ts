import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const id = context.params.id;

    return NextResponse.json({ status: "approved", id });
  } catch (error: unknown) {
    console.error("Error approving:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

