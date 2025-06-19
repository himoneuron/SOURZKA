// routes/userRoutes.ts
import { Router } from "express";
import { validate } from "../lib/validate";
import { SigninSchema, SignupSchema } from "../schemas/user.schemas";
import {
  OnboardingSchema,
  LegalDocumentSchema,
} from "../schemas/manufacturer.schema";
import { ManufacturerController } from "../controllers/manufacturer.controller";
import { authorizeRoles } from "../middlewares/auth.middleware";
import { Role } from "../../generated/prisma";



const router = Router();

// Auth routes (no auth required)
router.post("/signup", validate(SignupSchema), ManufacturerController.signup);
router.post("/signin", validate(SigninSchema), ManufacturerController.signin);

// Protected routes - require manufacturer auth
router.use(authorizeRoles([Role.MANUFACTURER]));

// Onboarding and profile routes
router.post(
  "/onboard",
  validate(OnboardingSchema),
  ManufacturerController.onboard
);

router.post(
  "/legal-documents",
  validate(LegalDocumentSchema),
  ManufacturerController.addLegalDocument
);

router.put(
  "/profile",
  validate(OnboardingSchema.partial()),
  ManufacturerController.updateProfile
);

router.get("/profile", ManufacturerController.getProfile);

// Admin only route
router.patch(
  "/toggle-staff-review",
  authorizeRoles([Role.MANUFACTURER, "ADMIN"]), // Add admin role check
  ManufacturerController.toggleStaffReview
);

router.post(
  "/verify-gstin",
  authorizeRoles([Role.MANUFACTURER]),
  ManufacturerController.verifyGstin
);
export default router;
