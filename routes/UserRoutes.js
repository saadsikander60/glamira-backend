import express from "express";
import {
  registerUser,
  loginUser,
} from "../controllers/UserController.js";

import validate from "../middleware/validate.js";

import {
  registerUserSchema,
  loginUserSchema,
} from "../validations/UserValidation.js";

const router = express.Router();

router.post("/register", validate(registerUserSchema), registerUser);
router.post("/login", validate(loginUserSchema), loginUser);

export default router;