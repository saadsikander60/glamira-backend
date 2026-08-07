import express from "express";
import {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
} from "../controllers/ReviewController.js";

import auth from "../middleware/auth.js";
import validate from "../middleware/validate.js";

import {
  createReviewSchema,
  updateReviewSchema,
} from "../validations/ReviewValidation.js";

const router = express.Router();

router.get("/product/:productId", getProductReviews);

router.post(
  "/",
  auth,
  validate(createReviewSchema),
  createReview
);

router.put(
  "/:id",
  auth,
  validate(updateReviewSchema),
  updateReview
);

router.delete("/:id", auth, deleteReview);

export default router;