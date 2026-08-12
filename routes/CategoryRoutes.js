import express from "express";
import upload from "../middleware/upload.js";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/CategoryController.js";

import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";

const router = express.Router();

router.get("/", getCategories);

router.post("/", auth, admin, upload.single("image"), createCategory);

router.put("/:id", auth, admin, upload.single("image"), updateCategory);

router.delete("/:id", auth, admin, deleteCategory);

export default router;
