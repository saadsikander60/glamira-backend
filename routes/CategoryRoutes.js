import express from "express";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/CategoryController.js";

import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";
import validate from "../middleware/validate.js";

import {
  createCategorySchema,
  updateCategorySchema,
} from "../validations/CategoryValidation.js";

const router = express.Router();

router.get("/", getCategories);

router.post(
  "/",
  auth,
  admin,
  validate(createCategorySchema),
  createCategory
);

router.put(
  "/:id",
  auth,
  admin,
  validate(updateCategorySchema),
  updateCategory
);

router.delete("/:id", auth, admin, deleteCategory);

export default router;