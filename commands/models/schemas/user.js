const { Schema, model, Types } = require("mongoose");

const UserSchema = new Schema(
  {
    adress: {
      type: String,
      required: true
    },
    associationReferente: {
      type: Types.ObjectId,
      // required: true,
      ref: 'Association'
    },
    name: {
      type: String,
      required: true,
    },
    familyname: {
      type: String,
      uppercase: true,
      required: true,
    },
    pseudo: {
      type: String,
      unique: true,
      required: true
    },
    postal: {
      type: Number,
      required: true
    },
    age: Number,
    mail: {
      type: String,
      default: 'contact@streetcoin.social',
      match: /^([\w-\.]+)@((?:[\w]+\.)+)([a-zA-Z]{2,4})/i,
      unique: true,
      required: function () {
        if (this.admin) return true;
        return false;
      },
    },
    phone: String,
    bio: {
      type: String,
      maxlength: 250,
      required: true
    },
    need: {
      type: String,
      required: true
    },
    project: String,
    password: {
      type: String,
      required: function () {
        if (this.admin) return true;
        return false;
      },
    },
    admin: Boolean,
    spots: {
      type: [
        {
          type: Number,
          min: 1,
          max: 20,
        },
      ],
      required: function () {
        if (this.admin) return false;
        return true;
      },
    },
  },
  { timestamps: false }
);

module.exports = model("User", UserSchema);
