import Case from "@/model/Cases";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const caseId = searchParams.get("caseId");
  const newStatus = searchParams.get("status");

  if (!caseId || !newStatus) {
    return NextResponse.json(
      { error: "caseId and status are required" },
      { status: 400 }
    );
  }
  try {
    const updatedCase = await Case.findOneAndUpdate(
      { caseId: caseId },
      { status: newStatus },
      { new: true }
    );
    return NextResponse.json({ updatedCase });
  } catch (error) {
    console.error("Error updating status:", error);
    return NextResponse.json(
      { error: "Error updating status" },
      { status: 500 }
    );
  }
}
