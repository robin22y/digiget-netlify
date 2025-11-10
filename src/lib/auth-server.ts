"use server";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function createServerSupabaseClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, any>) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: Record<string, any>) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );
}

export async function getSession() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

export async function getUserWithRole() {
  const session = await getSession();
  if (!session) return null;

  const supabase = await createServerSupabaseClient();
  const userId = session.user.id;

  const { data: admin } = await supabase
    .from("admins")
    .select("*")
    .eq("id", userId)
    .single();

  if (admin) return { role: "admin" as const, user: admin, session };

  const { data: shop } = await supabase
    .from("shops")
    .select("*")
    .eq("id", userId)
    .single();

  if (shop) return { role: "shop" as const, user: shop, session };

  const { data: customer } = await supabase
    .from("customers")
    .select("*")
    .eq("id", userId)
    .single();

  if (customer) return { role: "customer" as const, user: customer, session };

  return null;
}

