// packages imports
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { db } from "@config/db.config";
import { usersTable } from "@db/schema/users";
// shard imports
import { globalError, AppError } from "@shared/index";

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
app.get("/api/v1/health", async (req: Request, res: Response) => {
  console.log("Health check requested");
  try {
    const users = await db.select().from(usersTable);
    res.status(200).json({
      status: "success",
      message: "Server is healthy",
      users: users, // Just return count to avoid large response
    });
  } catch (error: any) {
    console.error("Health check failed:", error);
    res.status(500).json({
      status: "error",
      message: "Database connection failed",
      error: error.message,
    });
  }
});

// app.use("/", async (req: Request, res: Response) => {
//   await db.insert(usersTable).values({
//     name: "John Doe",
//     email: "john.doe@example.com",
//     profileImage: "https://example.com/avatars/john.jpg",
//     roles: ["user"], // This will use the default
//     recoveryEmail: "john.recovery@example.com",
//     isVerified: false, // This will use the default
//     emailVerifiedAt: null,
//     emailVerificationToken: "abc123token456",
//     emailVerificationSentAt: new Date(),
//     emailVerificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
//     isActive: true, // This will use the default
//   });
//   res.status(200).json({
//     status: "success",
//     message: "Server is healthy",
//     accessToken: "1234567890",
//     refreshToken: "0987654321",
//   });
// });

app.use("/health", async (req: Request, res: Response) => {
  console.log("am I healthy?");
  const users = await db.select().from(usersTable);
  res
    .status(200)
    .json({ status: "success", message: "Server is healthy", users });
});

// Error handling middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(globalError);

export default app;
