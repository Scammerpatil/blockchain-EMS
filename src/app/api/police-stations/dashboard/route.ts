import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConfig from "@/middlewares/db.config";
import PoliceStation from "@/model/PoliceStation";
import Case from "@/model/Cases";

dbConfig();

export async function GET(req: NextRequest) {
  const token = await req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      email: string;
    };

    const policeStation = await PoliceStation.findOne({ email: decoded.email });
    if (!policeStation) {
      return NextResponse.json(
        { message: "Police station not found" },
        { status: 404 }
      );
    }

    const cases = await Case.find({ policeStation: policeStation._id });

    const activeCases = cases.filter((c) => c.status === "active").length;
    const pendingInvestigations = cases.filter(
      (c) => c.status === "pending"
    ).length;

    const currentYear = new Date().getFullYear();
    const monthlyCases = Array.from({ length: 12 }, (_, i) => {
      const month = i;
      const monthCases = cases.filter((c) => {
        const d = new Date(c.date);
        return d.getMonth() === month && d.getFullYear() === currentYear;
      });

      return {
        month: new Date(0, i).toLocaleString("default", { month: "short" }),
        pending: monthCases.filter((c) => c.status === "pending").length,
        solved: monthCases.filter((c) => c.status === "solved").length,
        new: monthCases.length,
      };
    });

    const stats = {
      activeCases,
      pendingInvestigations,
      totalCases: cases.length || 0,
      taskCompletion: policeStation.taskCompletion || "0%",
      tasksRemaining: policeStation.tasksRemaining || "No data",
      monthlyCases,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { message: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
