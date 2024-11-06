import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { logger } from "../utils/logger";
import UserModel from "../models/User";

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { unique_email, password } = req.body;
    const userModel = new UserModel();
    const user = await userModel.findOne({ unique_email });
    if (!user) {
      return res.status(400).send({ message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ message: "Password or Email is invalid" });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "1d" }
    );

    return res
      .status(200)
      .send({ status: "success", message: "User Sign In Successfully", token });
  } catch (err: any) {
    return next(err);
  }
};

export const validateToken = (req: Request, res: Response) => {
  return res.status(200).send({ status: "success", userId: req.userId });
};

export const signOut = (req: Request, res: Response) => {
  return res.status(200).json({
    status: "success",
    message: "Sign out successful. Auth token cleared on the client side.",
  });
};

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userModel = new UserModel();
    let user = await userModel.findOne({
      unique_email: req.body.unique_email,
    });

    logger.info("user: ", user);
    if (user) {
      return res
        .status(400)
        .json({ status: "failed", message: "User already exist" });
    }

    // // create /register (Blacklisted)
    const hash = await bcrypt.hash(req.body.password, 8);

    const userId = await userModel.create({
      ...req.body,
      password: hash,
    });

    const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY as string, {
      expiresIn: "1d",
    });

    return res
      .status(200)
      .send({ status: "success", message: "User registered Ok", token });
  } catch (err: any) {
    return next(err);
  }
};
