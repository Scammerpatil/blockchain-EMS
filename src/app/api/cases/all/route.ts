import Case from "@/model/Cases";
import { NextResponse } from "next/server";

export async function GET() {
  const cases = await Case.find()
    .populate("evidence")
    .populate("policeStation");
  return NextResponse.json({ cases }, { status: 200 });
}
