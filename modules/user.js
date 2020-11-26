const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: { type: String, require: true },
    password: { type: String, require: true },
    createdEvents: [
      {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
