import express from "express";
import upload from "../middleware/upload.js";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/ProductController.js";

import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";
import validate from "../middleware/validate.js";

import {
  createProductSchema,
  updateProductSchema,
} from "../validations/ProductValidation.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);

router.post(
  "/",
  auth,
  admin,
  upload.single("image"),
  createProduct
);

router.put(
  "/:id",
  auth,
  admin,
  upload.single("image"),
  updateProduct
);

router.delete("/:id", auth, admin, deleteProduct);

export default router;