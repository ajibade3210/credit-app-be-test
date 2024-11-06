import express from "express";
import { check } from "express-validator";
import { getLoginUser } from "../controllers/users";
import {
  registerValidation,
  transferFundValidation,
  validate,
} from "../utils/validation";
import { verifyToken } from "../middleware/auth";
import {
  getTransactionDetails,
  transferFunds,
} from "../controllers/transaction";

const router = express.Router();

router.post(
  "/",
  transferFundValidation(),
  validate,
  verifyToken,
  transferFunds
);

router.get("/:transferId", verifyToken, getTransactionDetails);

export default router;
