import { v4 as uuidv4 } from "uuid";
import knex from "../config/knex";
import { NextFunction, Request, Response } from "express";
import TransferModel from "../models/Transactions";

const transferModel = new TransferModel();

export const transferFunds = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const trx = await knex.transaction();

    const { mandateId, beneficiaryId, amount, narration, currency } = req.body; // Id can be switched to Acc NO

    if (amount <= 0) {
      return res
        .status(400)
        .json({ message: "Amount must be greater than zero." });
    }

    const reference = `TRAN_${uuidv4()}`;

    const result = await transferModel.transferFunds(
      mandateId,
      beneficiaryId,
      amount,
      currency,
      reference,
      narration,
      trx
    );

    if (result && result.message !== "Transfer complete") {
      return res.status(400).json({
        status: "failed",
        message: `Transaction failed ${result.message}`,
      });
    }
    await trx.commit();
    res.status(200).json(result);
  } catch (err: any) {
    return next(err);
  }
};

export const getTransactionDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { transferId } = req.params;
    const result = await transferModel.getTransactionDetails(
      Number(transferId)
    );

    if (!result.transaction) {
      return res
        .status(400)
        .send({ status: "failed", message: "Transaction not found" });
    }
    return res.status(200).send(result);
  } catch (err: any) {
    return next(err);
  }
};
