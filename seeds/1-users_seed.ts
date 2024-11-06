import { Knex } from "knex";
import { faker } from "@faker-js/faker";
import { User } from "../src/utils/types";
import bcrypt from "bcryptjs";

const SEED_COUNT = 10;
const TEST_EMAIL = "testuser@demo.com";
const password = process.env.DummySeedPass;

if (!password) {
  throw new Error("Environment variable DummySeedPass is not set.");
}

const createUser = async (): Promise<Partial<User>> => {
  const hash = await bcrypt.hash(password, 10);
  return {
    bvn: faker.number.octal({ min: 0, max: 65535 }).toString(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    password: hash,
    date_of_birth: faker.date.past({ years: 18 }),
    age: faker.number.int({ min: 18, max: 65 }),
    phone_number: faker.phone.number(),
    unique_email: faker.internet.email(),
  };
};

const createTestUser = async (): Promise<Partial<User>> => {
  const hash = await bcrypt.hash(password, 10);
  return {
    bvn: faker.number.octal({ min: 0, max: 65535 }).toString(),
    first_name: "test_firstName",
    last_name: "test_lastName",
    password: hash,
    date_of_birth: faker.date.past({ years: 18 }),
    age: faker.number.int({ min: 18, max: 65 }),
    phone_number: faker.phone.number(),
    unique_email: TEST_EMAIL,
  };
};

export async function seed(knex: Knex): Promise<void> {
  const existingUser = await knex("users").select("id").first();
  if (existingUser) return;

  const userPromises = Array.from({ length: SEED_COUNT }, createUser);
  const users = await Promise.all(userPromises);

  const testUserData =
    process.env.NODE_ENV === "test" ? [await createTestUser()] : [];

  await knex("users").insert([...users, ...testUserData]);
}
