// services/user.service.ts
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import { config } from "../config";
import { GenerateJwt } from "../lib/utils";
import { SignupInput } from "../schemas/user.schemas";
import { Role } from "../../generated/prisma";
import {
  EntityConflict,
  NotFoundError,
  UnauthorizedError,
} from "../lib/errors";

export class UserService {
  protected static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, config.SALT_ROUNDS);
  }

  protected static async validatePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  protected static async createUser(data: SignupInput, role: Role) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) throw new EntityConflict("Email already in use");

    const hashedPassword = await this.hashPassword(data.password);

    const newUser = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role,
      },
    });

    return newUser;
  }

  protected static async validateUser(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { manufacturer: true, buyer: true },
    });
    if (!user) throw new NotFoundError("User not found");

    const isPasswordValid = await this.validatePassword(
      password,
      user.password
    );
    if (!isPasswordValid) throw new UnauthorizedError("Invalid credentials");
    console.log("User validated:", user);
    return user;
  }

  protected static generateAuthToken(user: {
    id: string;
    email: string;
    role: Role;
    manufacturerId?: string;
    buyerId?: string;
  }) {
    return GenerateJwt({
      userId: user.id,
      email: user.email,
      role: user.role,
      manufacturerId: user.manufacturerId,
      buyerId: user.buyerId,
    });
  }

  static async getUserByEmail(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundError("User not found");
    return user;
  }

  static async deleteUserByEmail(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundError("User not found");
    await prisma.user.delete({ where: { email } });
    return { message: "User deleted successfully" };
  }
}
