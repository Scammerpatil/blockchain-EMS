"use client";
import { Case } from "@/types/Cases";
import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const CasePage = () => {
  const searchParams = useSearchParams();
  const caseId = searchParams.get("caseId");
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [status, setStatus] = useState("");

  const fetchCaseData = async () => {
    try {
      const res = await axios.get(`/api/cases/getCase?caseId=${caseId}`);
      setCaseData(res.data.caseData);
      setStatus(res.data.caseData.status);
    } catch (error) {
      console.error("Error fetching case data:", error);
    }
  };

  useEffect(() => {
    fetchCaseData();
  }, [caseId]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      const res = axios.put(
        `/api/cases/updateCase?caseId=${caseId}&status=${newStatus}`
      );
      toast.promise(res, {
        loading: "Updating status...",
        success: () => {
          fetchCaseData();
          return "Status updated successfully";
        },
        error: "Error updating status",
      });
    } catch (error) {
      console.error("Error updating status:", error);
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
      <h1 className="text-4xl font-bold text-center mb-6 uppercase">
        Case Details: {caseData.title}
      </h1>
      <div className="card bg-base-200 shadow-lg border border-base-content/10">
        <div className="card-body space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <fieldset className="fieldset">
              <label className="label font-semibold">Case ID</label>
              <input
                type="text"
                className="input input-bordered"
                value={caseData.caseId}
                readOnly
              />
            </fieldset>
            <fieldset className="fieldset">
              <label className="label font-semibold">Date</label>
              <input
                type="text"
                className="input input-bordered"
                value={new Date(caseData.date).toLocaleDateString()}
                readOnly
              />
            </fieldset>
            <fieldset className="fieldset">
              <label className="label font-semibold">Case Type</label>
              <input
                type="text"
                className="input input-bordered"
                value={caseData.type}
                readOnly
              />
            </fieldset>
            <fieldset className="fieldset">
              <label className="label font-semibold">Priority</label>
              <input
                type="text"
                className="input input-bordered"
                value={caseData.priority}
                readOnly
              />
            </fieldset>
            <fieldset className="fieldset md:col-span-2">
              <label className="label font-semibold">Title</label>
              <input
                type="text"
                className="input input-bordered"
                value={caseData.title}
                readOnly
              />
            </fieldset>
            <fieldset className="fieldset md:col-span-2">
              <label className="label font-semibold">Description</label>
              <textarea
                className="textarea textarea-bordered"
                value={caseData.description}
                readOnly
              />
            </fieldset>
          </div>

          <fieldset className="fieldset">
            <label className="label font-semibold">Status</label>
            <select
              className="select select-primary"
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              <option value="active">Active</option>
              <option value="solved">Solved</option>
              <option value="pending">Pending</option>
            </select>
          </fieldset>

          <div className="divider">Evidences</div>
          {caseData.evidence.length > 0 ? (
            <ul className="list-disc list-inside space-y-2">
              {caseData.evidence.map((e, index) => (
                <li key={index}>
                  <span className="font-medium">{e.description}</span> —{" "}
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
            <p className="text-warning font-medium">No Evidence Added</p>
          )}
        </div>
      </div>
    </>
  );
};

export default CasePage;
