import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Case from "@/model/Cases";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.redirect("/login");
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const cases = await Case.find({ policeStation: data.id });
    return NextResponse.json({ cases });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
