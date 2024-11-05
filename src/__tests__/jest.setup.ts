import app from "../app";
import request from "supertest";
import knex from "../config/knex";

const DEFAULT_PASSWORD = "password_testing";
const TEST_EMAIL = "testuser@demo.com";
const password = process.env.DummySeedPass || DEFAULT_PASSWORD;
let authToken: string;

beforeAll(async () => {
  const currentDb = knex.client.config.connection.database;
  if (currentDb !== "test") {
    throw new Error("Connected to wrong Test DB!!");
  }

  const loginResponse = await request(app).post("/v1/api/auth/login").send({
    username: "testUser",
    password: "testPassword",
  });
  authToken = loginResponse.body.token;
});

beforeEach(async () => {
  const loginResponse = await request(app).post("/v1/api/auth/sign-in").send({
    unique_email: TEST_EMAIL,
    password,
  });
  authToken = loginResponse.body.token;
});

afterEach(async () => {
  // Delete from the dependent tables first
});

afterAll(async () => {
  await knex.destroy();
});

describe('Setup Tests', () => {
  it('should pass this test', () => {
    expect(true).toBe(true);
  });
});

export { authToken };
