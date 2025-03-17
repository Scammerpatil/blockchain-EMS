"use client";
import { Case } from "@/types/Cases";
import { Evidence } from "@/types/Evidence";
import { IconCloudUpload, IconPlus, IconSearch } from "@tabler/icons-react";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const VerifyEvidencesPage = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [selectedCase, setSelectedCase] = useState("");
  const [response, setResponse] = useState("");
  const [evidence, setEvidence] = useState();
  const fetchCases = async () => {
    const res = await axios.get("/api/cases/all");
    var cases = res.data.cases as Case[];
    setCases(cases);
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const verifyEvidence = async () => {
    if (!selectedCase || !evidence) {
      toast.error("Please select a case and upload an evidence");
      return;
    }
    const res = axios.postForm(`/api/evidence/verify-evidence`, {
      caseId: selectedCase,
      evidence: evidence,
    });
    toast.promise(res, {
      loading: "Verifying evidence...",
      success: (data) => {
        console.log(data);
        setResponse(data.data.evidence);
        return "Evidence verified successfully";
      },
      error: (err) => err.response.data.message,
    });
  };
  return (
    <>
      <h1 className="text-4xl font-bold mb-6 text-center uppercase">
        Verify evidences here
      </h1>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <label className="w-full select select-primary select-lg transition-all">
          <IconSearch className="h-[1em] opacity-50" />
          <select
            value={selectedCase?._id}
            onChange={(e) => setSelectedCase(e.target.value)}
          >
            <option value="">Select a case</option>
            {cases.map((c) => (
              <option key={c._id} value={c._id}>
                {c.caseId} - {c.title}
              </option>
            ))}
          </select>
        </label>
        <button className="btn btn-primary btn-lg" onClick={verifyEvidence}>
          <IconPlus size={20} /> Verify Evidence
        </button>
      </div>

      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-base-content/80 border-dashed rounded-lg cursor-pointer bg-base-100/5">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <IconCloudUpload className="h-10 text-base-content/80" />
            <p className="mb-2 text-sm text-base-content/80">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-base-content/50">
              SVG, PNG, JPG or GIF (MAX. 800x400px)
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            onChange={(e) => {
              setEvidence(e.target.files[0]);
            }}
          />
        </label>
      </div>
      {response && (
        <>
          <h1 className="text-4xl font-bold mb-6 text-center uppercase mt-6">
            Evidence
          </h1>
          <div className="card bg-base-300 w-96 shadow-sm mx-auto">
            <figure>
              <img
                src={`/${response.path.replace(/^public\\/, "")}`}
                alt="Evidence"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title text-center">
                {response.caseId.caseId}
              </h2>
              <p>
                {response.caseId.title} - {response.caseId.description}
              </p>
              <hr className="divider" />
              <div className="card-actions justify-start">
                <Link
                  href={`case-details?caseId=${response.caseId.caseId}`}
                  className="btn btn-primary"
                >
                  View Case
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
export default VerifyEvidencesPage;
