import request from "supertest";
import app from "../app";
import { authToken } from "./jest.setup";

describe("User Controller Tests", () => {
  it("should get login user details", async () => {
    const response = await request(app)
      .get("/v1/api/user")
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("first_name");
  });

  it("should fail to get user details if not log-in", async () => {
    const response = await request(app)
      .get("/v1/api/user")
      .set("Authorization", "");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      "message",
      "Authorization token missing"
    );
  });

  it("should get all user wallets", async () => {
    const response = await request(app)
      .get("/v1/api/user/wallet")
      .set("Authorization", `Bearer ${authToken}`);
    expect(response.status).toBe(200);
    expect(response.body.user).toHaveProperty("first_name");
    expect(response.body.user).toHaveProperty("wallets");
    expect(response.body.user.wallets).toBeInstanceOf(Array);
  });

  it("should fail to get all user wallets if not log-in", async () => {
    const response = await request(app)
      .get("/v1/api/user/wallet")
      .set("Authorization", "");
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      "message",
      "Authorization token missing"
    );
  });

  it("should get all transaction of a user", async () => {
    const response = await request(app)
      .get("/v1/api/user/transaction")
      .set("Authorization", `Bearer ${authToken}`);
    console.log("authToken: -- - ", authToken);
    console.log("response.body: ", response.body);
    expect(response.status).toBe(200);
    expect(response.body.transaction).toHaveProperty("wallet_id");
    expect(response.body.transaction).toHaveProperty("amount");
    expect(response.body.transaction.beneficiaryUser).toBeInstanceOf(Object);
    expect(response.body.transaction.beneficiaryUser).toBeInstanceOf(Object);
  });

  it("should fail to get all transaction of a user if not log-in", async () => {
    const response = await request(app)
      .get("/v1/api/user/transaction")
      .set("Authorization", "");
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      "message",
      "Authorization token missing"
    );
  });

  it("should get all transaction where user is mandate", async () => {
    const response = await request(app)
      .get("/v1/api/user/transaction/mandate")
      .set("Authorization", `Bearer ${authToken}`);
    expect(response.status).toBe(200);
    expect(response.body.user).toHaveProperty("first_name");
    expect(response.body.user.transactions).toBeInstanceOf(Array);
  });

  it("should fail to get all transaction where user is mandate if not log-in", async () => {
    const response = await request(app)
      .get("/v1/api/user/transaction/mandate")
      .set("Authorization", "");
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      "message",
      "Authorization token missing"
    );
  });

  it("should get all transaction where user is beneficiary", async () => {
    const response = await request(app)
      .get("/v1/api/user/transaction/beneficiary")
      .set("Authorization", `Bearer ${authToken}`);
    expect(response.status).toBe(200);
    expect(response.body.user).toHaveProperty("first_name");
    expect(response.body.user.transactions).toBeInstanceOf(Array);
  });

  it("should fail to get all transaction where user is beneficiary if not log-in", async () => {
    const response = await request(app)
      .get("/v1/api/user/transaction/beneficiary")
      .set("Authorization", "");
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      "message",
      "Authorization token missing"
    );
  });
});
