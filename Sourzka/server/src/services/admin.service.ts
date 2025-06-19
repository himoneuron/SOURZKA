import { prisma } from "../lib/prisma";
import { NotFoundError, UnauthorizedError } from "../lib/errors";
import {
  ManufacturerQueryInput,
  ManufacturerVerificationInput,
} from "../schemas/admin.schema";
import bcrypt from "bcrypt";

export class AdminService {
  private static async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  private static async comparePasswords(
    plaintext: string,
    hashed: string
  ): Promise<boolean> {
    return bcrypt.compare(plaintext, hashed);
  }

  static async createAdmin(data: {
    email: string;
    password: string;
    name: string;
    role: "SUPERADMIN" | "STAFF" | "MODERATOR";
  }) {
    const hashedPassword = await this.hashPassword(data.password);

    const admin = await prisma.admin.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    // Create audit log for admin creation
    await prisma.auditLog.create({
      data: {
        action: "ADMIN_CREATED",
        resource: "Admin",
        resourceId: admin.id,
        metadata: {
          email: admin.email,
          role: admin.role,
        },
      },
    });

    // Remove password from returned data
    const { password, ...adminWithoutPassword } = admin;
    return adminWithoutPassword;
  }
  static async getManufacturers(params: ManufacturerQueryInput) {
    const { verified, page = 1, limit = 10, search, isViewedByStaff } = params;

    const skip = (page - 1) * limit;

    const whereConditions = {} as any;

    if (verified !== undefined) {
      whereConditions.isVerified = verified;
    }

    if (isViewedByStaff !== undefined) {
      whereConditions.isViewedByStaff = isViewedByStaff;
    }

    if (search) {
      whereConditions.OR = [
        { companyName: { contains: search, mode: "insensitive" as const } },
        { factoryDetails: { contains: search, mode: "insensitive" as const } },
        { keywords: { has: search } },
        { user: { email: { contains: search, mode: "insensitive" as const } } },
      ];
    } // Get total count for pagination
    const total = await prisma.manufacturer.count({
      where: whereConditions,
    });

    // Get manufacturers with pagination
    const manufacturers = await prisma.manufacturer.findMany({
      where: whereConditions,
      include: {
        user: {
          select: {
            email: true,
            name: true,
            createdAt: true,
          },
        },
        products: {
          select: {
            id: true,
            name: true,
            isPaused: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: [{ user: { createdAt: "desc" } }],
    });

    return {
      manufacturers,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }
  static async setManufacturerVerification(
    manufacturerId: string,
    verificationData: { isVerified: boolean }
  ) {
    const manufacturer = await prisma.manufacturer.findUnique({
      where: { id: manufacturerId },
    });

    if (!manufacturer) {
      throw new NotFoundError("Manufacturer not found");
    }

    // Update both isVerified and isViewedByStaff based on the verification decision
    const updatedManufacturer = await prisma.manufacturer.update({
      where: { id: manufacturerId },
      data: {
        isVerified: verificationData.isVerified,
        isViewedByStaff: true, // Always mark as viewed when staff takes action
      },
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    // Create audit log for the verification change
    await prisma.auditLog.create({
      data: {
        action: updatedManufacturer.isVerified
          ? "MANUFACTURER_VERIFIED"
          : "MANUFACTURER_REJECTED",
        resource: "Manufacturer",
        resourceId: manufacturerId,
        metadata: {
          manufacturerId,
          companyName: manufacturer.companyName,
          userEmail: updatedManufacturer.user.email,
        },
      },
    });

    return updatedManufacturer;
  }
  static async loginAdmin(email: string, password: string) {
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const isPasswordValid = await this.comparePasswords(
      password,
      admin.password
    );
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid credentials");
    }

    // Log successful login
    await prisma.auditLog.create({
      data: {
        action: "ADMIN_LOGIN",
        resource: "Admin",
        resourceId: admin.id,
        actorAdminId: admin.id,
        metadata: {
          email: admin.email,
          timestamp: new Date().toISOString(),
        },
      },
    });

    // Remove password from returned data
    const { password: _, ...adminWithoutPassword } = admin;
    return adminWithoutPassword;
  }

  static async getManufacturerDetails(manufacturerId: string) {
    const manufacturer = await prisma.manufacturer.findUnique({
      where: { id: manufacturerId },
      include: {
        user: {
          select: {
            email: true,
            name: true,
            createdAt: true,
          },
        },
        products: true,
        legalDocuments: true,
        orders: {
          take: 5,
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!manufacturer) {
      throw new NotFoundError("Manufacturer not found");
    }

    return manufacturer;
  }
}
