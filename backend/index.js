import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import MongoStore from "connect-mongo";
import { createServer } from "http";

import "./config/passport.js";
import "./config/cloudinary.js";
import { setupSocket } from "./config/socket.io.js";

import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";
import sessionRoutes from "./routes/session.route.js";

import httpLogger from "./middleware/httpLogger.js";
import errorHandler from "./middleware/errorHandler.js";
import logger from "./utils/logger.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
setupSocket(httpServer);

const isProduction = process.env.NODE_ENV === "production";
const PORT = process.env.PORT || 3000;

const requiredEnvVars = [
  "MONGO_URI",
  "JWT_SECRET",
  "SESSION_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "CLIENT_URL",
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    logger.fatal(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}
//CORS setup
app.use(
  cors({
    origin: isProduction ? process.env.CLIENT_URL : "http://localhost:5173",
    credentials: true,
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// HTTP request logging
app.use(httpLogger);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProduction ? 200 : 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
      ttl: 24 * 60 * 60,
    }),
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// Auth & parsing
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    mongo:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

app.use("/auth", authRoutes);
app.use("/user", profileRoutes);
app.use("/session", sessionRoutes);

app.use(errorHandler);

process.on("unhandledRejection", (reason) => {
  logger.fatal({ reason }, "Unhandled Promise Rejection");
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  logger.fatal(err, "Uncaught Exception");
  process.exit(1);
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    logger.info("MongoDB connected successfully");

    httpServer.listen(PORT, () => {
      logger.info(`Server (HTTP + WebSocket) running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.fatal(err, "MongoDB connection error");
    process.exit(1);
  });
