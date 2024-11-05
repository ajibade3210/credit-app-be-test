import BaseModel from "../config/baseModel";
import knex from "../config/knex";
import { Transaction, User, Wallet } from "../utils/types";

class UserModel extends BaseModel<User> {
  constructor() {
    super("users");
  }
  // we can add user-specific methods here if needed

  async getUserWallets(userId: number): Promise<{
    user: (User & { wallets: Wallet[] }) | undefined;
  }> {
    const result = await knex("users")
      .leftJoin("wallets", "users.id", "wallets.user_id")
      .select(
        "users.*",
        "wallets.id as wallet_id",
        "wallets.balance",
        "wallets.type",
        "wallets.created_at",
        "wallets.updated_at"
      )
      .where("users.id", userId);

    if (result.length === 0) {
      return { user: undefined };
    }

    const user = {
      id: result[0].id,
      bvn: result[0].bvn,
      first_name: result[0].first_name,
      last_name: result[0].last_name,
      date_of_birth: result[0].date_of_birth,
      age: result[0].age,
      phone_number: result[0].phone_number,
      unique_email: result[0].unique_email,
      created_at: result[0].created_at,
      updated_at: result[0].updated_at,
    } as User;

    const wallets: Wallet[] = result
      .filter(wallet => wallet.wallet_id !== undefined)
      .map(
        wallet =>
          ({
            id: wallet.wallet_id,
            balance: wallet.balance,
            type: wallet.type,
            created_at: wallet.created_at,
            updated_at: wallet.updated_at,
          } as Wallet)
      );

    return { user: { ...user, wallets } };
  }

  async getUserWithMandateTransactions(userId: number): Promise<{
    user: (User & { transactions?: Transaction[] }) | undefined;
  }> {
    const result = await knex("users")
      .leftJoin("transactions", "users.id", "transactions.mandate_id")
      .select(
        "users.*",
        "transactions.id as transaction_id",
        "transactions.amount",
        "transactions.wallet_id",
        "transactions.reference",
        "transactions.narration"
      )
      .where("users.id", userId);

    // If no results, return undefined for user
    if (result.length === 0) {
      return { user: undefined };
    }

    // Destructure the first record to get user details
    const user = {
      id: result[0].id,
      bvn: result[0].bvn,
      first_name: result[0].first_name,
      last_name: result[0].last_name,
      date_of_birth: result[0].date_of_birth,
      age: result[0].age,
      phone_number: result[0].phone_number,
      unique_email: result[0].unique_email,
      created_at: result[0].created_at,
      updated_at: result[0].updated_at,
    } as User;

    // Create an array for transactions
    const transactions = result
      .map(transaction => ({
        id: transaction.transaction_id,
        amount: transaction.amount,
        reference: transaction.reference,
        narration: transaction.narration,
        wallet_id: transaction.wallet_id,
      }))
      .filter(transaction => transaction.id !== null) as Transaction[];

    return {
      user: {
        ...user,
        transactions: transactions.length > 0 ? transactions : [],
      },
    };
  }

  async getUserWithBeneficiaryTransactions(userId: number): Promise<{
    user: (User & { transactions?: Transaction[] }) | undefined;
  }> {
    const result = await knex("users")
      .leftJoin("transactions", "users.id", "transactions.beneficiary_id")
      .select(
        "users.*",
        "transactions.id as transaction_id",
        "transactions.amount",
        "transactions.reference",
        "transactions.narration"
      )
      .where("users.id", userId);

    if (result.length === 0) {
      return { user: undefined };
    }

    const user = {
      id: result[0].id,
      bvn: result[0].bvn,
      first_name: result[0].first_name,
      last_name: result[0].last_name,
      date_of_birth: result[0].date_of_birth,
      age: result[0].age,
      phone_number: result[0].phone_number,
      unique_email: result[0].unique_email,
      created_at: result[0].created_at,
      updated_at: result[0].updated_at,
    } as User;

    const transactions = result
      .map(transaction => ({
        id: transaction.transaction_id,
        amount: transaction.amount,
        reference: transaction.reference,
        narration: transaction.narration,
      }))
      .filter(transaction => transaction.id !== null) as Transaction[];

    return {
      user: {
        ...user,
        transactions: transactions.length > 0 ? transactions : [],
      },
    };
  }

  async getTransactionWithUsers(transactionId: number): Promise<{
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
      .where("transactions.id", transactionId)
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

export default UserModel;
