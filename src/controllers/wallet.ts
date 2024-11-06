import knex from "../config/knex";
import { NextFunction, Request, Response } from "express";
import WalletModel from "../models/Wallet";
import UserModel from "../models/User";

const walletModel = new WalletModel();
const userModel = new UserModel();

export const createWallet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, type, currency } = req.body;
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const wallet = await walletModel.createWallet(userId, type, currency);
    if (!wallet) {
      return res.status(400).json({
        success: false,
        message:
          "Wallet creation failed: Ensure user doesn’t already have this wallet type",
      });
    }
    return res.status(201).json({
      success: true,
      message: "Wallet Account created successfully",
      wallet,
    });
  } catch (err: any) {
    return next(err);
  }
};

export const fundWallet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { walletId, amount } = req.body;

    if (amount <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Amount must be greater than zero" });
    }

    const wallet = await walletModel.fundWallet(walletId, amount);
    if (!wallet) {
      return res
        .status(404)
        .json({ success: false, message: "Wallet not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Wallet funded successfully" });
  } catch (err: any) {
    return next(err);
  }
};

export const withdrawFunds = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const trx = await knex.transaction();
    const { walletId, amount } = req.body;

    if (amount <= 0) {
      return res
        .status(400)
        .json({ message: "Amount must be greater than zero." });
    }

    const result = await walletModel.withdrawFunds(walletId, amount, trx);

    if (result !== "wallet funded") {
      return res.status(400).json({
        success: false,
        message: `Withdrawal Failed: ${result}`,
      });
    }

    const wallet = await walletModel.findById(walletId, trx);

    await trx.commit();
    res.status(200).json({ message: "Withdrawal successful", wallet });
  } catch (err: any) {
    return next(err);
  }
};

export const deleteUserWallet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, type } = req.params;
    const wallet = await walletModel.findOne({ user_id: Number(userId) });
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: "Wallet not found",
      });
    }

    const deletedCount = await walletModel.findAndDelete({
      user_id: Number(userId),
      type,
      balance: "0.00", // wallet must be empty before deleting
    });

    if (deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Wallet not found!",
      });
    }

    return res
      .status(200)
      .json({ success: true, message: "Wallet deleted successfully." });
  } catch (error) {
    next(error);
  }
};
