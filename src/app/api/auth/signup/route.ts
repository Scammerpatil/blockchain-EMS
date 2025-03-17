import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConfig from "@/middlewares/db.config";
import PoliceStation from "@/model/PoliceStation";

dbConfig();

export async function POST(req: NextRequest) {
  try {
    const { formData } = await req.json();
    if (
      !formData.stationName ||
      !formData.stationCode ||
      !formData.contactNumber ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.inChargeName ||
      !formData.emergencyContact ||
      !formData.email ||
      !formData.password
    ) {
      return NextResponse.json(
        { message: "Please provide all the required fields" },
        { status: 400 }
      );
    }

    // Validate password length
    if (formData.password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Check if the user already exists
    const stationExists = await PoliceStation.findOne({
      email: formData.email,
    });
    if (stationExists) {
      return NextResponse.json(
        { message: "Police Station already exists" },
        { status: 400 }
      );
    }
    const hashedPassword = bcrypt.hashSync(formData.password, 10);
    const newUser = new PoliceStation({
      ...formData,
      password: hashedPassword,
    });

    await newUser.save();
    return NextResponse.json(
      { message: "Police Station created successfully", newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
