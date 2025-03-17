import mongoose, { Schema } from "mongoose";

const PoliceStationSchema = new Schema({
  stationName: {
    type: String,
    required: true,
  },
  stationCode: {
    type: String,
    unique: true,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  inChargeName: {
    type: String,
    required: true,
  },
  emergencyContact: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

const PoliceStation =
  mongoose.models.PoliceStation ||
  mongoose.model("PoliceStation", PoliceStationSchema);

export default PoliceStation;
