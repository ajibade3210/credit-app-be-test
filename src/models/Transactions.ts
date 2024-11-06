import { Knex } from "knex";
import knex from "../config/knex";
import BaseModel from "../config/baseModel";
import WalletModel from "./Wallet";
import { Transaction } from "../utils/types";

class TransactionModel extends BaseModel<Transaction> {
  private walletModel: WalletModel;

  constructor() {
    super("transactions");
    this.walletModel = new WalletModel();
  }

  async transferFunds(
    mandateId: number,
    beneficiaryId: number,
    amount: number,
    currency: string = "NGN",
    reference: string,
    narration: string = "",
    trx?: Knex.Transaction
  ): Promise<{ message: string; transfer_details: Transaction | undefined }> {
    let transaction: Knex.Transaction | undefined = trx;
    if (!transaction) transaction = await knex.transaction();

    try {
      const mandateWallet = await this.walletModel.findOne({
        user_id: mandateId,
        currency,
      });
      const beneficiaryWallet = await this.walletModel.findOne({
        user_id: beneficiaryId,
        currency,
      });

      if (!mandateWallet || !beneficiaryWallet) {
        return { message: "Wallet not found", transfer_details: undefined };
      }

      const mandateBalance = Number(mandateWallet.balance);
      if (mandateBalance < amount) {
        return {
          message: "Insufficient funds in mandate wallet",
          transfer_details: undefined,
        };
      }

      await this.walletModel.update(
        mandateWallet.id,
        { balance: String(mandateBalance - amount) },
        transaction
      );

      // Transfer to beneficiary wallet
      const beneficiaryBalance = Number(beneficiaryWallet.balance);
      await this.walletModel.update(
        beneficiaryWallet.id,
        { balance: String(beneficiaryBalance + amount) },
        transaction
      );

      const transactionData: Partial<Transaction> = {
        amount: String(amount),
        reference,
        narration,
        wallet_id: mandateWallet.id,
        mandate_id: mandateId,
        beneficiary_id: beneficiaryId,
      };

      const transactionId = await this.create(transactionData, transaction);

      if (!trx) await transaction.commit();

      const transfer_details = await this.findById(
        Number(transactionId),
        transaction
      );
      return {
        message: "Transfer complete",
        transfer_details: transfer_details,
      };
    } catch (error) {
      if (!trx) await transaction.rollback();
      console.error("Error transferring funds:", error);
      throw error;
    }
  }
}

export default TransactionModel;
