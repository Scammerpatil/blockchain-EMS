import mongoose, { Schema } from "mongoose";

const EvidenceSchema = new Schema(
  {
    caseId: {
      type: Schema.Types.ObjectId,
      ref: "Case",
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
    hash: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Evidence =
  mongoose.models.Evidence || mongoose.model("Evidence", EvidenceSchema);
export default Evidence;
