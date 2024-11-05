import { Knex } from "knex";

import { faker } from "@faker-js/faker";
import { User } from "../src/utils/types";
import bcrypt from "bcryptjs";

const SEED_COUNT = 10;

const password = process.env.DummySeedPass || "password_esting";
if (!password) {
  throw new Error("Environment variable DummySeedPass is not set.");
}

const createUsers = async (): Promise<Partial<User>> => {
  const hash = await bcrypt.hash(password, 10);

  return {
    bvn: faker.number.octal({ min: 0, max: 65535 }),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    password: hash,
    date_of_birth: faker.date.past({ years: 18 }),
    age: faker.number.int({ min: 18, max: 65 }),
    phone_number: faker.phone.number(),
    unique_email: faker.internet.email(),
  };
};

export async function seed(knex: Knex): Promise<void> {
  const existingUsers = await knex("users").select("id").first();
  if (existingUsers) return;

  const userPromises = Array.from({ length: SEED_COUNT }, () => createUsers());

  const users = await Promise.all(userPromises);

  await knex("users").insert(users).onConflict("unique_email").ignore();
}
