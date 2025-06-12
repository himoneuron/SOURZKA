// services/manufacturer.service.ts
import { UserService } from "./user.service";
import type { SigninInput, SignupInput } from "../schemas/user.schemas";
import { NotFoundError } from "../lib/errors";
import { prisma } from "../lib/prisma";
import { Role } from "../../generated/prisma";

export class ManufacturerService extends UserService {
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

    const token = this.generateAuthToken(user);

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
}
