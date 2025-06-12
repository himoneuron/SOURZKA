import { PrismaClient } from "../../generated/prisma";

export const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"], // Enable logging for debugging
  errorFormat: "minimal", // Use minimal error format for better performance
});
