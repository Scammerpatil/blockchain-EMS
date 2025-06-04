import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import dbConfig from "@/middlewares/db.config";
import jwt from "jsonwebtoken";
import PoliceStation from "@/model/PoliceStation";

dbConfig();

const generateToken = (data: object) => {
  return jwt.sign(data, process.env.JWT_SECRET!, { expiresIn: "1d" });
};

const setTokenCookie = (response: NextResponse, token: string) => {
  response.cookies.set("token", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24,
  });
};

export async function POST(req: NextRequest) {
  const { formData } = await req.json();

  if (!formData.email || !formData.password) {
    return NextResponse.json(
      { message: "Please fill all the fields", success: false },
      { status: 400 }
    );
  }

  if (
    formData.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL &&
    formData.password === process.env.ADMIN_PASSWORD
  ) {
    const data = {
      id: "admin",
      name: "Admin",
      role: "admin",
      email: "admin@tributeconnect.com",
      profileImage: "https://cdn-icons-png.flaticon.com/512/9703/9703596.png",
      isVerified: true,
    };
    const token = generateToken(data);
    const response = NextResponse.json({
      message: "Login Success",
      success: true,
      route: `/admin/dashboard`,
    });
    setTokenCookie(response, token);
    return response;
  }

  // User login logic
  const policeStation = await PoliceStation.findOne({ email: formData.email });
  if (!policeStation) {
    return NextResponse.json(
      { message: "User not found", success: false },
      { status: 400 }
    );
  }
  const isPasswordValid = await bcryptjs.compare(
    formData.password,
    policeStation.password
  );

  if (isPasswordValid) {
    const data = {
      id: policeStation._id,
      role: "police-station",
      email: policeStation.email,
      name: policeStation.stationName,
      profilImage:
        "https://i.pinimg.com/736x/fe/bb/bd/febbbd07bc1e1a7769e0015382bae24e.jpg",
      isVerified: policeStation.isVerified,
    };
    const token = generateToken(data);
    const response = NextResponse.json({
      message: "Login Success",
      success: true,
      route: `/police-station/dashboard`,
      policeStation,
    });
    setTokenCookie(response, token);
    return response;
  } else {
    return NextResponse.json(
      { message: "Invalid Credentials", success: false },
      { status: 400 }
    );
  }
}
