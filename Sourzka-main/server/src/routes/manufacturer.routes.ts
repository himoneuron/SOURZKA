// routes/userRoutes.ts
import { Router } from "express";
import { validate } from "../lib/validate";
import { SigninSchema, SignupSchema } from "../schemas/user.schemas";
import { ManufacturerController } from "../controllers/manufacturer.controller";

const router = Router();

router.post("/signup", validate(SignupSchema), ManufacturerController.signup);
router.post("/signin", validate(SigninSchema), ManufacturerController.signin);

export default router;
