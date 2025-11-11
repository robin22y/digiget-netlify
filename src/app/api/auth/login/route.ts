import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const { email, password, userType } = await req.json();

    if (userType === "admin") {
      const { data: admin } = await supabase
        .from("admins")
        .select("*")
        .eq("email", email)
        .single();

      if (!admin) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }

      const isValid = await bcrypt.compare(password, admin.password_hash);

      if (!isValid) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }

      await supabase
        .from("admins")
        .update({ last_login_at: new Date().toISOString() })
        .eq("id", admin.id);

      const cookieStore = cookies();
      cookieStore.set("user_id", admin.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 8,
        path: "/",
      });
      cookieStore.set("user_role", "admin", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 8,
        path: "/",
      });

      return NextResponse.json({
        success: true,
        user: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: "admin",
        },
      });
    }

    if (userType === "shop") {
      const { data: shop } = await supabase
        .from("shops")
        .select("*")
        .eq("owner_email", email)
        .single();

      if (!shop) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }

      if (!shop.setup_completed) {
        return NextResponse.json(
          { error: "Please complete your account setup first" },
          { status: 403 }
        );
      }

      const isValid = await bcrypt.compare(password, shop.password_hash);

      if (!isValid) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }

      await supabase
        .from("shops")
        .update({ last_login_at: new Date().toISOString() })
        .eq("id", shop.id);

      const cookieStore = cookies();
      cookieStore.set("user_id", shop.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
        path: "/",
      });
      cookieStore.set("user_role", "shop", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
        path: "/",
      });

      return NextResponse.json({
        success: true,
        user: {
          id: shop.id,
          name: shop.owner_name,
          shopName: shop.shop_name,
          role: "shop",
        },
      });
    }

    return NextResponse.json({ error: "Invalid user type" }, { status: 400 });
  } catch (error) {
    console.error("[Login] Error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}

