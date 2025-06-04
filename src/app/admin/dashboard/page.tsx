"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  IconBuildingBank,
  IconClock,
  IconFile,
  IconShield,
  IconUsers,
  IconDatabase,
} from "@tabler/icons-react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/admin/dashboard")
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => {
        console.error("Failed to load admin dashboard data:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <h1 className="text-4xl font-bold text-center mb-6 uppercase">
        Admin Control Center - National Case Oversight
      </h1>

      {loading ? (
        <p className="text-center text-base-content">Loading dashboard...</p>
      ) : (
        <>
          <div className="stats shadow w-full bg-base-300">
            <div className="stat">
              <div className="stat-figure text-primary">
                <IconShield size={36} />
              </div>
              <div className="stat-title">Total Cases</div>
              <div className="stat-value text-primary">
                {stats?.totalCases || 0}
              </div>
            </div>

            <div className="stat">
              <div className="stat-figure text-secondary">
                <IconBuildingBank size={36} />
              </div>
              <div className="stat-title">Police Stations</div>
              <div className="stat-value text-secondary">
                {stats?.policeStations || 0}
              </div>
            </div>

            <div className="stat">
              <div className="stat-figure text-accent">
                <IconDatabase size={36} />
              </div>
              <div className="stat-title">Total Evidences</div>
              <div className="stat-value text-accent">
                {stats?.evidenceCount || 0}
              </div>
            </div>

            <div className="stat">
              <div className="stat-figure text-info">
                <IconClock size={36} />
              </div>
              <div className="stat-title">Pending Investigations</div>
              <div className="stat-value text-info">
                {stats?.pendingInvestigations || 0}
              </div>
            </div>

            <div className="stat">
              <div className="stat-figure text-warning">
                <IconFile size={36} />
              </div>
              <div className="stat-title">Active Cases</div>
              <div className="stat-value text-warning">
                {stats?.activeCases || 0}
              </div>
            </div>

            <div className="stat">
              <div className="stat-figure">
                <div className="avatar online">
                  <div className="w-16 rounded-full">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/9703/9703596.png"
                      alt="tasks"
                    />
                  </div>
                </div>
              </div>
              <div className="stat-title">Tasks Completed</div>
              <div className="stat-value">{stats?.taskCompletion || "0%"}</div>
              <div className="stat-desc text-base-content/60">
                {stats?.tasksRemaining || "No data"} remaining
              </div>
            </div>
          </div>

          <div className="bg-base-300 mt-4 p-6 rounded-xl shadow border border-base-content/10">
            <h2 className="text-xl font-semibold text-center mb-4 text-base-content">
              Monthly Case Overview
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.monthlyCases || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="new" fill="#60A5FA" name="New Cases" />
                  <Bar dataKey="pending" fill="#FBBF24" name="Pending Cases" />
                  <Bar dataKey="solved" fill="#34D399" name="Solved Cases" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </>
  );
}
