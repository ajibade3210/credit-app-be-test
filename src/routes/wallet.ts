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
import {
  createWallet,
  deleteUserWallet,
  fundWallet,
  withdrawFunds,
} from "../controllers/wallet";

const router = express.Router();

router.post(
  "/create",
  createWalletValidation(),
  validate,
  verifyToken,
  createWallet
);

router.post("/fund", fundWalletValidation(), validate, verifyToken, fundWallet);

router.post(
  "/withdraw",
  withdrawFundWalletValidation(),
  validate,
  verifyToken,
  withdrawFunds
);

router.delete("/:userId/:type", verifyToken, deleteUserWallet);

export default router;
