import jwt from "jsonwebtoken";
import { config } from "../config";
interface JwtPayload {
  userId: string;
  role: string;
  email: string;
}
export const VerifyJwt = (token: string): JwtPayload => {
  const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
  return decoded;
};
export const GenerateJwt = ({ userId, email, role }: JwtPayload): string => {
  const token = jwt.sign({ userId, email, role }, config.JWT_SECRET, {
    expiresIn: "14d",
  });
  return token;
};
