import { Request, Response, NextFunction } from "express";
import { VerifyJwt } from "../lib/utils";
import { ForbiddenError, UnauthorizedError } from "../lib/errors";
import { prisma } from "../lib/prisma";





// Basic authentication check (assuming you've populated `req.user` via JWT verification or similar)
export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }
  next();
}


// Extend Request interface to include user object
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: string;
        // Additional role-specific IDs
        manufacturerId?: string;
        buyerId?: string;
      };
    }
  }
}

// Verify and extract token
function extractToken(req: Request): string {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new UnauthorizedError("Unauthorized: No token provided");
  }
  return token;
}

// Basic role authorization
function validateRole(role: string, allowedRoles: string[]) {
  if (!allowedRoles.includes(role)) {
    throw new ForbiddenError("Forbidden: Unauthorized access detected");
  }
}

// Admin specific validation
async function validateAdminRole(adminId: string | undefined, role: string) {
  if (!adminId) {
    console.log("admin: ", adminId);
    throw new UnauthorizedError("Invalid admin session");
  }

  const admin = await prisma.admin.findUnique({
    where: { id: adminId },
  });

  if (!admin || admin.role !== role) {
    console.log("admin: ", admin);
    throw new UnauthorizedError("Invalid or expired admin session");
  }

  return admin;
}

// Middleware for admin routes
export function authorizeAdmin(allowedRoles: string[] = ["SUPERADMIN"]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = extractToken(req);
      const decoded = VerifyJwt(token);
      const { userId, role, email } = decoded;

      validateRole(role, allowedRoles);
      await validateAdminRole(userId, role);

      req.user = { userId, role, email };
      next();
    } catch (error) {
      next(error);
    }
  };
}

// Middleware for user routes (buyers and manufacturers)
export function authorizeUser(allowedRoles: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = extractToken(req);
      const decoded = VerifyJwt(token);
      const { userId, role, email, manufacturerId, buyerId } = decoded;

      validateRole(role, allowedRoles);

      // For manufacturer role, validate manufacturer exists
      if (role === "MANUFACTURER" && manufacturerId) {
        const manufacturer = await prisma.manufacturer.findUnique({
          where: { id: manufacturerId },
        });
        if (!manufacturer) {
          throw new UnauthorizedError("Invalid manufacturer session");
        }
      }

      // For buyer role, validate buyer exists
      if (role === "BUYER" && buyerId) {
        const buyer = await prisma.buyer.findUnique({
          where: { id: buyerId },
        });
        if (!buyer) {
          throw new UnauthorizedError("Invalid buyer session");
        }
      }

      req.user = { userId, role, email, manufacturerId, buyerId };
      next();
    } catch (error) {
      next(error);
    }
  };
}

// Legacy authorizeRoles for backward compatibility
export function authorizeRoles(allowedRoles: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = extractToken(req);
      const decoded = VerifyJwt(token);
      const { userId, role, email, manufacturerId, buyerId } = decoded;

      validateRole(role, allowedRoles);

      // Additional validation based on role
      if (["SUPERADMIN", "STAFF", "MODERATOR"].includes(role)) {
        await validateAdminRole(userId, role);
      } else if (role === "MANUFACTURER" && manufacturerId) {
        const manufacturer = await prisma.manufacturer.findUnique({
          where: { id: manufacturerId },
        });
        if (!manufacturer) {
          throw new UnauthorizedError("Invalid manufacturer session");
        }
      } else if (role === "BUYER" && buyerId) {
        const buyer = await prisma.buyer.findUnique({
          where: { id: buyerId },
        });
        if (!buyer) {
          throw new UnauthorizedError("Invalid buyer session");
        }
      }

      req.user = { userId, role, email, manufacturerId, buyerId };
      next();
    } catch (error) {
      next(error);
    }
  };
}
