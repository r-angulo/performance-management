const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  manager: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  employees: [
    {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  ],
  measures: [
    {
      measureID: {
        type: Schema.Types.ObjectId,
        ref: "measures",
        // type: Number,
      },
      weight: { type: Number, default: 1 },
    },
  ],
  settings: {
    isLive: {
      type: Boolean,
      default: false,
    },
    canViewComments: {
      type: Boolean,
      default: false,
    },
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  feedback: [
    {
      from: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      to: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      responses: [
        {
          measure: {
            type: Schema.Types.ObjectId,
            ref: "measures",
          },
          score: {
            type: Number,
          },
          comment: {
            type: String,
          },
          date: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },
  ],
});

module.exports = Project = mongoose.model("projects", ProjectSchema);
