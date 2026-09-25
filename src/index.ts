import "./loadEnv"; 
import path from "path";
import authRoutes from "./routes/authRoutes";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import listingRoutes from "./routes/listingRoutes";
import uploadRoutes from "./routes/uploadRoutes";
dotenv.config({ path: path.resolve(__dirname, "../.env") });
connectDB();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/upload", uploadRoutes);
app.get("/", (req, res) => {
  res.send("Quicklist backend is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
