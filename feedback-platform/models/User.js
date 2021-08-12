const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  levels: {
    type: [String],
    required: true, //this will be an array of strings
  },
  participatedProjects: [
    {
      type: Schema.Types.ObjectId,
      ref: "projects",
    },
  ],
  subordinates: [
    {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  ],
});

module.exports = User = mongoose.model("users", UserSchema);
