import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { validate } from "../lib/validate";
import {
  CreateProductSchema,
  UpdateProductSchema,
} from "../schemas/product.schema";
import { authorizeRoles } from "../middlewares/auth.middleware";
import { Role } from "../../generated/prisma";

const router = Router();

// Create a new product - requires manufacturer auth
router.post(
  "/",
  authorizeRoles([Role.MANUFACTURER as string]),
  validate(CreateProductSchema),
  ProductController.createProduct
);

// Update a product - requires manufacturer auth
router.put(
  "/:productId",
  authorizeRoles([Role.MANUFACTURER as string]),
  validate(UpdateProductSchema),
  ProductController.updateProduct
);

// Delete a product - requires manufacturer auth
router.delete(
  "/:productId",
  authorizeRoles([Role.MANUFACTURER as string]),
  ProductController.deleteProduct
);

// Toggle product status - requires manufacturer auth
router.patch(
  "/:productId/toggle-status",
  authorizeRoles([Role.MANUFACTURER as string]),
  ProductController.toggleProductStatus
);

// Get a single product - public access
router.get(
  "/:productId",
  authorizeRoles([Role.MANUFACTURER, Role.BUYER]),
  ProductController.getProduct
);

// Get manufacturer's products - requires manufacturer auth
router.get(
  "/manufacturer/products",
  authorizeRoles([Role.MANUFACTURER as string]),
  ProductController.getManufacturerProducts
);

export default router;
