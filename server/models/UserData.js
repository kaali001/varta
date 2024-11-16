import mongoose from "mongoose";

const UserdataSchema = new mongoose.Schema({
  socketId: String,
  ip: String,
  country: String,
  otherDetails: Object,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.model("Userdata", UserdataSchema);
