const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const routes = require("./routes");
const authRoutes = require("./routes/auth.routes");
const memberRoutes = require("./routes/member.routes");
const projectRoutes = require("./routes/project.routes");
const taskRoutes = require("./routes/task.routes");
const leaveRoutes = require("./routes/leave.routes");
const holidayRoutes = require("./routes/holiday.routes");
const leavePolicyRoutes = require("./routes/leavePolicy.routes");
const notificationRoutes = require("./routes/notification.routes");
const cookieParser = require("cookie-parser");

const app = express();

// ------------------------------------------------------------
// MIDDLEWARE
// ------------------------------------------------------------

// Security Headers
app.use(helmet());

// CORS Configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
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
app.use(cookieParser());

// ------------------------------------------------------------
// ROUTES
// ------------------------------------------------------------
app.use("/", routes);
app.use("/api/auth", authRoutes);
app.use("/api", memberRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/projects", projectRoutes);  
app.use("/api", leaveRoutes);
app.use("/api", holidayRoutes);
app.use("/api", leavePolicyRoutes);
app.use("/api", notificationRoutes);
// Define a simple GET API endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

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