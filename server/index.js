const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 5000;
const mongoose = require("mongoose");
const User = require("./models/User");
const Transaction = require("./models/Transaction");

// middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://swiftpay-nasib-client.vercel.app",
    ],
    credentials: true,
  })
);

// MongoDB connection string
const uri = process.env.MONGODB_URI;

// Mongoose connection
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

        // Check if user already exists
        const existingUser = await User.findOne({
          $or: [{ mobile }, { email }, { nid }],
        });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: "User already exists",
          });
        }

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
        }).lean();

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

        // Check if user is active
        if (user.status !== "active") {
          return res
            .status(400)
            .json({ success: false, message: "This account is not active" });
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
          user,
        });
      } catch (error) {
        res.status(400).json({
          success: false,
          message: error.message || "Login failed",
        });
      }
    });

    // Get current user details
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
          user,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message || "Error fetching user data",
        });
      }
    });

    // Check if user exists by phone number
    app.get("/api/users/check/:phone", verifyToken, async (req, res) => {
      try {
        const user = await User.findOne({ mobile: req.params.phone })
          .select("name mobile accountType status")
          .lean();

        if (!user) {
          return res.status(404).json({
            success: false,
            message: "User not found",
          });
        }

        if (user.status !== "active") {
          return res.status(400).json({
            success: false,
            message: "This account is not active",
          });
        }

        res.status(200).json({
          success: true,
          user: {
            name: user.name,
            mobile: user.mobile,
            accountType: user.accountType,
          },
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message || "Error checking user",
        });
      }
    });

    // Send Money
    app.post("/api/transactions/send-money", verifyToken, async (req, res) => {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        const { receiverPhone, amount, pin } = req.body;
        const senderId = req.user.id;

        // Validate amount
        if (parseFloat(amount) < 50) {
          throw new Error("Minimum amount is 50 taka");
        }

        // Calculate fee
        const fee = parseFloat(amount) >= 100 ? 5 : 0;
        const totalAmount = parseFloat(amount) + fee;

        // Find sender
        const sender = await User.findById(senderId);
        if (!sender) {
          throw new Error("Sender not found");
        }

        // Find admin
        const admin = await User.findOne({ accountType: "admin" });
        if (!admin) {
          throw new Error("Admin not found");
        }

        // Verify PIN
        const isPinValid = await bcrypt.compare(pin, sender.pin);
        if (!isPinValid) {
          throw new Error("Invalid PIN");
        }

        // Check sender's balance
        if (sender.balance < totalAmount) {
          throw new Error("Insufficient balance");
        }

        // Find receiver
        const receiver = await User.findOne({ mobile: receiverPhone });
        if (!receiver) {
          throw new Error("Receiver not found");
        }

        // Check receiver's account type
        if (
          receiver.accountType === "agent" ||
          receiver.accountType === "admin"
        ) {
          throw new Error("Sorry. You can only send money to users");
        }

        // Create transaction
        const transaction = await Transaction.create({
          transactionType: "send-money",
          amount,
          fee,
          sender: sender._id,
          receiver: receiver._id,
          status: "completed",
        });

        sender.balance -= parseFloat(totalAmount);
        receiver.balance += parseFloat(amount);
        admin.income += 5;

        await sender.save({ session });
        await receiver.save({ session });
        await admin.save({ session });
        await transaction.save({ session });

        await session.commitTransaction();

        res.status(200).json({
          success: true,
          message: "Money sent successfully",
          transaction: {
            reference: transaction.reference,
            amount,
            fee,
            receiverName: receiver.name,
            receiverPhone: receiver.mobile,
            date: transaction.createdAt,
          },
        });
      } catch (error) {
        await session.abortTransaction();

        res.status(400).json({
          success: false,
          message: error.message || "Failed to send money",
        });
      } finally {
        session.endSession();
      }
    });

    // Cash Out
    app.post("/api/transactions/cash-out", verifyToken, async (req, res) => {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        const { agentPhone, amount, pin } = req.body;
        const userId = req.user.id;

        // Validate amount
        if (parseFloat(amount) <= 0) {
          throw new Error("Amount must be greater than 0");
        }

        // Calculate fees
        const totalFee = parseFloat(amount) * 0.015; // 1.5% total fee
        const agentFee = parseFloat(amount) * 0.01; // 1% for agent
        const adminFee = parseFloat(amount) * 0.005; // 0.5% for admin
        const totalAmount = parseFloat(amount) + totalFee;

        // Find user
        const user = await User.findById(userId);
        if (!user) {
          throw new Error("User not found");
        }

        // Verify PIN
        const isPinValid = await bcrypt.compare(pin, user.pin);
        if (!isPinValid) {
          throw new Error("Invalid PIN");
        }

        // Check user's balance
        if (user.balance < totalAmount) {
          throw new Error("Insufficient balance");
        }

        // Find agent
        const agent = await User.findOne({
          mobile: agentPhone,
          accountType: "agent",
          status: "active",
        });

        if (!agent) {
          throw new Error("Agent not found or inactive");
        }

        // Find admin
        const admin = await User.findOne({ accountType: "admin" });
        if (!admin) {
          throw new Error("Admin account not found");
        }

        const transaction = await Transaction.create({
          transactionType: "cash-out",
          amount,
          fee: totalFee,
          sender: user._id,
          receiver: agent._id,
          status: "completed",
        });

        user.balance -= parseFloat(totalAmount);
        agent.balance -= parseFloat(amount);
        agent.income += parseFloat(agentFee);
        admin.income += parseFloat(adminFee);

        await user.save({ session });
        await agent.save({ session });
        await admin.save({ session });
        await transaction.save({ session });

        await session.commitTransaction();

        res.status(200).json({
          success: true,
          message: "Cash out successful",
          transaction: {
            reference: transaction.reference,
            amount,
            fee: totalFee,
            agentName: agent.name,
            agentPhone: agent.mobile,
            date: transaction.createdAt,
          },
        });
      } catch (error) {
        await session.abortTransaction();

        res.status(400).json({
          success: false,
          message: error.message || "Failed to cash out",
        });
      } finally {
        session.endSession();
      }
    });

    // Cash In
    app.post("/api/transactions/cash-in", verifyToken, async (req, res) => {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        const { userPhone, amount, pin } = req.body;
        const agentId = req.user.id;

        // Verify agent
        const agent = await User.findById(agentId);
        if (
          !agent ||
          agent.accountType !== "agent" ||
          agent.status !== "active"
        ) {
          throw new Error(
            "Unauthorized. Only active agents can perform cash-in"
          );
        }

        // Verify PIN
        const isPinValid = await bcrypt.compare(pin, agent.pin);
        if (!isPinValid) {
          throw new Error("Invalid PIN");
        }

        // Find user
        const user = await User.findOne({
          mobile: userPhone,
          accountType: "user",
          status: "active",
        });

        if (!user) {
          throw new Error("User not found or inactive");
        }

        const transaction = await Transaction.create({
          transactionType: "cash-in",
          amount: parseFloat(amount),
          fee: 0,
          sender: agent._id,
          receiver: user._id,
          status: "completed",
        });

        user.balance += parseFloat(amount);
        agent.balance -= parseFloat(amount);

        // Check agent's balance
        if (agent.balance < 0) {
          throw new Error("Insufficient agent balance");
        }

        await user.save({ session });
        await agent.save({ session });
        await transaction.save({ session });

        await session.commitTransaction();

        res.status(200).json({
          success: true,
          message: "Cash in successful",
          transaction: {
            reference: transaction.reference,
            amount,
            userName: user.name,
            userPhone: user.mobile,
            date: transaction.createdAt,
          },
        });
      } catch (error) {
        await session.abortTransaction();

        res.status(400).json({
          success: false,
          message: error.message || "Failed to process cash in",
        });
      } finally {
        session.endSession();
      }
    });

    // Get System Stats
    app.get("/api/admin/stats", verifyToken, async (req, res) => {
      try {
        if (req.user.accountType !== "admin") {
          return res.status(403).json({
            success: false,
            message: "Access denied",
          });
        }

        // Aggregate total money in system
        const totalMoney = await User.aggregate([
          {
            $group: {
              _id: null,
              total: { $sum: "$balance" },
            },
          },
        ]);

        // Get admin income
        const admin = await User.findById(req.user.id).select("income");

        res.status(200).json({
          success: true,
          data: {
            totalSystemMoney: totalMoney[0]?.total || 0,
            adminIncome: admin.income,
          },
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message || "Error fetching system stats",
        });
      }
    });

    // Get Agent Stats
    app.get("/api/agent/stats", verifyToken, async (req, res) => {
      try {
        if (req.user.accountType !== "agent") {
          return res.status(403).json({
            success: false,
            message: "Access denied",
          });
        }

        const agent = await User.findById(req.user.id).select("balance income");

        res.status(200).json({
          success: true,
          data: {
            balance: agent.balance,
            income: agent.income,
          },
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message || "Error fetching agent stats",
        });
      }
    });

    // Get User Balance
    app.get("/api/users/balance", verifyToken, async (req, res) => {
      try {
        const user = await User.findById(req.user.id).select("balance");

        res.status(200).json({
          success: true,
          data: {
            balance: user.balance,
          },
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message || "Error fetching balance",
        });
      }
    });

    // Balance Request
    app.post("/api/agent/balance-request", verifyToken, async (req, res) => {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        const { amount, reason, pin } = req.body;
        const agentId = req.user.id;

        // Verify agent
        const agent = await User.findById(agentId);
        if (
          !agent ||
          agent.accountType !== "agent" ||
          agent.status !== "active"
        ) {
          throw new Error(
            "Unauthorized. Only active agents can request balance"
          );
        }

        // Verify PIN
        const isPinValid = await bcrypt.compare(pin, agent.pin);
        if (!isPinValid) {
          throw new Error("Invalid PIN");
        }

        // Find admin
        const admin = await User.findOne({ accountType: "admin" });
        if (!admin) {
          throw new Error("Admin account not found");
        }

        const transaction = await Transaction.create({
          transactionType: "balance-request",
          amount,
          fee: 0,
          sender: admin._id,
          receiver: agent._id,
          status: "pending",
          note: reason,
        });

        await transaction.save({ session });
        await session.commitTransaction();

        res.status(200).json({
          success: true,
          message: "Balance request submitted successfully",
          transaction: {
            reference: transaction.reference,
            amount,
            date: transaction.createdAt,
          },
        });
      } catch (error) {
        await session.abortTransaction();
        res.status(400).json({
          success: false,
          message: error.message || "Failed to submit balance request",
        });
      } finally {
        session.endSession();
      }
    });

    // Pending balance requests
    app.get("/api/admin/balance-requests", verifyToken, async (req, res) => {
      try {
        if (req.user.accountType !== "admin") {
          return res.status(403).json({
            success: false,
            message: "Access denied",
          });
        }

        const requests = await Transaction.find({
          transactionType: "balance-request",
          status: "pending",
        })
          .sort({ createdAt: -1 })
          .populate("receiver", "name mobile email balance");

        res.status(200).json({
          success: true,
          requests,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message || "Error fetching balance requests",
        });
      }
    });

    // Process balance request
    app.patch(
      "/api/admin/balance-requests/:requestId",
      verifyToken,
      async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
          if (req.user.accountType !== "admin") {
            throw new Error("Access denied");
          }

          const { status } = req.body;
          const { requestId } = req.params;

          if (!["completed", "rejected"].includes(status)) {
            throw new Error("Invalid status");
          }

          // Find and update transaction
          const transaction = await Transaction.findOne({
            _id: requestId,
            transactionType: "balance-request",
            status: "pending",
          }).populate("receiver");

          if (!transaction) {
            throw new Error("Balance request not found or already processed");
          }

          if (status === "completed") {
            // Update agent's balance
            const agent = await User.findById(transaction.receiver._id);
            const admin = await User.findOne({ accountType: "admin" });
            agent.balance += 100000;
            admin.income += 5;
            await agent.save({ session });
            await admin.save({ session });
          }

          transaction.status = status;
          await transaction.save({ session });

          await session.commitTransaction();

          res.status(200).json({
            success: true,
            message: `Balance request ${status}`,
            transaction,
          });
        } catch (error) {
          await session.abortTransaction();
          res.status(400).json({
            success: false,
            message: error.message || "Failed to process balance request",
          });
        } finally {
          session.endSession();
        }
      }
    );

    // Get all users
    app.get("/api/admin/users", verifyToken, async (req, res) => {
      try {
        if (req.user.accountType !== "admin") {
          return res.status(403).json({
            success: false,
            message: "Access denied",
          });
        }

        const { search } = req.query;
        let query = { accountType: { $in: ["user", "agent"] } };

        if (search) {
          query.mobile = new RegExp(search, "i");
        }

        const users = await User.find(query)
          .select("-pin")
          .sort({ createdAt: -1 });

        res.status(200).json({
          success: true,
          users,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message || "Error fetching users",
        });
      }
    });

    // Update user status
    app.patch(
      "/api/admin/users/:userId/status",
      verifyToken,
      async (req, res) => {
        try {
          if (req.user.accountType !== "admin") {
            return res.status(403).json({
              success: false,
              message: "Access denied",
            });
          }

          const { status } = req.body;
          const { userId } = req.params;

          const user = await User.findByIdAndUpdate(
            userId,
            { status },
            { new: true }
          ).select("-pin");

          if (!user) {
            return res.status(404).json({
              success: false,
              message: "User not found",
            });
          }

          res.status(200).json({
            success: true,
            message: "User status updated successfully",
            user,
          });
        } catch (error) {
          res.status(500).json({
            success: false,
            message: error.message || "Error updating user status",
          });
        }
      }
    );

    // Get all transactions
    app.get("/api/transactions", verifyToken, async (req, res) => {
      try {
        const transactions = await Transaction.find({}).sort({ createdAt: -1 });

        res.status(200).json({
          success: true,
          transactions,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message || "Error fetching transactions",
        });
      }
    });

    // Get User/Agent Transactions
    app.get("/api/transactions/:userId?", verifyToken, async (req, res) => {
      try {
        const userId = req.params.userId || req.user.id;

        // If requesting other user's transactions, verify admin
        if (userId !== req.user.id && req.user.accountType !== "admin") {
          return res.status(403).json({
            success: false,
            message: "Access denied",
          });
        }

        const transactions = await Transaction.find({
          $or: [{ sender: userId }, { receiver: userId }],
        })
          .sort({ createdAt: -1 })
          .limit(100)
          .populate("sender", "name mobile accountType")
          .populate("receiver", "name mobile accountType");

        res.status(200).json({
          success: true,
          transactions,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message || "Error fetching transactions",
        });
      }
    });

    // Pending agent approvals
    app.get("/api/admin/agent-approvals", verifyToken, async (req, res) => {
      try {
        if (req.user.accountType !== "admin") {
          return res.status(403).json({
            success: false,
            message: "Access denied",
          });
        }

        const agents = await User.find({
          accountType: "agent",
          status: "pending",
        })
          .select("-pin")
          .sort({ createdAt: -1 });

        res.status(200).json({
          success: true,
          agents,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message || "Error fetching agent approvals",
        });
      }
    });

    // Approve/Reject Agent
    app.patch(
      "/api/admin/agent-approvals/:agentId",
      verifyToken,
      async (req, res) => {
        try {
          if (req.user.accountType !== "admin") {
            return res.status(403).json({
              success: false,
              message: "Access denied",
            });
          }

          const { status } = req.body;
          const { agentId } = req.params;

          if (!["active", "rejected"].includes(status)) {
            return res.status(400).json({
              success: false,
              message: "Invalid status",
            });
          }

          const agent = await User.findOneAndUpdate(
            {
              _id: agentId,
              accountType: "agent",
              status: "pending",
            },
            {
              status,
              $set: {
                approvedBy: req.user.id,
                approvedAt: new Date(),
              },
            },
            { new: true }
          ).select("-pin");

          if (!agent) {
            return res.status(404).json({
              success: false,
              message: "Agent not found or already processed",
            });
          }

          res.status(200).json({
            success: true,
            message: `Agent ${
              status === "active" ? "approved" : "rejected"
            } successfully`,
            agent,
          });
        } catch (error) {
          res.status(500).json({
            success: false,
            message: error.message || "Error processing agent approval",
          });
        }
      }
    );

    // Create Withdrawal Request
    app.post("/api/agent/withdrawal-request", verifyToken, async (req, res) => {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        const { amount, reason, pin } = req.body;
        const agentId = req.user.id;

        // Verify agent
        const agent = await User.findById(agentId);
        if (
          !agent ||
          agent.accountType !== "agent" ||
          agent.status !== "active"
        ) {
          throw new Error(
            "Unauthorized. Only active agents can request withdrawals"
          );
        }

        // Verify PIN
        const isPinValid = await bcrypt.compare(pin, agent.pin);
        if (!isPinValid) {
          throw new Error("Invalid PIN");
        }

        // Check if amount is valid
        if (!amount || amount <= 0) {
          throw new Error("Invalid withdrawal amount");
        }

        // Check if agent has sufficient income
        if (!agent.income || agent.income < amount) {
          throw new Error("Insufficient income balance for withdrawal");
        }

        // Find admin
        const admin = await User.findOne({ accountType: "admin" });
        if (!admin) {
          throw new Error("Admin account not found");
        }

        const transaction = await Transaction.create({
          transactionType: "withdrawal-request",
          amount,
          fee: 0,
          sender: agent._id,
          receiver: admin._id,
          status: "pending",
          note: reason,
        });

        await transaction.save({ session });
        await session.commitTransaction();

        res.status(200).json({
          success: true,
          message: "Withdrawal request submitted successfully",
          transaction: {
            reference: transaction.reference,
            amount,
            date: transaction.createdAt,
          },
        });
      } catch (error) {
        await session.abortTransaction();
        res.status(400).json({
          success: false,
          message: error.message || "Failed to submit withdrawal request",
        });
      } finally {
        session.endSession();
      }
    });

    // Pending withdrawal requests
    app.get("/api/admin/withdrawal-requests", verifyToken, async (req, res) => {
      try {
        if (req.user.accountType !== "admin") {
          return res.status(403).json({
            success: false,
            message: "Access denied",
          });
        }

        const requests = await Transaction.find({
          transactionType: "withdrawal-request",
          status: "pending",
        })
          .sort({ createdAt: -1 })
          .populate("sender", "name mobile email income");

        res.status(200).json({
          success: true,
          requests,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message || "Error fetching withdrawal requests",
        });
      }
    });

    // Process Withdrawal Request
    app.patch(
      "/api/admin/withdrawal-requests/:requestId",
      verifyToken,
      async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
          if (req.user.accountType !== "admin") {
            throw new Error("Access denied");
          }

          const admin = await User.findOne({ accountType: "admin" });

          const { status } = req.body;
          const { requestId } = req.params;

          if (!["completed", "rejected"].includes(status)) {
            throw new Error("Invalid status");
          }

          const transaction = await Transaction.findOne({
            _id: requestId,
            transactionType: "withdrawal-request",
            status: "pending",
          }).populate("sender");

          if (!transaction) {
            throw new Error(
              "Withdrawal request not found or already processed"
            );
          }

          if (status === "completed") {
            const agent = await User.findById(transaction.sender._id);
            if (agent.income < transaction.amount) {
              throw new Error("Agent has insufficient income balance");
            }
            agent.income -= transaction.amount;
            admin.income += 5;
            await agent.save({ session });
            await admin.save({ session });
          }

          transaction.status = status;
          await transaction.save({ session });

          await session.commitTransaction();

          res.status(200).json({
            success: true,
            message: `Withdrawal request ${status}`,
            transaction,
          });
        } catch (error) {
          await session.abortTransaction();
          res.status(400).json({
            success: false,
            message: error.message || "Failed to process withdrawal request",
          });
        } finally {
          session.endSession();
        }
      }
    );
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
