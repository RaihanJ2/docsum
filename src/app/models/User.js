import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: false,
    match: [
      /^(?=.{8,30}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._' ]+(?<![_.])$/,
      "Username invalid, it should contain 8-30 characters including alphanumeric letters, spaces, apostrophes, and be unique!",
    ],
  },
  picture: {
    type: String,
    required: false,
  },
});

const User = mongoose.model("User", UserSchema);

export default User;
