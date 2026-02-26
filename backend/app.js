// Core Module
const path = require("path");

// env module
require("dotenv").config();

// External Module
const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");

// Local Modules
const rootDir = require("./utils/pathUtil");
const errorsController = require("./controllers/errors");

const authApiRouter = require("./routes/api/auth.api");
const storeApiRouter = require("./routes/api/store.api");
const hostApiRouter = require("./routes/api/host.api");
const paymentApiRouter = require("./routes/api/payment.api");

const app = express();

// For any proxy setup (like Nginx), trust the first proxy
app.set("trust proxy", 1);

// Middlewares
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://backend-staynight.onrender.com",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Static
app.use(express.static(path.join(rootDir, "public")));
app.use("/uploads", express.static(path.join(rootDir, "uploads")));

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// Routes
app.use("/api/auth", authApiRouter);
app.use("/api/payment", paymentApiRouter);
app.use("/api/store", storeApiRouter);
app.use("/api/host", hostApiRouter);

// 404
app.use(errorsController.pageNotFound);

module.exports = app;