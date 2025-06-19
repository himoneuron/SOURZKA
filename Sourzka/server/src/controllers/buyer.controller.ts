// controllers/UserController.ts
import { NextFunction, Request, Response } from "express";
import { BuyerService } from "../services/buyer.service";
export class BuyerController {
  static async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const user = await BuyerService.signup(data);
      res.status(201).json({ data: user });
    } catch (err) {
      next(err);
    }
  }
  static async signin(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const result = await BuyerService.signin(data);
      res.status(200).json({ data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getUserByEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.params;
      const user = await BuyerService.getUserByEmail(email);
      res.status(200).json({ data: user });
    } catch (err) {
      next(err);
    }
  }
}
