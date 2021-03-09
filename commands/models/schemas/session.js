const { Schema, model } = require("mongoose");

const SessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    key: {
      required: true,
      type: String,
    },
    expireAt: {
      required: true,
      expires: 0,
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = model("Sessions", SessionSchema);
