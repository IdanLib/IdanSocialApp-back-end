import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    lastName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    friends: {
      type: Array,
      default: [],
    },
    email: {
      type: String,
      unique: true,
      required: true,
      max: 50,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    picturePath: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    occupation: {
      type: String,
      default: "",
    },
    twitter: {
      type: String,
      default: "",
    },
    linkedIn: {
      type: String,
      default: "",
    },
    viewedProfile: {
      type: Number,
      default: 0,
    },
    impressions: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const user = mongoose.model("User", UserSchema);

export default user;
