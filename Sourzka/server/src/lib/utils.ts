import jwt from "jsonwebtoken";
import { config } from "../config";
interface JwtPayload {
  userId: string;
  role: string;
  email: string;
  manufacturerId?: string;
  buyerId?: string;
}
export const VerifyJwt = (token: string): JwtPayload => {
  const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
  return decoded;
};
export const GenerateJwt = ({
  userId,
  email,
  role,
  manufacturerId,
  buyerId,
}: JwtPayload): string => {
  const token = jwt.sign(
    { userId, email, role, manufacturerId, buyerId },
    config.JWT_SECRET,
    {
      expiresIn: "14d",
    }
  );
  return token;
};
