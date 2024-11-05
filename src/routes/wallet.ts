import express from "express";
import { check } from "express-validator";
import { getLoginUser } from "../controllers/users";
import {
  createWalletValidation,
  fundWalletValidation,
  registerValidation,
  validate,
  withdrawFundWalletValidation,
} from "../utils/validation";
import { verifyToken } from "../middleware/auth";
import { createWallet, fundWallet, withdrawFunds } from "../controllers/wallet";

const router = express.Router();

router.post(
  "/create",
  createWalletValidation(),
  validate,
  verifyToken,
  createWallet
);

router.patch(
  "/fund",
  fundWalletValidation(),
  validate,
  verifyToken,
  fundWallet
);

router.patch(
  "/withdraw",
  withdrawFundWalletValidation(),
  validate,
  verifyToken,
  withdrawFunds
);

export default router;
