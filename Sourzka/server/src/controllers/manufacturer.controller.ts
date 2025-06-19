// controllers/UserController.ts
import { NextFunction, Request, Response } from "express";
import { ManufacturerService } from "../services/manufacturer.service";
import { UnauthorizedError } from "../lib/errors";

export class ManufacturerController {
  static async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const user = await ManufacturerService.signup(data);
      res.status(201).json({ data: user });
    } catch (err) {
      next(err);
    }
  }
  static async signin(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const result = await ManufacturerService.signin(data);
      res.status(200).json({ data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getUserByEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.params;
      const user = await ManufacturerService.getUserByEmail(email);
      res.status(200).json({ data: user });
    } catch (err) {
      next(err);
    }
  }

  static async onboard(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req.user);
      if (!req.user?.manufacturerId) {
        throw new UnauthorizedError("Manufacturer ID not found in token");
      }

      const data = req.body;
      const manufacturer = await ManufacturerService.onboard(
        req.user.manufacturerId,
        data
      );
      res.status(200).json({ data: manufacturer });
    } catch (err) {
      next(err);
    }
  }

  static async addLegalDocument(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.user?.manufacturerId || !req.user?.userId) {
        throw new UnauthorizedError("Required IDs not found in token");
      }

      const document = await ManufacturerService.addLegalDocument(
        req.user.manufacturerId,
        req.user.userId,
        req.body
      );
      res.status(201).json({ data: document });
    } catch (err) {
      next(err);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user?.manufacturerId) {
        throw new UnauthorizedError("Manufacturer ID not found in token");
      }

      const manufacturer = await ManufacturerService.updateManufacturerProfile(
        req.user.manufacturerId,
        req.body
      );
      res.status(200).json({ data: manufacturer });
    } catch (err) {
      next(err);
    }
  }

  static async toggleStaffReview(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.user?.manufacturerId) {
        throw new UnauthorizedError("Manufacturer ID not found in token");
      }

      const manufacturer = await ManufacturerService.toggleStaffReviewStatus(
        req.user.manufacturerId
      );
      res.status(200).json({ data: manufacturer });
    } catch (err) {
      next(err);
    }
  }

  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user?.manufacturerId) {
        throw new UnauthorizedError("Manufacturer ID not found in token");
      }

      const profile = await ManufacturerService.getFullProfile(
        req.user.manufacturerId
      );
      res.status(200).json({ data: profile });
    } catch (err) {
      next(err);
    }
  }

 static async verifyGstin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { gstin } = req.body;
    // @ts-ignore — assuming user info is attached by middleware
    const userId = req.user?.id;

    if (!gstin) {
      res.status(400).json({ success: false, message: "GSTIN is required." });
      return;
    }

    if (!userId) {
      res.status(401).json({ success: false, message: "User not authenticated." });
      return;
    }

    const result = await ManufacturerService.verifyAndStoreGstinDetails(userId, gstin);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message,
        data: { name: result.name },
      });
    } else {
      if (result.message.includes("not found for the provided GSTIN")) {
        res.status(404).json({ success: false, message: result.message });
      } else if (result.message.includes("Manufacturer profile not found")) {
        res.status(404).json({ success: false, message: result.message });
      } else {
        res.status(500).json({ success: false, message: result.message });
      }
    }
  } catch (error) {
    next(error);
  }
}

}
