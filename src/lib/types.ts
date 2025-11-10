export type Role = "admin" | "shop" | "customer";

export interface Admin {
  id: string;
  email: string;
  phone_number: string;
  name: string;
  email_verified: boolean;
  phone_verified: boolean;
  created_at: string;
  last_login_at: string | null;
}

export interface ShopApplication {
  id: string;
  reference_code: string;
  shop_name: string;
  shop_type: string;
  shop_address_line1: string;
  shop_address_line2?: string | null;
  shop_postcode: string;
  shop_logo_url?: string | null;
  owner_name: string;
  owner_email: string;
  owner_phone: string;
  points_per_visit: number;
  reward_description: string;
  status: "pending" | "approved" | "rejected";
  admin_notes?: string | null;
  processed_by?: string | null;
  processed_at?: string | null;
  created_at: string;
  ip_address?: string | null;
}

export interface Shop {
  id: string;
  application_id: string | null;
  shop_name: string;
  shop_type: string;
  shop_address_line1: string;
  shop_address_line2?: string | null;
  shop_postcode: string;
  shop_logo_url?: string | null;
  owner_name: string;
  owner_email: string;
  owner_phone: string;
  password_hash?: string | null;
  pin_hash?: string | null;
  email_verified: boolean;
  nfc_tag_id: string;
  trial_ends_at: string;
  subscription_status: "trial" | "active" | "cancelled" | string;
  points_per_visit: number;
  setup_completed: boolean;
  created_at: string;
  activated_at?: string | null;
  last_login_at?: string | null;
}

export interface Reward {
  id: string;
  shop_id: string;
  points_required: number;
  reward_description: string;
  reward_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Customer {
  id: string;
  phone_number: string;
  name?: string | null;
  pin_hash: string;
  created_at: string;
  last_seen_at?: string | null;
}

export interface CustomerPoints {
  id: string;
  customer_id: string;
  shop_id: string;
  points_balance: number;
  total_visits: number;
  last_visit_at?: string | null;
  created_at: string;
}

export interface Transaction {
  id: string;
  customer_id: string;
  shop_id: string;
  transaction_type: "checkin" | "redeem" | "adjustment" | string;
  points_change: number;
  notes?: string | null;
  created_at: string;
}

export interface NfcTag {
  id: string;
  tag_id: string;
  assigned_to_shop_id?: string | null;
  status: "available" | "assigned" | "retired" | string;
  created_at: string;
  assigned_at?: string | null;
}

export interface ActivationToken {
  id: string;
  shop_id: string;
  token: string;
  expires_at: string;
  used_at?: string | null;
  created_at: string;
}

export interface PasswordResetToken {
  id: string;
  user_type: Role;
  user_id: string;
  email: string;
  token: string;
  expires_at: string;
  used_at?: string | null;
  created_at: string;
}

export interface PinResetToken {
  id: string;
  user_type: Role;
  user_id: string;
  phone_number: string;
  reset_code: string;
  expires_at: string;
  used_at?: string | null;
  created_at: string;
}

export interface EmailVerificationToken {
  id: string;
  user_type: Role;
  user_id: string;
  email: string;
  token: string;
  expires_at: string;
  verified_at?: string | null;
  created_at: string;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

