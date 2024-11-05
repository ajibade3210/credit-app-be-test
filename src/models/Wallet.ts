import { Knex } from "knex";
import knex from "../config/knex";
import { logger } from "../utils/logger";
import BaseModel from "../config/baseModel";
import { Wallet } from "../utils/types";

class WalletModel extends BaseModel<Wallet> {
  constructor() {
    super("wallets"); // Assuming the table name is 'wallets'
  }

  async createWallet(
    userId: number,
    type: string = "regular",
    currency: string = "NGN"
  ): Promise<Wallet | undefined> {
    let trx = await knex.transaction();
    try {
      const wallet = {
        user_id: userId,
        balance: "0",
        type,
        currency,
      };

      const walletId = await this.create(wallet, trx);
      const newWallet = await this.findById(Number(walletId), trx);
      await trx.commit();
      return newWallet;
    } catch (error: any) {
      logger.error(error.message);
      await trx.rollback();
      return undefined;
    }
  }

  async fundWallet(
    walletId: number,
    amount: number,
    trx?: Knex.Transaction
  ): Promise<number | undefined> {
    let transaction: Knex.Transaction | undefined = trx;
    if (!transaction) transaction = await knex.transaction();

    try {
      const wallet = await this.findById(walletId);
      if (!wallet) {
        logger.info("Wallet not found");
        return undefined;
      }
      console.log("wallet:***** >> ", wallet && wallet.id);

      const newBalance = Number(wallet.balance) + Number(amount);
      const updatedWallet = await this.update(
        walletId,
        { balance: String(newBalance) },
        transaction
      );

      if (!trx) await transaction.commit(); // close transaction if stand alone query
      return updatedWallet;
    } catch (error: any) {
      if (!trx) await transaction.rollback();
      logger.error(`Error funding wallet: ${error.message}`);
      return undefined;
    }
  }

  async withdrawFunds(
    walletId: number,
    amount: number,
    trx?: Knex.Transaction
  ): Promise<string | undefined> {
    let transaction: Knex.Transaction | undefined = trx;
    if (!transaction) {
      transaction = await knex.transaction();
    }

    try {
      const wallet = await this.findById(walletId);
      if (!wallet) {
        return "Wallet not found";
      }

      const currentBalance = Number(wallet.balance);
      if (currentBalance < amount) {
        return "Insufficient balance";
      }

      // Deduct the amount from the wallet's balance
      const newBalance = currentBalance - amount;
      await this.update(
        walletId,
        { balance: String(newBalance) },
        transaction
      );

      if (!trx) await transaction.commit();
      return "wallet funded";
    } catch (error: any) {
      if (!trx) await transaction.rollback();
      logger.error(error.message);
      return undefined;
    }
  }
}

export default WalletModel;
