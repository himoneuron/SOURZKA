import { z } from "zod";

export const CreateProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with dashes"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  baseUnit: z.string().min(1, "Base unit is required"),
  unitPrice: z.number().positive("Unit price must be positive"),
  deliveryTimeDays: z.number().int().positive("Delivery time must be positive"),
  tags: z.array(z.string()),
  mediaUrls: z.array(z.string().url("Invalid media URL")),
  specSheetUrl: z.string().url("Invalid spec sheet URL").optional(),
});

export const UpdateProductSchema = CreateProductSchema.partial().extend({
  isPaused: z.boolean().optional(),
});

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
