import dbConfig from "@/middlewares/db.config";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import Evidence from "@/model/Evidence";
import crypto from "crypto";
import path from "path";
import Case from "@/model/Cases";

dbConfig();

const EVIDENCE_FOLDER = "public/evidence";

export async function POST(req: NextRequest) {
  if (!fs.existsSync(EVIDENCE_FOLDER)) {
    fs.mkdirSync(EVIDENCE_FOLDER, { recursive: true });
  }

  const formData = await req.formData();
  const id = formData.get("id");
  const caseId = formData.get("caseId");
  const description = formData.get("description");
  const type = formData.get("type");
  const evidence = formData.get("file");

  if (!id || !caseId || !description || !type || !evidence) {
    return NextResponse.json(
      { message: "All fields are required" },
      { status: 400 }
    );
  }

  try {
    const caseFolderPath = path.join(EVIDENCE_FOLDER, caseId.toString());

    if (!fs.existsSync(caseFolderPath)) {
      fs.mkdirSync(caseFolderPath, { recursive: true });
    }

    const evidenceFileName = `evidence-${type}.${(evidence as File).name
      .split(".")
      .pop()}`;
    const evidencePath = path.join(caseFolderPath, evidenceFileName);

    const buffer = Buffer.from(await (evidence as File).arrayBuffer());
    fs.writeFileSync(evidencePath, buffer);

    const fileHash = await hashFile(evidencePath);

    const evidenceData = new Evidence({
      caseId: id,
      description,
      type,
      path: evidencePath,
      hash: fileHash,
      date: new Date(),
    });

    const existingCase = await Case.findById(id);
    existingCase.evidence.push(evidenceData._id);
    await existingCase.save();

    await evidenceData.save();

    return NextResponse.json(
      { message: "Evidence uploaded successfully", evidenceData },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
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
