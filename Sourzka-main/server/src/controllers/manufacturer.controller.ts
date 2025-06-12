// controllers/UserController.ts
import { NextFunction, Request, Response } from "express";
import { ManufacturerService } from "../services/manufacturer.service";
export class ManufacturerController {
  static async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const user = await ManufacturerService.signup(data);
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  }
  static async signin(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const result = await ManufacturerService.signin(data);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  static async getUserByEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.params;
      const user = await ManufacturerService.getUserByEmail(email);
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }
}
