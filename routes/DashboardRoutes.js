import express from "express";

import {
  getDashboardStats,
} from "../controllers/DashboardController.js";


import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";


const router = express.Router();


router.get(
  "/",
  auth,
  admin,
  getDashboardStats
);


export default router;