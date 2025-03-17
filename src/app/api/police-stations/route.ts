import dbConfig from "@/middlewares/db.config";
import PoliceStation from "@/model/PoliceStation";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function GET() {
  try {
    const policeStations = await PoliceStation.find();
    return NextResponse.json({ policeStations }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
