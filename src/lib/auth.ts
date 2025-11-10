import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "https://zahiakhnsyrhznvnivsv.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphaGlha2huc3lyaHpudm5pdnN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3ODY4MjMsImV4cCI6MjA3ODM2MjgyM30.1-apaR7tGnGZ-1gL4N27ua6SsJ-Fig_gZP0r0RB-Ac0";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function identifyUser(phoneNumber: string) {
  const { data: admin } = await supabase
    .from("admins")
    .select("*")
    .eq("phone_number", phoneNumber)
    .single();

  if (admin) return { role: "admin", data: admin };

  const { data: shop } = await supabase
    .from("shops")
    .select("*")
    .eq("owner_phone", phoneNumber)
    .single();

  if (shop) {
    if (!shop.setup_completed) {
      return { role: "shop_pending", data: shop };
    }
    return { role: "shop", data: shop };
  }

  const { data: customer } = await supabase
    .from("customers")
    .select("*")
    .eq("phone_number", phoneNumber)
    .single();

  if (customer) return { role: "customer", data: customer };

  return { role: "new", data: null };
}

export async function verifyPassword(hash: string, password: string) {
  return bcrypt.compare(password, hash);
}

export async function verifyPin(hash: string, pin: string) {
  return bcrypt.compare(pin, hash);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function hashPin(pin: string) {
  return bcrypt.hash(pin, 10);
}

export function generateReferenceCode() {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `DG-${year}-${random}`;
}

export function generateToken() {
  return crypto.randomUUID().replace(/-/g, "");
}

export function generateSmsCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

