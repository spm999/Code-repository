


const express = require("express");
const cors = require("cors");
const connectDB = require("./utils/database"); // ✅ Import the connection function
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const codeRoutes = require("./routes/codeRoutes"); // ✅ Import code routes


const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// Handle preflight requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// ✅ Mount routes
app.use("/api/users", userRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/code", codeRoutes); // ✅ Mount code routes

// ✅ Health check
app.get("/", (req, res) => {
  res.send("🚀 Centralized Code Repository API running...");
});


// Add to your server.js or routes
app.get('/api/health/storage', async (req, res) => {
  try {
    const health = await checkStorageHealth();
    res.json({ success: true, data: health });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Storage health check failed' });
  }
});

// ✅ Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectDB(); // ✅ Connect to database first
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};


startServer();



// In your server.js or app.js, add these timeouts:
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
// Increase timeout to 10 minutes (600000 ms)
server.timeout = 600000;
server.keepAliveTimeout = 120000; // 2 minutes
server.headersTimeout = 120000; // 2 minutes
