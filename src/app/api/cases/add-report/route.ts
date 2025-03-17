import { NextRequest, NextResponse } from "next/server";
import ejs from "ejs";
import fs from "fs";
import nodemailer from "nodemailer";
import Case from "@/model/Cases";

export async function POST(req: NextRequest) {
  const { report, policeStation } = await req.json();
  try {
    if (
      !report.report ||
      !report.address ||
      !report.caseId ||
      !report.stationId ||
      !policeStation
    ) {
      return NextResponse.json(
        { message: "Please fill all fields" },
        { status: 400 }
      );
    }
    const caseData = await Case.findOne({
      caseId: report.caseId,
    }).populate("policeStation");
    if (!caseData) {
      return NextResponse.json({ message: "Case not found" }, { status: 404 });
    }
    const response = await reportEmail(report, policeStation, caseData);
    if (!response) {
      return NextResponse.json(
        { message: "Failed to send email" },
        { status: 500 }
      );
    }
    return NextResponse.json({ message: "Report added successfully" });
  } catch (error) {
    console.error("Error adding report:", error);
    return NextResponse.json(
      { message: "Failed to add report" },
      { status: 500 }
    );
  }
}

const reportEmail = async (report: any, policeStation: any, caseData: any) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
      user: process.env.SMTP_EMAIL || "novacops.rcpit@gmail.com",
      pass: process.env.SMTP_PASSWORD || "cvrwlvkrohgbqmse",
    },
  });
  const template = fs.readFileSync("./src/helper/reportTemplate.ejs", "utf-8");
  const mailOptions = {
    from: "EvidenceManagementSystem | No Reply <",
    to: caseData.policeStation.email,
    subject: "New Report",
    html: ejs.render(template, { report, policeStation, caseData }),
  };
  try {
    await new Promise<void>((resolve, reject) => {
      transporter.sendMail(mailOptions, (err: any, info: any) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          console.log("Email sent:", info.response);
          resolve();
        }
      });
    });
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
};
