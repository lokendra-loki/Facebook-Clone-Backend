const mongoose = require("mongoose");

//UserSchema
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 30,
    },

    email: {
      type: String,
      required: true,
      minlength: 7,
      maxlength: 30,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 200,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },

    followers: {
      type: Array,
      default: [],
    },

    followings: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
