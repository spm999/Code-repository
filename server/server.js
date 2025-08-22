// const express = require("express");
// const bodyParser = require("body-parser"); // optional, express.json() is enough
// const cors = require("cors");
// const db = require("./utils/database.js"); // make sure this exports a valid connection
// const userRoutes = require("./routes/userRoutes"); // your User routes

// const app = express();

// // ✅ Database check (optional)
// console.log("DB connection:", db);

// // ✅ Middleware
// app.use(cors()); // Enable CORS
// app.use(express.json()); // Parse JSON bodies
// // app.use(bodyParser.urlencoded({ extended: true })); // optional, for form data

// // Handle preflight requests for all routes
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//   );
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

//   if (req.method === "OPTIONS") {
//     return res.sendStatus(200);
//   }
//   next();
// });

// // ✅ Mount user routes
// app.use("/api/users", userRoutes);


// // ✅ Health check
// app.get("/", (req, res) => {
//   res.send("🚀 Centralized Code Repository API running...");
// });

// // ✅ Start server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });










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



// const express = require("express");
// const cors = require("cors");
// const connectDB = require("./utils/database"); // ✅ Import the connection function
// const userRoutes = require("./routes/userRoutes");
// const adminRoutes = require("./routes/adminRoutes");
// const codeRoutes = require("./routes/codeRoutes"); // ✅ Import code routes

// const app = express();

// // ✅ Middleware
// app.use(cors());
// app.use(express.json({ limit: '10mb' })); // Increase limit for file uploads
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // Handle preflight requests
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//   );
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Disposition");

//   if (req.method === "OPTIONS") {
//     return res.sendStatus(200);
//   }
//   next();
// });

// // ✅ Mount routes
// app.use("/api/users", userRoutes);
// app.use("/api/admins", adminRoutes);
// app.use("/api/code", codeRoutes); // ✅ Mount code routes

// // ✅ Serve static files from uploads (if needed)
// app.use('/uploads', express.static('uploads'));

// // ✅ Health check
// app.get("/", (req, res) => {
//   res.send("🚀 Centralized Code Repository API running...");
// });

// // ✅ Error handling middleware
// app.use((error, req, res, next) => {
//   console.error(error);
//   res.status(error.status || 500).json({
//     success: false,
//     message: error.message || "Internal Server Error",
//   });
// });

// // ✅ 404 handler
// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: "API endpoint not found",
//   });
// });

// // ✅ Connect to MongoDB and start server
// const startServer = async () => {
//   try {
//     await connectDB(); // ✅ Connect to database first
//     const PORT = process.env.PORT || 3000;
//     app.listen(PORT, () => {
//       console.log(`🚀 Server is running on port ${PORT}`);
//       console.log(`📁 API endpoints:`);
//       console.log(`   Users: http://localhost:${PORT}/api/users`);
//       console.log(`   Admins: http://localhost:${PORT}/api/admins`);
//       console.log(`   Code: http://localhost:${PORT}/api/code`);
//     });
//   } catch (error) {
//     console.error('Failed to start server:', error);
//     process.exit(1);
//   }
// };

// // Handle unhandled promise rejections
// process.on('unhandledRejection', (err) => {
//   console.log('UNHANDLED REJECTION! 💥 Shutting down...');
//   console.log(err.name, err.message);
//   process.exit(1);
// });

// // Handle uncaught exceptions
// process.on('uncaughtException', (err) => {
//   console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
//   console.log(err.name, err.message);
//   process.exit(1);
// });

// startServer();













