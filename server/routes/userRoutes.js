const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getAllUsers,    // ✅ Changed from getUsers to getAllUsers
  getProfile,     // ✅ Changed from getUserProfile to getProfile
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { protect, admin } = require("../middlewares/authMiddleware");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/", protect, admin, getAllUsers);    // ✅ Updated function name
router.get("/me", protect, getProfile);          // ✅ Updated function name
router.put("/:id", protect, updateUser);
router.delete("/:id", protect, admin, deleteUser);

module.exports = router;