import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import menuRoutes from "./routes/menu";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI as string;

app.use(cors());
app.use(express.json());

// Health check route
app.get("/health", (_req: Request, res: Response) =>
  res.json({ status: "ok", message: "Server is healthy" })
);

// API routes
app.use("/api/menu", menuRoutes);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`MongoDB connected to ${MONGO_URI}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
