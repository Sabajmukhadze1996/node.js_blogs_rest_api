const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: false,
    },
    description: {
      type: String,
      required: true,
      unique: false,
    },
    item_location: {
      type: String,
      required: true,
      unique: false,
    },
    // photo: {
    //   type: String,
    //   required: false,
    //   unique: false,
    //   default: "",
    // },
    user_name: {
      type: String,
      required: true,
      unique: false,
    },
    user_email: {
      type: String,
      required: true,
      unique: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
