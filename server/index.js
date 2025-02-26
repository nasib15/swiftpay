const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const port = process.env.PORT || 5000;
const mongoose = require("mongoose");
const User = require("./models/User");

// middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

// MongoDB connection string
const uri = process.env.MONGODB_URI;
console.log("MongoDB URI:", uri);

// Connect to MongoDB with Mongoose
mongoose
  .connect(uri)
  .then(() => console.log("Connected to MongoDB with Mongoose"))
  .catch((err) => console.error("Mongoose connection error:", err));

async function run() {
  try {
    // register user
    app.post("/api/auth/register", async (req, res) => {
      try {
        const { name, mobile, email, nid, pin, accountType } = req.body;
        const hashedPin = await bcrypt.hash(pin, 10);

        const user = await User.create({
          name,
          mobile,
          email,
          nid,
          pin: hashedPin,
          accountType,
        });

        res.status(201).json({
          success: true,
          message: "User registered successfully",
          user,
        });
      } catch (error) {
        res.status(400).json({
          success: false,
          message: error.message || "Registration failed",
        });
      }
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }

  // login user
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { identifier, pin } = req.body;
      const user = await User.findOne({
        $or: [{ mobile: identifier }, { email: identifier }],
      });

      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: "User not found" });
      }

      const isPinValid = await bcrypt.compare(pin, user.pin);
      if (!isPinValid) {
        return res.status(400).json({ success: false, message: "Invalid PIN" });
      }

      res.status(200).json({
        success: true,
        message: "Login successful",
        user,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || "Login failed",
      });
    }
  });
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("SwiftPay API is running");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
