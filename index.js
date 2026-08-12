import express from "express";
import cors from "cors";
import http from "http";
import "dotenv/config";
import connectDB from "./config/db.js";
import { initSocket } from "./socket/index.js";

import userRoutes from "./routes/UserRoutes.js";
import productRoutes from "./routes/ProductRoutes.js";
import categoryRoutes from "./routes/CategoryRoutes.js";
import cartRoutes from "./routes/CartRoutes.js";
import orderRoutes from "./routes/OrderRoutes.js";
import reviewRoutes from "./routes/ReviewRoutes.js";
import addressRoutes from "./routes/AddressRoutes.js";
import contactRoutes from "./routes/ContactRoutes.js";
import dashboardRoutes from "./routes/DashboardRoutes.js";
import chatRoutes from "./routes/ChatRoutes.js";

connectDB();

const app = express();
const server = http.createServer(app);

initSocket(server);

app.use(
  cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true,
  })
);
app.use(express.json());

// API Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/addresses", addressRoutes);
app.use("/api/v1/contact", contactRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/chat", chatRoutes);

app.get("/", (req, res) => {
  res.send("Glamira Essence API is running");
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
