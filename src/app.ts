// packages imports
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { container } from "@config/inversify.config";

// shard imports
import { globalError, AppError, TYPES } from "@shared/index";

// Initialize the token generator

const gent = container.get(TYPES.TokenGenerator);
const gnet2 = container.get(TYPES.JWTConfig);
console.log(gent);
console.log(gnet2);
const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use("/", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Server is healthy",
    accessToken: "1234567890",
    refreshToken: "0987654321",
  });
});

app.use("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "success", message: "Server is healthy" });
});
// Error handling middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(globalError);

export default app;
