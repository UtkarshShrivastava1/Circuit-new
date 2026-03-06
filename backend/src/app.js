const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const routes = require("./routes");

const app = express();

// ------------------------------------------------------------
// MIDDLEWARE
// ------------------------------------------------------------

// Security Headers
app.use(helmet());

// CORS Configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
}));

// HTTP Request Logger
app.use(morgan("dev"));

// Response Compression
app.use(compression());

// Body Parsers
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ------------------------------------------------------------
// ROUTES
// ------------------------------------------------------------
app.use("/", routes);

// ------------------------------------------------------------
// ERROR HANDLING
// ------------------------------------------------------------

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    status: "error",
    message: `Route not found: ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Log error for debugging
  console.error(`[Error] ${message}`, err.stack);

  res.status(statusCode).json({
    status: "error",
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
});

module.exports = app;