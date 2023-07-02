const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    item_title: {
      type: String,
      required: true,
      unique: false,
    },
    item_description: {
      type: String,
      required: true,
      unique: false,
    },
    item_location: {
      type: String,
      required: true,
      unique: false,
    },
    item_image: {
      data: {
        type: Buffer,
        required: false,
      },
      contentType: {
        type: String,
        required: false,
      },
    },
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
    user_mobile_number: {
      type: String,
      required: true,
      unique: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
