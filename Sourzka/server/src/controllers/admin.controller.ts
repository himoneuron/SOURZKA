import { Request, Response, NextFunction } from "express";
import { AdminService } from "../services/admin.service";
import {
  ManufacturerQueryInput,
  AdminLoginInput,
  ManufacturerVerificationInput,
} from "../schemas/admin.schema";
import { GenerateJwt } from "../lib/utils";

export class AdminController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body as AdminLoginInput;
      const admin = await AdminService.loginAdmin(email, password);
      const token = GenerateJwt({
        userId: admin.id,
        email: admin.email,
        role: admin.role,
      });

      res.json({ token, admin });
    } catch (err) {
      next(err);
    }
  }
  static async getManufacturers(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const queryParams: ManufacturerQueryInput = {
        verified:
          req.query.verified === "true"
            ? true
            : req.query.verified === "false"
            ? false
            : undefined,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        search: (req.query.search as string) || undefined,
        isViewedByStaff:
          req.query.isViewedByStaff === "true"
            ? true
            : req.query.isViewedByStaff === "false"
            ? false
            : undefined,
      };

      const result = await AdminService.getManufacturers(queryParams);
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  }
  static async setManufacturerVerification(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { manufacturerId } = req.params;
      const verificationData = req.body as ManufacturerVerificationInput;
      const manufacturer = await AdminService.setManufacturerVerification(
        manufacturerId,
        verificationData
      );
      res.json(manufacturer);
    } catch (err) {
      next(err);
    }
  }

  static async getManufacturerDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { manufacturerId } = req.params;
      const manufacturer = await AdminService.getManufacturerDetails(
        manufacturerId
      );
      res.json({ data: manufacturer });
    } catch (err) {
      next(err);
    }
  }
}
