import mongoose, { Schema } from "mongoose";

const CaseSchema = new Schema({
  policeStation: {
    type: Schema.Types.ObjectId,
    ref: "PoliceStation",
    required: true,
  },
  caseId: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["active", "solved", "pending"],
  },
  priority: {
    type: String,
    required: true,
    enum: ["low", "medium", "high"],
  },
  evidence: [
    {
      type: Schema.Types.ObjectId,
      ref: "Evidence",
    },
  ],
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const Case = mongoose.models.Case || mongoose.model("Case", CaseSchema);
export default Case;
