"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { IconClock, IconFile, IconShield } from "@tabler/icons-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/police-stations/dashboard")
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => {
        console.error("Failed to load dashboard data:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <h1 className="text-4xl font-bold mb-6 text-center uppercase">
        Central Police Department - Case Control Unit
      </h1>

      {loading ? (
        <p className="text-center text-base-content">Loading dashboard...</p>
      ) : (
        <>
          <div className="stats shadow w-full bg-base-300">
            <div className="stat">
              <div className="stat-figure text-primary">
                <IconFile size={40} />
              </div>
              <div className="stat-title">Total Active Cases</div>
              <div className="stat-value text-primary">
                {stats?.activeCases || 0}
              </div>
              <div className="stat-desc text-base-content/60">
                {/* Optional percentage comparison */}
              </div>
            </div>

            <div className="stat">
              <div className="stat-figure text-secondary">
                <IconClock size={40} />
              </div>
              <div className="stat-title">Total Pending Investigations</div>
              <div className="stat-value text-secondary">
                {stats?.pendingInvestigations || 0}
              </div>
              <div className="stat-desc text-base-content/60">
                {/* Optional percentage comparison */}
              </div>
            </div>

            <div className="stat">
              <div className="stat-figure text-success">
                <IconShield size={40} />
              </div>
              <div className="stat-title">Total Cases</div>
              <div className="stat-value text-success">
                {stats?.totalCases || 0}
              </div>
              <div className="stat-desc text-base-content/60">
                {/* Optional percentage comparison */}
              </div>
            </div>

            <div className="stat">
              <div className="stat-figure text-secondary">
                <div className="avatar online">
                  <div className="w-16 rounded-full">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/9703/9703596.png"
                      alt="user"
                    />
                  </div>
                </div>
              </div>
              <div className="stat-value">{stats?.taskCompletion || "0%"}</div>
              <div className="stat-title">Tasks Completed</div>
              <div className="stat-desc text-secondary">
                {stats?.tasksRemaining || "No data"} remaining
              </div>
            </div>
          </div>

          <div className="bg-base-300 mt-6 p-6 rounded-lg shadow-sm border border-base-content mb-8">
            <h2 className="text-xl font-semibold text-base-content text-center mb-4">
              Case Statistics
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.monthlyCases || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="pending" fill="#FCD34D" name="Pending Cases" />
                  <Bar dataKey="solved" fill="#34D399" name="Solved Cases" />
                  <Bar dataKey="new" fill="#60A5FA" name="New Cases" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </>
  );
}
