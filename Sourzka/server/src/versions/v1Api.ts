import { Router } from "express";
import manufacturerRouter from "../routes/manufacturer.routes";
import buyerRouter from "../routes/buyer.routes";
import productRouter from "../routes/product.routes";
import adminRouter from "../routes/admin.routes";

const V1 = Router();

V1.use("/manufacturer", manufacturerRouter);
V1.use("/buyer", buyerRouter);
V1.use("/products", productRouter);
V1.use("/admin", adminRouter);

V1.get("/", (req, res) => {
  res.send("hello");
});

export default V1;
