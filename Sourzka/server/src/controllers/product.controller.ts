import { Request, Response, NextFunction } from "express";
import { ProductService } from "../services/product.service";
import { NotFoundError, UnauthorizedError } from "../lib/errors";
import { prisma } from "../lib/prisma";

export class ProductController {
  static async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new Error("User not authenticated");

      // Get the manufacturer ID for the authenticated user
      const manufacturer = await prisma.manufacturer.findUnique({
        where: { userId: req.user.userId },
      });

      if (!manufacturer) {
        throw new NotFoundError("Manufacturer profile not found");
      }

      const product = await ProductService.createProduct(
        manufacturer.id,
        req.body
      );

      res.status(201).json({ data: product });
    } catch (error) {
      next(error);
    }
  }

  static async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new Error("User not authenticated");

      const manufacturer = await prisma.manufacturer.findUnique({
        where: { userId: req.user.userId },
        select: { isVerified: true, id: true },
      });

      if (!manufacturer) {
        throw new NotFoundError("Manufacturer profile not found");
      }

      const { productId } = req.params;
      const product = await ProductService.updateProduct(
        manufacturer.id,
        manufacturer.isVerified,
        productId,
        req.body
      );

      res.json({ data: product });
    } catch (error) {
      next(error);
    }
  }

  static async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new Error("User not authenticated");

      const manufacturer = await prisma.manufacturer.findUnique({
        where: { userId: req.user.userId },
      });

      if (!manufacturer) {
        throw new NotFoundError("Manufacturer profile not found");
      }

      const { productId } = req.params;
      const result = await ProductService.deleteProduct(
        manufacturer.id,
        productId
      );

      res.json({ data: result });
    } catch (error) {
      next(error);
    }
  }

  static async toggleProductStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.user) throw new Error("User not authenticated");

      const manufacturer = await prisma.manufacturer.findUnique({
        where: { userId: req.user.userId },
        select: {
          id: true,
          isVerified: true,
        },
      });

      if (!manufacturer) {
        throw new NotFoundError("Manufacturer profile not found");
      }

      const { productId } = req.params;
      const product = await ProductService.toggleProductStatus(
        manufacturer.id,
        manufacturer.isVerified,
        productId
      );

      res.json({ data: product });
    } catch (error) {
      next(error);
    }
  }

  static async getProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = req.params;
      const product = await ProductService.getProduct(productId);
      res.json({ data: product });
    } catch (error) {
      next(error);
    }
  }

  static async getManufacturerProducts(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.user) throw new Error("User not authenticated");

      const manufacturer = await prisma.manufacturer.findUnique({
        where: { userId: req.user.userId },
      });

      if (!manufacturer) {
        throw new NotFoundError("Manufacturer profile not found");
      }

      const products = await ProductService.getManufacturerProducts(
        manufacturer.id
      );
      res.json({ data: products });
    } catch (error) {
      next(error);
    }
  }
}
