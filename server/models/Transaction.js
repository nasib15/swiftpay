const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  transactionType: {
    type: String,
    enum: [
      "send-money",
      "cash-in",
      "cash-out",
      "balance-request",
      "withdrawal-request",
    ],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  fee: {
    type: Number,
    default: 0,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  reference: {
    type: String,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Generate transaction reference before saving
transactionSchema.pre("save", function (next) {
  if (this.isNew) {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
    const random = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0");
    this.reference = `TRX-${dateStr}-${random}`;
  }
  next();
});

module.exports = mongoose.model("transactions", transactionSchema);
