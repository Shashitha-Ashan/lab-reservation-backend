const request = require("supertest");
const app = require("../index"); // Adjust the path to your Express app
const User = require("../models/userModel"); // Adjust the path to your User model
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

describe("User Controller Integration Tests", () => {
  beforeAll(async () => {
    // Setup: Create a test user in the database
    const hashedPassword = await bcrypt.hash("password123", 10);
    await User.create({
      name: "Test",
      uniEmail: "test@sjp.ac.lk",
      password: hashedPassword,
      role: "lecturer",
      isVerified: true,
      adminConfirmation: true,
    });
  });

  afterAll(async () => {
    // Cleanup: Remove the test user from the database
    await User.deleteMany({ uniEmail: "test@sjp.ac.lk" });
    await mongoose.connection.close();
  });

  describe("POST /api/v1/user/login", () => {
    it("should login successfully with correct credentials", async () => {
      const response = await request(app)
        .post("/api/v1/user/login")
        .send({ email: "test@sjp.ac.lk", password: "password123" })
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toHaveProperty("token");
    });

    it("should return 401 for missing email or password", async () => {
      const response = await request(app)
        .post("/api/v1/user/login")
        .send({ email: "test@sjp.ac.lk" })
        .expect("Content-Type", /json/)
        .expect(401);

      expect(response.body).toHaveProperty(
        "message",
        "Email and password are required"
      ); // Adjusted message to match login logic
    });

    it("should return 401 for invalid email or password", async () => {
      const response = await request(app)
        .post("/api/v1/user/login")
        .send({ email: "test@sjp.ac.lk", password: "wrongpassword" })
        .expect("Content-Type", /json/)
        .expect(401);

      expect(response.body).toHaveProperty(
        "message",
        "Invalid email or password"
      );
    });

    it("should return 401 for unverified user", async () => {
      // Create an unverified user
      const hashedPassword = await bcrypt.hash("password123", 10);
      await User.create({
        name: "Unverified User",
        uniEmail: "unverified@sjp.ac.lk",
        password: hashedPassword,
        role: "lecturer",
        isVerified: false, // Unverified
      });

      const response = await request(app)
        .post("/api/v1/user/login")
        .send({ email: "unverified@sjp.ac.lk", password: "password123" })
        .expect("Content-Type", /json/)
        .expect(401);

      expect(response.body).toHaveProperty("message", "User not verified");

      // Cleanup unverified user
      await User.deleteMany({ uniEmail: "unverified@sjp.ac.lk" });
    });
  });
});
