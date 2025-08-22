const express = require("express");
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  getAllAdmins,
  updateAdmin,
  deleteAdmin,
} = require("../controllers/adminController");
const { protect, superadmin } = require("../middlewares/adminAuth");

// Public routes
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

// Protected routes
router.get("/", protect, superadmin, getAllAdmins);
router.put("/:id", protect, updateAdmin);
router.delete("/:id", protect, superadmin, deleteAdmin);

module.exports = router;
