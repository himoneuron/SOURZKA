// services/manufacturer.service.ts
import { UserService } from "./User.service";
import type { SigninInput, SignupInput } from "../schemas/user.schemas";
import type {
  OnboardingInput,
  LegalDocumentInput,
} from "../schemas/manufacturer.schema";
import { NotFoundError, ForbiddenError } from "../lib/errors";
import { prisma } from "../lib/prisma";
import { Role } from "../../generated/prisma";

export class ManufacturerService extends UserService {
  
  static async verifyAndStoreGstinDetails(userId: string, gstin: string): Promise<{ success: boolean; message: string; name?: string }> {
  try {
    // TODO: Replace with actual GSTIN verification logic
    const verifiedName = "Sample Manufacturer Pvt Ltd"; // e.g., from external API

    const manufacturer = await prisma.manufacturer.findUnique({
      where: { userId },
    });

    if (!manufacturer) {
      return {
        success: false,
        message: "Manufacturer profile not found.",
      };
    }

    // Save GSTIN and verified name
    await prisma.manufacturer.update({
      where: { userId },
      data: {
        gstin,
        verifiedGstName: verifiedName,
        gstinVerifiedAt: new Date(),
        isVerified: true,
      },
    });

    return {
      success: true,
      message: "GSTIN verified and stored successfully.",
      name: verifiedName,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Unknown error occurred.",
    };
  }
}




  static async signup(data: SignupInput) {
    const user = await this.createUser(data, Role.MANUFACTURER);

    // Create the manufacturer profile
    const manufacturer = await prisma.manufacturer.create({
      data: {
        userId: user.id,
        companyName: data.name || "",
        isVerified: false,
      },
    });

    return { id: user.id, email: user.email, manufacturerId: manufacturer.id };
  }

  static async signin(data: SigninInput) {
    const user = await this.validateUser(data.email, data.password);

    // Verify the user is a manufacturer
    if (user.role !== Role.MANUFACTURER) {
      throw new NotFoundError("Manufacturer not found");
    }

    const token = this.generateAuthToken({
      id: user.id,
      email: user.email,
      role: user.role,
      manufacturerId: user.manufacturer?.id,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
  static async getManufacturerProfile(userId: string) {
    const manufacturer = await prisma.manufacturer.findUnique({
      where: { userId },
      include: {
        user: true,
        products: true,
      },
    });

    if (!manufacturer) {
      throw new NotFoundError("Manufacturer profile not found");
    }

    return manufacturer;
  }

  static async onboard(manufacturerId: string, data: OnboardingInput) {
    const manufacturer = await prisma.manufacturer.findUnique({
      where: { id: manufacturerId },
    });

    if (!manufacturer) {
      throw new NotFoundError("Manufacturer not found");
    }

    const updatedManufacturer = await prisma.manufacturer.update({
      where: { id: manufacturerId },
      data: {
        companyName: data.companyName,
        factoryDetails: data.factoryDetails,
        keywords: data.keywords || [],
        certificates: data.certificates || [],
        gallery: data.gallery || [],
        introVideo: data.introVideo,
      },
    });

    return updatedManufacturer;
  }

  static async addLegalDocument(
    manufacturerId: string,
    uploaderId: string,
    data: LegalDocumentInput
  ) {
    const manufacturer = await prisma.manufacturer.findUnique({
      where: { id: manufacturerId },
    });

    if (!manufacturer) {
      throw new NotFoundError("Manufacturer not found");
    }

    const document = await prisma.legalDocument.create({
      data: {
        ...data,
        uploaderId,
        manufacturerId,
      },
    });

    return document;
  }

  static async updateManufacturerProfile(
    manufacturerId: string,
    data: Partial<OnboardingInput>
  ) {
    const manufacturer = await prisma.manufacturer.findUnique({
      where: { id: manufacturerId },
    });

    if (!manufacturer) {
      throw new NotFoundError("Manufacturer not found");
    }

    const updatedManufacturer = await prisma.manufacturer.update({
      where: { id: manufacturerId },
      data,
    });

    return updatedManufacturer;
  }

  static async toggleStaffReviewStatus(manufacturerId: string) {
    const manufacturer = await prisma.manufacturer.findUnique({
      where: { id: manufacturerId },
    });

    if (!manufacturer) {
      throw new NotFoundError("Manufacturer not found");
    }

    const updatedManufacturer = await prisma.manufacturer.update({
      where: { id: manufacturerId },
      data: {
        isViewedByStaff: !manufacturer.isViewedByStaff,
      },
    });

    return updatedManufacturer;
  }

  static async getFullProfile(manufacturerId: string) {
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
        legalDocuments: true,
        products: {
          select: {
            id: true,
            name: true,
            isPaused: true,
          },
        },
      },
    });

    if (!manufacturer) {
      throw new NotFoundError("Manufacturer not found");
    }

    return manufacturer;
  }
}
