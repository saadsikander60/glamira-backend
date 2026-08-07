import express from "express";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/OrderController.js";

import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";
import validate from "../middleware/validate.js";

import {
  createOrderSchema,
  updateOrderStatusSchema,
} from "../validations/OrderValidation.js";

const router = express.Router();

router.post(
  "/",
  auth,
  validate(createOrderSchema),
  createOrder
);

router.get("/my-orders", auth, getMyOrders);

router.get("/", auth, admin, getAllOrders);

router.put(
  "/:id/status",
  auth,
  admin,
  validate(updateOrderStatusSchema),
  updateOrderStatus
);

export default router;