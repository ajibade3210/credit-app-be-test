import { Knex } from "knex";

import { faker } from "@faker-js/faker";
import { Wallet } from "../src/utils/types";

const SEED_COUNT = 10;

const createWallets = (userId: number): Partial<Wallet> => ({
  type: "regular",
  currency: "NGN",
  balance: String(faker.number.int({ min: 18000, max: 100000 })),
  user_id: userId >= 1 ? userId : 10,
});

export async function seed(knex: Knex): Promise<void> {
  const existingWallet = await knex("wallets").select("id").first();
  if (existingWallet) return;

  const wallets = Array(SEED_COUNT)
    .fill(null)
    .map((_, idx) => createWallets(idx));
  await knex("Wallets").insert(wallets);
  // .onConflict("user_id") // Define your unique constraint
  // .ignore();
}
