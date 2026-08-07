import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
} from "../controllers/CartController.js";

import auth from "../middleware/auth.js";
import validate from "../middleware/validate.js";

import {
  addToCartSchema,
  updateCartSchema,
} from "../validations/CartValidation.js";

const router = express.Router();

router.use(auth);

router.get("/", getCart);

router.post(
  "/",
  validate(addToCartSchema),
  addToCart
);

router.put(
  "/:productId",
  validate(updateCartSchema),
  updateCartItem
);

router.delete("/:productId", removeCartItem);

export default router;