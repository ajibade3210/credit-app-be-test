import express from "express";
import { check } from "express-validator";
import { getLoginUser } from "../controllers/users";
import {
  registerValidation,
  transferFundValidation,
  validate,
} from "../utils/validation";
import { verifyToken } from "../middleware/auth";
import { transferFunds } from "../controllers/transaction";

const router = express.Router();

router.post(
  "/",
  transferFundValidation(),
  validate,
  verifyToken,
  transferFunds
);

export default router;
