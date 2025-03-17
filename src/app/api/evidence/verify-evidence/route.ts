import Case from "@/model/Cases";
import Evidence from "@/model/Evidence";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log("Verifying evidence");
  const formData = await req.formData();
  const caseId = formData.get("caseId");
  const evidence = formData.get("evidence");
  fs.mkdirSync("tmp", { recursive: true });
  const filePath = path.join("tmp", (evidence as File).name);
  const buffer = Buffer.from(await (evidence as File).arrayBuffer());
  fs.writeFileSync(filePath, buffer);
  if (!caseId || !evidence) {
    return NextResponse.json(
      { message: "Please select a case and upload an evidence" },
      { status: 400 }
    );
  }
  try {
    const caseData = await Case.findById(caseId);
    if (caseData.evidence.length === 0) {
      return NextResponse.json(
        { message: "No evidence found for this case" },
        { status: 404 }
      );
    }
    const evidences = await Evidence.find({ caseId: caseId }).populate(
      "caseId"
    );

    const hash = await hashFile(filePath);
    const evidenceData = evidences.find((e) => e.hash === hash);
    if (!evidenceData) {
      return NextResponse.json(
        { message: "Evidence not found for this case" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Evidence verified successfully", evidence: evidenceData },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to verify evidence" },
      { status: 500 }
    );
  }
}

const hashFile = async (filePath: string) => {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha256");
    const stream = fs.createReadStream(filePath);

    stream.on("data", (chunk) => {
      hash.update(chunk);
    });

    stream.on("end", () => {
      resolve(hash.digest("hex"));
    });

    stream.on("error", (err) => {
      reject(err);
    });
  });
};
