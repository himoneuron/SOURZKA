import { z } from "zod";

export const OnboardingSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  factoryDetails: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  certificates: z.array(z.string().url("Invalid certificate URL")).optional(),
  gallery: z.array(z.string().url("Invalid gallery image URL")).optional(),
  introVideo: z.string().url("Invalid video URL").optional(),
});

export const LegalDocumentSchema = z.object({
  title: z.string().min(1, "Document title is required"),
  url: z.string().url("Invalid document URL"),
});

export type OnboardingInput = z.infer<typeof OnboardingSchema>;
export type LegalDocumentInput = z.infer<typeof LegalDocumentSchema>;
