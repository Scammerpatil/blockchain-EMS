import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConfig from "@/middlewares/db.config";
import Case from "@/model/Cases";

dbConfig();

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.redirect("/login");
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const { caseId, title, description, type, priority } = await req.json();
    const newCase = new Case({
      caseId,
      title,
      description,
      type,
      priority,
      status: "pending",
      policeStation: data.id,
      date: new Date(),
    });
    await newCase.save();
    return NextResponse.json(
      { message: "Case added successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to add case" },
      { status: 500 }
    );
  }
}
