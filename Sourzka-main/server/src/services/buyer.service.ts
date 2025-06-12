// services/buyer.service.ts.ts
import { UserService } from "./user.service";
import type { SigninInput, SignupInput } from "../schemas/user.schemas";
import { NotFoundError } from "../lib/errors";
import { prisma } from "../lib/prisma";
import { Role } from "../../generated/prisma";

export class BuyerService extends UserService {
  static async signup(data: SignupInput) {
    const user = await this.createUser(data, Role.BUYER);

    // Create the buyer profile
    const buyer = await prisma.buyer.create({
      data: {
        userId: user.id,
      },
    });

    return { id: user.id, email: user.email, buyerId: buyer.id };
  }

  static async signin(data: SigninInput) {
    const user = await this.validateUser(data.email, data.password);

    // Verify the user is a buyer
    if (user.role !== Role.BUYER) {
      throw new NotFoundError("buyer not found");
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

  static async getBuyerProfile(userId: string) {
    const buyer = await prisma.buyer.findUnique({
      where: { userId },
      include: {
        user: true,
      },
    });

    if (!buyer) {
      throw new NotFoundError("buyer profile not found");
    }

    return buyer;
  }
}
