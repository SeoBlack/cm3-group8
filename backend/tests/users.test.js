const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const User = require("../models/userModel");

const users = [
  {
    name: "test user",
    username: "testuser",
    password: "testpassword",
    phone_number: "1234567890",
    gender: "male",
    date_of_birth: "2000-01-01",
    membership_status: "active",
    bio: "test bio",
    address: "test address",
    profile_picture: "test picture",
  },
  {
    name: "test user 2",
    username: "testuser2",
    password: "testpassword",
    phone_number: "1234567890",
    gender: "male",
    date_of_birth: "2000-01-01",
    membership_status: "active",
    bio: "test bio",
    address: "test address",
    profile_picture: "test picture",
  },
];

let token = null;

beforeAll(async () => {
  await User.deleteMany({});
  const res = await api.post("/api/users/signup").send(users[0]);
  token = res.body.token;
});

describe("User Routes", () => {
  describe("POST /api/users/signup", () => {
    const userData = {
      name: "test user 3",
      username: "testuser3",
      password: "testpassword",
      phone_number: "1234567890",
      gender: "male",
      date_of_birth: "2000-01-01",
      membership_status: "active",
      bio: "test bio",
      address: "test address",
      profile_picture: "test picture",
    };

    it("should create a new user", async () => {
      const response = await api.post("/api/users/signup").send(userData);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("token");
      expect(response.body).toHaveProperty("user");
    });

    it("should not allow signup with duplicate username", async () => {
      const result = await api.post("/api/users/signup").send(users[0]);
      expect(result.status).toBe(400);
      expect(result.body).toHaveProperty("error");
    });

    it("should return validation error for missing fields", async () => {
      const invalidUser = {
        username: "",
        password: "short",
      };
      const result = await api.post("/api/users/signup").send(invalidUser);

      expect(result.status).toBe(400);
      expect(result.body).toHaveProperty("error");
    });
  });

  describe("POST /api/users/login", () => {
    it("should login user with valid credentials", async () => {
      const userData = {
        username: "testuser3",
        password: "testpassword",
      };

      const result = await api.post("/api/users/login").send(userData);
      expect(result.status).toBe(200);
      expect(result.body).toHaveProperty("token");
      expect(result.body).toHaveProperty("user");
      token = result.body.token;
    });

    it("should return error if user does not exist", async () => {
      const result = await api.post("/api/users/login").send({
        username: "notfound",
        password: "password123",
      });

      expect(result.status).toBe(401);
      expect(result.body).toHaveProperty("error");
    });
  });

  describe("GET /api/users", () => {
    it("should return user profile when authenticated", async () => {
      const result = await api
        .get("/api/users")
        .set("Authorization", `Bearer ${token}`);

      expect(result.status).toBe(200);
      expect(Array.isArray(result.body)).toBe(true);
    });

    it("should return unauthorized without token", async () => {
      const result = await api.get("/api/users");
      expect(result.status).toBe(401);
    });
  });

  describe("GET /api/users/verify", () => {
    it("should return 200 when token is valid", async () => {
      const result = await api
        .get("/api/users/verify")
        .set("Authorization", `Bearer ${token}`);

      expect(result.status).toBe(200);
      expect(result.body).toHaveProperty("user");
    });
  });
});
