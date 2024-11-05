import request from "supertest";
import app from "../app";
import { authToken } from "./jest.setup";

describe("User Controller Tests", () => {
  it("should create a new wallet for the user", async () => {
    const response = await request(app)
      .post("/v1/api/wallet/create")
      .send({ userId: "11", type: "regular", currency: "NGN" })
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(201);
    expect(response.body.wallet).toHaveProperty("id");
    expect(response.body.wallet).toHaveProperty("balance", 0);
    expect(response.body.wallet).toHaveProperty("type", "regular");
    expect(response.body.wallet).toHaveProperty("currency", "NGN");
    expect(response.body).toHaveProperty(
      "message",
      "Wallet Account created successfully"
    );
  });

  it("should fail if create new wallet payload is incomplete", async () => {
    const response = await request(app)
      .post("/v1/api/wallet/create")
      .send({ userId: "11", currency: "NGN" })
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBeInstanceOf(Array);
    expect(response.body.message[0]).toHaveProperty("msg");
    expect(response.body.message[0]).toHaveProperty("location", "body");
  });

  it("should fail if user as a wallet of same type", async () => {
    const response = await request(app)
      .post("/v1/api/wallet/create")
      .send({ userId: "11", type: "regular", currency: "NGN" })
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBeInstanceOf(Object);
    expect(response.body.message).toHaveProperty("msg");
    expect(response.body.message).toHaveProperty("location", "body");
  });

  it("should delete user wallet", async () => {
    const response = await request(app)
      .delete("/v1/api/wallet/11/regular")
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("success", true);
    expect(response.body).toHaveProperty(
      "message",
      "Wallet deleted successfully."
    );
  });

  /**
   * TODO
   * - Other Wallet Endpoints
   */
});
