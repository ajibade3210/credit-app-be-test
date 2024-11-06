import express from "express";
import { check } from "express-validator";
import {
  getAllUserBeneficiaryTransactions,
  getAllUserMandateTransactions,
  getAllUserTransactions,
  getLoginUser,
  getUserWallets,
} from "../controllers/users";
import { registerValidation, validate } from "../utils/validation";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

router.get("/", verifyToken, getLoginUser);
router.get("/wallets", verifyToken, getUserWallets);
router.get("/transfers", verifyToken, getAllUserTransactions);
router.get("/transfers/mandate", verifyToken, getAllUserMandateTransactions);
router.get(
  "/transfers/beneficiary",
  verifyToken,
  getAllUserBeneficiaryTransactions
);

export default router;

/** TODO
  - delete
  - Update User details
 */
