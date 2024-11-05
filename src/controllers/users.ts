import { NextFunction, Request, Response } from "express";
import UserModel from "../models/User";

const userModel = new UserModel();

export const getLoginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(req.userId);

    const data = await userModel.findOne({id: userId});
    if (!data) {
      return res
        .status(400)
        .send({ success: false, message: "User not found" });
    }
    const { password, ...user } = data;
    return res.status(200).send(user);
  } catch (err: any) {
    return next(err);
  }
};

export const getUserTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(req.userId);

    const user = await userModel.getTransactionWithUsers(userId);
    if (!user) {
      return res
        .status(400)
        .send({ success: false, message: "User not found" });
    }
    return res.status(200).send(user);
  } catch (err: any) {
    return next(err);
  }
};

export const getAllUserMandateTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(req.userId);

    const user = await userModel.getUserWithMandateTransactions(userId);
    if (!user) {
      return res.status(400).send({ success: false, message: "User not found" });
    }
    return res.status(200).send(user);
  } catch (err: any) {
    return next(err);
  }
};

export const getAllUserBeneficiaryTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(req.userId);

    const user = await userModel.getUserWithBeneficiaryTransactions(userId);
    if (!user) {
      return res
        .status(400)
        .send({ success: false, message: "User not found" });
    }
    return res.status(200).send(user);
  } catch (err: any) {
    return next(err);
  }
};

export const getUserWallets = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(req.userId);

    const user = await userModel.getUserWallets(userId);
    if (!user) {
      return res.status(400).send({ message: "User not found" });
    }
    return res.status(200).send(user);
  } catch (err: any) {
    return next(err);
  }
};

