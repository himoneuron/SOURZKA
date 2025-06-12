import dotenv from "dotenv";
dotenv.config();
export const config = {
  PORT: process.env.PORT || 7000,
  JWT_SECRET: process.env.JWT_SECRET || "jwt-secret",
  SALT_ROUNDS: 10,
};
