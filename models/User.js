const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    user_name: {
      type: String,
      required: true,
      unique: false,
    },
    user_email: {
      type: String,
      required: true,
      unique: true,
    },
    user_password: {
      type: String,
      required: true,
      unique: false,
    },
    user_mobile_number: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
