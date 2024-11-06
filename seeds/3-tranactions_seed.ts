import { Knex } from "knex";
import { v4 as uuidv4 } from "uuid";
import { faker } from "@faker-js/faker";
import { Transaction } from "../src/utils/types";

export async function seed(knex: Knex): Promise<void> {
  const existingTransactions = await knex("Transactions").select("id").first();
  if (existingTransactions) return;

  const getUserWallet = await knex("Wallets")
    .select("id", "user_id")
    .where("id", 1);
  if (getUserWallet.length > 0) {
    const mandate_id = getUserWallet[0].user_id;

    const beneficiary_id = mandate_id >= 10 ? 1 : mandate_id + 1;
    const reference: string = `TRAN_${uuidv4()}`;

    const seed_data: Partial<Transaction> = {
      amount: "3000",
      reference,
      narration: faker.lorem.sentence(5),
      wallet_id: getUserWallet[0].id,
      mandate_id,
      beneficiary_id,
    };

    await knex("Transactions").insert([seed_data]);
    // .onConflict("wallet_id") // Define your unique constraint
    // .ignore();
  }
}
