import { NextFunction, Request, Response } from "express";
import { body, check, param, validationResult } from "express-validator";

const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }
  return next();
};

const registerValidation = () => {
  return [
    check("first_name", "First Name is required").isString(),
    check("last_name", "Last Name is required").isString(),
    check("bvn")
      .isLength({ min: 11, max: 11 })
      .withMessage("BVN must be 11 characters long"),
    check("unique_email", "Unique Email is required").isEmail(),
    check("phone_number", "Phone Number is required").isString(),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long")
      .matches(/(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])/)
      .withMessage(
        "Password must contain at least one number, one uppercase letter, and one symbol"
      ),
  ];
};

const loginValidation = () => {
  return [
    check("unique_email", "Unique Email is required").isEmail(),
    check(
      "password",
      "Password with 6 or more characters is required"
    ).isLength({
      min: 6,
    }),
  ];
};

const createWalletValidation = () => {
  return [
    check("userId", "User Id is required").notEmpty(),
    check("type", "Wallet type is required").notEmpty(),
    check("currency", "Currency is required").notEmpty(),
  ];
};

const fundWalletValidation = () => {
  return [
    check("walletId", "Wallet Id is required").notEmpty(),
    check("amount", "Amount is required").notEmpty(),
  ];
};

const withdrawFundWalletValidation = () => {
  return [
    check("walletId", "Wallet Id is required").notEmpty(),
    check("amount", "Amount is required").notEmpty(),
  ];
};

const transferFundValidation = () => {
  return [
    check("mandateId", "Mandate Id is required").notEmpty(),
    check("beneficiaryId", "Beneficiary Id is required").notEmpty(),
    check("amount", "Amount is required").notEmpty(),
    check("narration", "Narration is required").notEmpty(),
    check("currency", "Currency is required").notEmpty(),
  ];
};

export {
  validate,
  registerValidation,
  loginValidation,
  createWalletValidation,
  fundWalletValidation,
  withdrawFundWalletValidation,
  transferFundValidation,
};
