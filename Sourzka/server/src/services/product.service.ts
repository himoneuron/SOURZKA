import { prisma } from "../lib/prisma";
import {
  NotFoundError,
  ForbiddenError,
  EntityConflict,
  UnauthorizedError,
} from "../lib/errors";
import {
  CreateProductInput,
  UpdateProductInput,
} from "../schemas/product.schema";

// export interface CreateProductInput {
//   name: string;
//   description: string;
//   baseUnit: string;
//   unitPrice: number;
//   deliveryTimeDays: number;
//   tags: string[];
//   mediaUrls: string[];
//   specSheetUrl?: string;
// }

export class ProductService {
  static async createProduct(manufacturerId: string, data: CreateProductInput) {
    const manufacturer = await prisma.manufacturer.findUnique({
      where: { id: manufacturerId },
    });

    if (!manufacturer) {
      throw new NotFoundError("Manufacturer not found");
    }
    // check if product slug already exists for the manufacturer
    const existingProduct = await prisma.product.findFirst({
      where: { slug: data.slug, manufacturerId },
    });

    if (existingProduct) {
      throw new EntityConflict("Product with this slug already exists");
    }
    const product = await prisma.product.create({
      data: {
        ...data,
        manufacturerId,
      },
    });

    return product;
  }

  static async updateProduct(
    manufacturerId: string,
    isVerified: boolean,
    productId: string,
    data: UpdateProductInput
  ) {
    // First verify the product belongs to the manufacturer
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    if (product.manufacturerId !== manufacturerId) {
      throw new ForbiddenError("You can only update your own products");
    }

    if (isVerified) {
      throw new UnauthorizedError("Account not verified!");
    }
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data,
    });

    return updatedProduct;
  }

  static async deleteProduct(manufacturerId: string, productId: string) {
    // First verify the product belongs to the manufacturer
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    if (product.manufacturerId !== manufacturerId) {
      throw new ForbiddenError("You can only delete your own products");
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    return { message: "Product deleted successfully" };
  }

  static async toggleProductStatus(
    manufacturerId: string,
    isVerified: boolean,
    productId: string
  ) {
    // First verify the product belongs to the manufacturer
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    if (product.manufacturerId !== manufacturerId) {
      throw new ForbiddenError("You can only update your own products");
    }
    if (!isVerified) {
      throw new UnauthorizedError("Account not verified!");
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        isPaused: !product.isPaused,
      },
    });

    return updatedProduct;
  }

  static async getProduct(productId: string) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        manufacturer: {
          select: {
            companyName: true,
            isVerified: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    return product;
  }
  static async getManufacturerProducts(manufacturerId: string) {
    return prisma.product.findMany({
      where: { manufacturerId },
      orderBy: { createdAt: "desc" },
    });
  }
}
