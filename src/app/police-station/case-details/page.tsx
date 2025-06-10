"use client";
import { useAuth } from "@/context/AuthProvider";
import { Case } from "@/types/Cases";
import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const CasePage = () => {
  const { policeStation } = useAuth();
  const searchParams = useSearchParams();
  const caseId = searchParams.get("caseId");
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [report, setReport] = useState({
    caseId: caseId,
    stationId: "",
    report: "",
    address: "",
  });

  useEffect(() => {
    const fetchCaseData = async () => {
      try {
        const res = await axios.get(`/api/cases/getCase?caseId=${caseId}`);
        setCaseData(res.data.caseData);
        setReport((prev) => ({
          ...prev,
          stationId: res.data.caseData.policeStation._id,
          caseId: res.data.caseData.caseId,
        }));
      } catch (error) {
        console.error("Error fetching case data:", error);
      }
    };
    fetchCaseData();
  }, [caseId]);

  const handleSubmit = async () => {
    if (
      !report.report ||
      !report.address ||
      !report.caseId ||
      !report.stationId ||
      !policeStation
    ) {
      return toast.error("Please fill all fields");
    }
    try {
      const res = axios.post("/api/cases/add-report", {
        report,
        policeStation,
      });
      toast.promise(res, {
        loading: "Adding report...",
        success: "Report added successfully",
        error: "Failed to add report",
      });
    } catch (error) {
      console.error("Error adding report:", error);
      toast.error("Failed to add report");
    }
  };

  if (!caseData)
    return (
      <div className="w-full h-[calc(100vh-10rem)] flex justify-center items-center">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );

  return (
    <>
      <h1 className="text-4xl font-bold mb-6 text-center uppercase">
        Case Details For {caseData.title}
      </h1>
      <div className="mx-auto border border-base-content p-6 rounded-2xl space-y-3">
        {/* Card layout for case data */}
        <div className="card bg-base-100 shadow-xl p-4">
          <div className="card-body">
            <h2 className="card-title">Case ID</h2>
            <p>{caseData.caseId}</p>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl p-4">
          <div className="card-body">
            <h2 className="card-title">Police Station Name</h2>
            <p>{caseData.policeStation.stationName}</p>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl p-4">
          <div className="card-body">
            <h2 className="card-title">Case Name</h2>
            <p>{caseData.title}</p>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl p-4">
          <div className="card-body">
            <h2 className="card-title">Description</h2>
            <p>{caseData.description}</p>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl p-4">
          <div className="card-body">
            <h2 className="card-title">Case Type</h2>
            <p>{caseData.type}</p>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl p-4">
          <div className="card-body">
            <h2 className="card-title">Case Priority</h2>
            <span
              className={`badge ${
                caseData.priority === "high"
                  ? "badge-error"
                  : caseData.priority === "medium"
                  ? "badge-warning"
                  : "badge-success"
              }`}
            >
              {caseData.priority}
            </span>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl p-4">
          <div className="card-body">
            <h2 className="card-title">Case Date</h2>
            <p>{new Date(caseData.date).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl p-4">
          <div className="card-body">
            <h2 className="card-title">Status</h2>
            <p>{caseData.status}</p>
          </div>
        </div>

        {/* Evidence Section */}
        <div className="card bg-base-100 shadow-xl p-4">
          <div className="card-body">
            <h2 className="card-title">Evidences</h2>
            {caseData.evidence.length > 0 ? (
              <ul>
                {caseData.evidence.map((e, index) => (
                  <li key={index} className="text-center">
                    {e.description} -{" "}
                    <Link
                      href={`/${e.path.replace(/^public\\/, "")}`}
                      target="_blank"
                      className="link link-primary"
                    >
                      View
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No evidence added.</p>
            )}
          </div>
        </div>

        {/* Button to open the report modal */}
        <button
          className="btn btn-primary btn-circle btn-outline w-full mt-6"
          onClick={() => {
            (
              document.getElementById("report") as HTMLDialogElement
            ).showModal();
          }}
        >
          Report
        </button>
      </div>

      {/* Report Modal */}
      <dialog id="report" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <h1 className="text-4xl font-bold mb-6 text-center uppercase">
            Want to Report {caseData.title} to{" "}
            {caseData.policeStation.stationName}?
          </h1>
          <div className="px-20 py-6 w-full space-y-3 bg-base-300 rounded-2xl border border-base-200 mt-6">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Case ID</legend>
              <input
                type="text"
                className="input input-primary w-full cursor-not-allowed"
                value={caseData.caseId}
                readOnly
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Title</legend>
              <input
                type="text"
                className="input input-primary w-full"
                value={caseData.title}
                placeholder="Enter case title"
                onChange={(e) => {
                  setCaseData({ ...caseData, title: e.target.value });
                }}
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Report</legend>
              <input
                type="text"
                className="input input-primary w-full"
                value={report.report}
                placeholder="Enter Report"
                onChange={(e) => {
                  setReport({ ...report, report: e.target.value });
                }}
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Address</legend>
              <input
                type="text"
                className="input input-primary w-full"
                value={report.address}
                placeholder="Enter Address"
                onChange={(e) => {
                  setReport({ ...report, address: e.target.value });
                }}
              />
            </fieldset>
          </div>
          <div className="modal-action justify-center">
            <form method="dialog" className="flex gap-4">
              <button
                className="btn btn-primary btn-outline"
                onClick={handleSubmit}
              >
                Add Report
              </button>
              <button className="btn btn-secondary">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default CasePage;
