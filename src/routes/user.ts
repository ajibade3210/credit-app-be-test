import express from "express";
import { check } from "express-validator";
import {
  getAllUserBeneficiaryTransactions,
  getAllUserMandateTransactions,
  getLoginUser,
  getUserTransaction,
  getUserWallets,
} from "../controllers/users";
import { registerValidation, validate } from "../utils/validation";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

router.get("/", verifyToken, getLoginUser);
router.get("/all", verifyToken, getLoginUser);
router.get("/wallet", verifyToken, getUserWallets);
router.get("/transaction", verifyToken, getUserTransaction);
router.get("/transaction/mandate", verifyToken, getAllUserMandateTransactions);
router.get(
  "/transaction/beneficiary",
  verifyToken,
  getAllUserBeneficiaryTransactions
);

// router.post("/register", registerValidation(), validate, register);

export default router;

/** TODO
  - delete
  - Update User details
 */
