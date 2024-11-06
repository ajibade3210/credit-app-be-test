import request from "supertest";
import app from "../app";
import { authToken } from "./jest.setup";

console.log("environment -- ", process.env.NODE_ENV);

describe("User Controller Tests", () => {
  it("should fund user wallet account as beneficiary successfully", async () => {
    // create wallet
    await request(app)
      .post("/v1/api/wallet/create")
      .send({ userId: "11", type: "regular", currency: "NGN" })
      .set("Authorization", `Bearer ${authToken}`);

    const response = await request(app)
      .post("/v1/api/transfer")
      .send({
        mandateId: 1,
        beneficiaryId: 11,
        amount: 2000,
        narration: "standard transfer monthly",
        currency: "NGN",
      })
      .set("Authorization", `Bearer ${authToken}`);
    expect(response.status).toBe(200);
    expect(response.body.transfer_details).toHaveProperty("amount", "2000");
    expect(response.body.transfer_details).toHaveProperty("reference");
    expect(response.body).toHaveProperty("message", "Transfer complete");
  });

  it("should debit user wallet account as mandate successfully", async () => {
    const response = await request(app)
      .post("/v1/api/transfer")
      .send({
        mandateId: 11,
        beneficiaryId: 1,
        amount: 2000,
        narration: "standard transfer monthly",
        currency: "NGN",
      })
      .set("Authorization", `Bearer ${authToken}`);
    expect(response.status).toBe(200);
    expect(response.body.transfer_details).toHaveProperty("amount", "2000");
    expect(response.body.transfer_details).toHaveProperty("reference");
    expect(response.body).toHaveProperty("message", "Transfer complete");
  });

  it("should fail if beneficiary user does not have a wallet", async () => {
    // delete wallet
    await request(app)
      .delete("/v1/api/wallet/11/regular")
      .set("Authorization", `Bearer ${authToken}`);

    const response = await request(app)
      .post("/v1/api/transfer")
      .send({
        mandateId: 1,
        beneficiaryId: 11,
        amount: 2000,
        narration: "standard transfer monthly",
        currency: "NGN",
      })
      .set("Authorization", `Bearer ${authToken}`);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Transaction failed Wallet not found"
    );
  });

  /**
   * TODO
   * - Other Wallet Endpoints
   */
});
