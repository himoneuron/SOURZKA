import express from "express";
import helmet from "helmet";
import cors from "cors";
import hpp from "hpp";
import V1api from "./versions/v1Api";
import morgan from "morgan";
import { errorHandler } from "./middlewares/error.middleware";
import { limiter } from "./lib/limiter";
// versioning of the API
const app = express();
// Middleware
app.use(helmet()); // Security headers
app.use(limiter);
app.use(cors()); // Enable CORS for all origins
app.use(express.json({ limit: "10mb" })); // Parse JSON bodies and limit the size of incoming requests to prevent DoS attacks
app.use(express.urlencoded({ extended: true, limit: "1mb" })); // Parse URL-encoded bodies and limit the size of incoming requests to prevent DoS attacks
app.use(hpp()); // Prevent HTTP Parameter Pollution
app.use(morgan("combined")); // HTTP request logger middleware for Node.js

app.use("/v1", V1api);

// In Future, might need const v2 = Router();
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});
app.use(errorHandler);

export default app;
