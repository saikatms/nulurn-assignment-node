const mongoose = require("mongoose");
const moment = require("moment");

const users = mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    phone: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    gender: {
      type: String,
      enum: ["M", "F", "O"],
      default: "F",
    },
    password: {
      type: String,
      required: true,
    },
    country: { type: String, trim: true, required: true },
    token: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

// Virtual for date generation
users.virtual("updatedOn").get(function () {
  const generateTime = moment(this.updatedAt).format("DD-MM-YYYY h:m:ss A");
  return generateTime;
});

module.exports = mongoose.model("users", users);
