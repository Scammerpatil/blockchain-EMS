import PoliceStation from "@/model/PoliceStation";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");
  const isVerified = searchParams.get("isVerified");
  if (!id || !isVerified) {
    return NextResponse.json({ message: "Invalid Request" }, { status: 400 });
  }
  try {
    await PoliceStation.findByIdAndUpdate(id, { isVerified });
    return NextResponse.json(
      { message: "Police Station Verified" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
