const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  mobile: {
    type: String,
    required: [true, "Mobile number is required"],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please provide a valid email",
    ],
  },
  nid: {
    type: String,
    required: [true, "NID is required"],
    unique: true,
    trim: true,
  },
  pin: {
    type: String,
    required: [true, "PIN is required"],
    minlength: 5,
    maxlength: 60,
  },
  accountType: {
    type: String,
    enum: ["user", "agent", "admin"],
    default: "user",
  },
  balance: {
    type: Number,
  },
  status: {
    type: String,
    enum: ["active", "blocked", "pending"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "transactions" }],
});

module.exports = mongoose.model("users", userSchema);
