import express from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUserRole,
  getMe,
  updateMe,
  getMyDashboard,
} from "../controllers/UserController.js";

import validate from "../middleware/validate.js";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";

import {
  registerUserSchema,
  loginUserSchema,
  updateProfileSchema,
} from "../validations/UserValidation.js";

const router = express.Router();

router.post("/register", validate(registerUserSchema), registerUser);
router.post("/login", validate(loginUserSchema), loginUser);

router.get("/me", auth, getMe);
router.put("/me", auth, validate(updateProfileSchema), updateMe);
router.get("/me/dashboard", auth, getMyDashboard);

router.get("/", auth, admin, getAllUsers);
router.get("/:id", auth, admin, getUserById);
router.put("/:id/role", auth, admin, updateUserRole);

export default router;
