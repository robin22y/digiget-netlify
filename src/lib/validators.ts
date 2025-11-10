import { z } from "zod";

export const ukPhoneSchema = z
  .string()
  .min(10, "Phone number must include area code")
  .regex(/^0\d{10}$/, "Enter a valid UK mobile number (07...)");

export const shopApplicationSchema = z.object({
  shopName: z.string().min(2, "Shop name is required"),
  shopType: z.string().min(2, "Select a shop type"),
  addressLine1: z.string().min(3, "Address line 1 is required"),
  addressLine2: z.string().optional().nullable(),
  postcode: z
    .string()
    .min(5, "Postcode required")
    .regex(
      /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i,
      "Enter a valid UK postcode"
    ),
  ownerName: z.string().min(2, "Owner name is required"),
  ownerEmail: z.string().email("Enter a valid email address"),
  ownerPhone: ukPhoneSchema,
  pointsPerVisit: z.number().min(4).max(20),
  rewardDescription: z.string().min(3, "Reward description required"),
});

export const checkinSchema = z.object({
  phoneNumber: ukPhoneSchema,
  name: z.string().min(2).optional().nullable(),
});

export const loginSchema = z.object({
  phoneNumber: ukPhoneSchema,
  password: z.string().min(8).optional(),
  pin: z.string().length(6).optional(),
});

export type ShopApplicationInput = z.infer<typeof shopApplicationSchema>;
export type CheckinInput = z.infer<typeof checkinSchema>;

