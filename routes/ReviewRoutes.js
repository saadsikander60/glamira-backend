import express from "express";
import {
  createReview,
  getProductReviews,
  getAllReviews,
  getMyReviews,
  updateReview,
  deleteReview,
} from "../controllers/ReviewController.js";

import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";
import validate from "../middleware/validate.js";

import {
  createReviewSchema,
  updateReviewSchema,
} from "../validations/ReviewValidation.js";

const router = express.Router();

router.get("/", auth, admin, getAllReviews);
router.get("/my", auth, getMyReviews);
router.get("/product/:productId", getProductReviews);

router.post("/", auth, validate(createReviewSchema), createReview);

router.put("/:id", auth, validate(updateReviewSchema), updateReview);

router.delete("/:id", auth, deleteReview);

export default router;
