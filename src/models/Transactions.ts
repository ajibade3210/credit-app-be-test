import { Knex } from "knex";
import knex from "../config/knex";
import BaseModel from "../config/baseModel";
import WalletModel from "./Wallet";
import { Transaction, User } from "../utils/types";

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
        const user = !mandateWallet ? "Sender's" : "Receiver's";
        return {
          message: `${user} wallet not found`,
          transfer_details: undefined,
        };
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
      throw error;
    }
  }

  async getTransactionDetails(transactionId: number): Promise<{
    transaction:
      | (Transaction & {
          mandateUser?: User;
          beneficiaryUser?: User;
        })
      | undefined;
  }> {
    const result = await knex("transactions")
      .leftJoin(
        "users as mandate_user",
        "transactions.mandate_id",
        "mandate_user.id"
      )
      .leftJoin(
        "users as beneficiary_user",
        "transactions.beneficiary_id",
        "beneficiary_user.id"
      )
      .select(
        // Transaction details
        "transactions.id as transaction_id",
        "transactions.amount",
        "transactions.reference",
        "transactions.narration",
        "transactions.wallet_id",
        "transactions.created_at as transaction_created_at",
        "transactions.updated_at as transaction_updated_at",

        // Mandate user details
        "mandate_user.id as mandate_user_id",
        "mandate_user.bvn as mandate_bvn",
        "mandate_user.first_name as mandate_first_name",
        "mandate_user.last_name as mandate_last_name",
        "mandate_user.phone_number as mandate_phone_number",
        "mandate_user.unique_email as mandate_unique_email",

        // Beneficiary user details
        "beneficiary_user.id as beneficiary_user_id",
        "beneficiary_user.bvn as beneficiary_bvn",
        "beneficiary_user.first_name as beneficiary_first_name",
        "beneficiary_user.last_name as beneficiary_last_name",
        "beneficiary_user.phone_number as beneficiary_phone_number",
        "beneficiary_user.unique_email as beneficiary_unique_email"
      )
      .where("transactions.id", 1)
      .first();

    if (!result) {
      return { transaction: undefined };
    }

    const transaction = {
      id: result.transaction_id,
      amount: result.amount,
      reference: result.reference,
      narration: result.narration,
      wallet_id: result.wallet_id,
      created_at: result.transaction_created_at,
      updated_at: result.transaction_updated_at,
    } as Transaction;

    const mandateUser = result.mandate_user_id
      ? ({
          id: result.mandate_user_id,
          bvn: result.mandate_bvn,
          first_name: result.mandate_first_name,
          last_name: result.mandate_last_name,
          phone_number: result.mandate_phone_number,
          unique_email: result.mandate_unique_email,
        } as User)
      : undefined;

    const beneficiaryUser = result.beneficiary_user_id
      ? ({
          id: result.beneficiary_user_id,
          bvn: result.beneficiary_bvn,
          first_name: result.beneficiary_first_name,
          last_name: result.beneficiary_last_name,
          phone_number: result.beneficiary_phone_number,
          unique_email: result.beneficiary_unique_email,
        } as User)
      : undefined;

    // Return the transaction with related user details
    return { transaction: { ...transaction, mandateUser, beneficiaryUser } };
  }
}

export default TransactionModel;
