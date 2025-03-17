import dbConfig from "@/middlewares/db.config";
import Case from "@/model/Cases";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function GET(req: NextRequest) {
  const serachParams = req.nextUrl.searchParams;
  const caseId = serachParams.get("caseId");
  if (!caseId) {
    return NextResponse.json(
      { message: "Case ID is required" },
      { status: 400 }
    );
  }
  try {
    const caseData = await Case.findOne({ caseId: caseId })
      .populate("evidence")
      .populate("policeStation");
    if (!caseData) {
      return NextResponse.json({ message: "Case not found" }, { status: 404 });
    }
    return NextResponse.json({ caseData }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
