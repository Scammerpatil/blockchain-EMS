import dbConfig from "@/middlewares/db.config";
import Case from "@/model/Cases";
import Evidence from "@/model/Evidence";
import PoliceStation from "@/model/PoliceStation";
import { NextRequest, NextResponse } from "next/server";

dbConfig();
interface MonthlyData {
  month: string;
  new: number;
  pending: number;
  solved: number;
}
export async function GET(req: NextRequest) {
  try {
    const [
      totalCases,
      activeCases,
      pendingInvestigations,
      policeStations,
      evidenceCount,
    ] = await Promise.all([
      Case.countDocuments(),
      Case.countDocuments({ status: "active" }),
      Case.countDocuments({ status: "pending" }),
      PoliceStation.countDocuments(),
      Evidence.countDocuments(),
    ]);

    const completedTasks = await Case.countDocuments({ status: "solved" });
    const totalTasks = await Case.countDocuments();

    const taskCompletion =
      totalTasks > 0
        ? `${Math.round((completedTasks / totalTasks) * 100)}%`
        : "0%";
    const tasksRemaining = totalTasks - completedTasks;

    // Monthly stats (group by month)
    const last12Months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return {
        year: date.getFullYear(),
        month: date.getMonth(),
        label: date.toLocaleString("default", { month: "short" }),
      };
    }).reverse();

    const monthlyCases: MonthlyData[] = [];

    for (const { year, month, label } of last12Months) {
      const start = new Date(year, month, 1);
      const end = new Date(year, month + 1, 1);

      const [newCount, pendingCount, solvedCount] = await Promise.all([
        Case.countDocuments({ date: { $gte: start, $lt: end } }),
        Case.countDocuments({
          date: { $gte: start, $lt: end },
          status: "pending",
        }),
        Case.countDocuments({
          date: { $gte: start, $lt: end },
          status: "solved",
        }),
      ]);

      monthlyCases.push({
        month: label,
        new: newCount,
        pending: pendingCount,
        solved: solvedCount,
      });
    }

    return NextResponse.json(
      {
        totalCases,
        activeCases,
        pendingInvestigations,
        policeStations,
        evidenceCount,
        taskCompletion,
        tasksRemaining,
        monthlyCases,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error fetching admin dashboard data:", error);
    return NextResponse.json(
      { message: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
