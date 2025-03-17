"use client";
import { Case } from "@/types/Cases";
import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const CasePage = () => {
  const searchParams = useSearchParams();
  const caseId = searchParams.get("caseId");
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchCaseData = async () => {
      try {
        const res = await axios.get(`/api/cases/getCase?caseId=${caseId}`);
        setCaseData(res.data.caseData);
        console.log(res.data.caseData);
        setStatus(res.data.caseData.status);
      } catch (error) {
        console.error("Error fetching case data:", error);
      }
    };
    fetchCaseData();
  }, [caseId]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      await axios.put(`/api/cases/updateCase`, {
        caseId,
        status: newStatus,
      });
      setStatus(newStatus);
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
      <h1 className="text-4xl font-bold mb-6 text-center uppercase">
        Case Details For {caseData.title}
      </h1>
      <div className="max-w-md mx-auto border border-base-content p-6 rounded-2xl">
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
            className="textarea textarea-ghost cursor-not-allowed w-full"
            readOnly
            disabled
            value={caseData.description}
          />
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Case Type</legend>
          <input
            type="text"
            className="input input-ghost cursor-not-allowed w-full"
            readOnly
            disabled
            value={caseData.type}
          />
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Case Priority</legend>
          <input
            type="text"
            className="input input-ghost cursor-not-allowed w-full"
            readOnly
            disabled
            value={caseData.priority}
          />
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Case Date</legend>
          <input
            type="text"
            className="input input-ghost cursor-not-allowed w-full"
            readOnly
            disabled
            value={new Date(caseData.date).toLocaleDateString()}
          />
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Status</legend>
          <select
            className="select w-full"
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
          >
            <option value="active">Active</option>
            <option value="solved">Solved</option>
            <option value="pending">Pending</option>
          </select>
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
      </div>
    </>
  );
};

export default CasePage;
