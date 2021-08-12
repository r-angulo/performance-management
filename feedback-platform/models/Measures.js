const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MeasureSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

module.exports = Measure = mongoose.model("measures", MeasureSchema);
