// routes/userRoutes.ts
import { Router } from "express";
import { validate } from "../lib/validate";
import { SigninSchema, SignupSchema } from "../schemas/user.schemas";
import { BuyerController } from "../controllers/buyer.controller";

const router = Router();

router.post("/signup", validate(SignupSchema), BuyerController.signup);
router.post("/signin", validate(SigninSchema), BuyerController.signin);

export default router;
