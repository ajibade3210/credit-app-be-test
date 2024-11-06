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
      .get("/v1/api/user/wallets")
      .set("Authorization", `Bearer ${authToken}`);
    expect(response.status).toBe(200);
    expect(response.body.user).toHaveProperty("first_name");
    expect(response.body.user).toHaveProperty("wallets");
    expect(response.body.user.wallets).toBeInstanceOf(Array);
  });

  it("should fail to get all user wallets if not log-in", async () => {
    const response = await request(app)
      .get("/v1/api/user/wallets")
      .set("Authorization", "");
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      "message",
      "Authorization token missing"
    );
  });
});
