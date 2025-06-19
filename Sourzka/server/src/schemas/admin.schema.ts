import { z } from "zod";

export const AdminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const ManufacturerQuerySchema = z.object({
  verified: z.boolean().optional(),
  page: z.number().positive().optional().default(1),
  limit: z.number().positive().optional().default(10),
  search: z.string().optional(),
  isViewedByStaff: z.boolean().optional(),
});

export type AdminLoginInput = z.infer<typeof AdminLoginSchema>;
export type ManufacturerQueryInput = z.infer<typeof ManufacturerQuerySchema>;

export const ManufacturerVerificationSchema = z.object({
  isVerified: z.boolean().refine((val) => val !== undefined, {
    message: "isVerified must be specified",
  }),
});

export type ManufacturerVerificationInput = z.infer<
  typeof ManufacturerVerificationSchema
>;
