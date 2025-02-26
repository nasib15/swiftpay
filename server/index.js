const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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

// Authentication middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Invalid token.",
    });
  }
};

async function run() {
  try {
    // register user
    app.post("/api/auth/register", async (req, res) => {
      try {
        const { name, mobile, email, nid, pin, accountType } = req.body;
        const status =
          accountType === "agent" || accountType === "admin"
            ? "pending"
            : "active";

        const balance =
          accountType === "user" ? 40 : accountType === "agent" ? 100000 : 0;
        const hashedPin = await bcrypt.hash(pin, 10);

        const user = await User.create({
          name,
          mobile,
          email,
          nid,
          pin: hashedPin,
          accountType,
          status,
          balance,
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
          return res
            .status(400)
            .json({ success: false, message: "Invalid PIN" });
        }

        // Create JWT token
        const token = jwt.sign(
          {
            id: user._id,
            accountType: user.accountType,
          },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(200).json({
          success: true,
          message: "Login successful",
          token,
          user: {
            id: user._id,
            name: user.name,
            mobile: user.mobile,
            email: user.email,
            accountType: user.accountType,
            balance: user.balance,
            status: user.status,
          },
        });
      } catch (error) {
        res.status(400).json({
          success: false,
          message: error.message || "Login failed",
        });
      }
    });

    // Get current user (protected route)
    app.get("/api/auth/me", verifyToken, async (req, res) => {
      try {
        const user = await User.findById(req.user.id).select("-pin");

        if (!user) {
          return res.status(404).json({
            success: false,
            message: "User not found",
          });
        }

        res.status(200).json({
          success: true,
          user: {
            id: user._id,
            name: user.name,
            mobile: user.mobile,
            email: user.email,
            accountType: user.accountType,
            balance: user.balance,
            status: user.status,
          },
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message || "Error fetching user data",
        });
      }
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("SwiftPay API is running");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
