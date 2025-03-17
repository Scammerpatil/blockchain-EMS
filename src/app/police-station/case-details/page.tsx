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
    console.log("Report data:", report);
    console.log("Police station:", policeStation);
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
      <div className="max-w-md mx-auto border border-base-content p-6 rounded-2xl space-y-3">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Case ID</legend>
          <input
            type="text"
            className="input input-ghost cursor-not-allowed w-full"
            readOnly
            disabled
            value={caseData.caseId}
          />
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Police Station Name</legend>
          <input
            type="text"
            className="input input-ghost cursor-not-allowed w-full"
            readOnly
            disabled
            value={caseData.policeStation.stationName}
          />
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Case Name</legend>
          <input
            type="text"
            className="input input-ghost cursor-not-allowed w-full"
            readOnly
            disabled
            value={caseData.title}
          />
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Description</legend>
          <textarea
            className="textarea textarea-ghost cursor-not-allowed w-full capitalize"
            readOnly
            disabled
            value={caseData.description}
          />
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Case Type</legend>
          <input
            type="text"
            className="input input-ghost cursor-not-allowed w-full capitalize"
            readOnly
            disabled
            value={caseData.type}
          />
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Case Priority</legend>
          <input
            type="text"
            className="input input-ghost cursor-not-allowed w-full capitalize"
            readOnly
            disabled
            value={caseData.priority}
          />
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Case Date</legend>
          <input
            type="text"
            className="input input-ghost cursor-not-allowed w-full capitalize"
            readOnly
            disabled
            value={new Date(caseData.date).toLocaleDateString()}
          />
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Status</legend>
          <input
            type="text"
            className="input input-ghost cursor-not-allowed w-full capitalize"
            readOnly
            disabled
            value={status}
          />
        </fieldset>

        <legend className="fieldset-legend">Evidences</legend>
        {caseData.evidence.length > 0 ? (
          <ul>
            {caseData.evidence.map((e, index) => (
              <li key={index} className="mx-auto text-center">
                {e.description} -{" "}
                <Link
                  href={`/${e.path.replace(/^public\\/, "")}`}
                  target="_blank"
                >
                  {" "}
                  View{" "}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <legend className="fieldset-legend">No Evidence Added</legend>
        )}

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
