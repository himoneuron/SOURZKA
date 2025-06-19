import { Router } from "express";
import { AdminController } from "../controllers/admin.controller";
import { authorizeAdmin } from "../middlewares/auth.middleware";
import { validate } from "../lib/validate";
import {
  AdminLoginSchema,
  ManufacturerVerificationSchema,
} from "../schemas/admin.schema";

const router = Router();

// Public route for admin login
router.post("/login", validate(AdminLoginSchema), AdminController.login);

// Ensure only admin roles can access these routes
router.use(authorizeAdmin(["SUPERADMIN", "STAFF"]));

// Get all manufacturers with filters
router.get("/manufacturers", AdminController.getManufacturers);

// Get specific manufacturer details
router.get(
  "/manufacturers/:manufacturerId",
  AdminController.getManufacturerDetails
);

// Toggle manufacturer verification
router.patch(
  "/manufacturers/:manufacturerId/verify",
  validate(ManufacturerVerificationSchema),
  AdminController.setManufacturerVerification
);

export default router;
