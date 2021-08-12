const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  projects: [
    {
      type: Schema.Types.ObjectId,
      ref: "projects",
    },
  ],
});

module.exports = Employee = mongoose.model("employees", EmployeeSchema);
