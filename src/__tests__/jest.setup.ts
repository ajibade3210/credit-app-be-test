import app from "../app";
import request from "supertest";
import knex from "../config/knex";

const TEST_EMAIL = "testuser@demo.com";
const password = process.env.DummySeedPass;
let authToken: string;

beforeEach(async () => {
  const loginResponse = await request(app).post("/v1/api/auth/sign-in").send({
    unique_email: TEST_EMAIL,
    password,
  });
  authToken = loginResponse.body.token;
});

describe('Setup Tests', () => {
  it('should pass this test', () => {
    expect(true).toBe(true);
  });
});

export { authToken };
