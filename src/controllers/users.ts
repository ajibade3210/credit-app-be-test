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

    const data = await userModel.findOne({ id: userId });
    if (!data) {
      return res
        .status(400)
        .send({ status: "failed", message: "User not found" });
    }
    const { password, ...user } = data;
    return res.status(200).send(user);
  } catch (err: any) {
    return next(err);
  }
};

export const getAllUserTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(req.userId);

    const userTransaction = await userModel.getUserTransactions(userId);
    if (userTransaction.length <= 0) {
      return res
        .status(400)
        .send({ status: "failed", message: "User transactions not found" });
    }
    return res.status(200).send({ transactions: userTransaction });
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
      return res
        .status(400)
        .send({ status: "failed", message: "User not found" });
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
        .send({ status: "failed", message: "User not found" });
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
    console.log("userId: --- -- - >>> ", userId);

    const user = await userModel.getUserWallets(userId);
    if (!user) {
      return res
        .status(400)
        .send({ status: "failed", message: "User not found" });
    }
    return res.status(200).send(user);
  } catch (err: any) {
    return next(err);
  }
};
