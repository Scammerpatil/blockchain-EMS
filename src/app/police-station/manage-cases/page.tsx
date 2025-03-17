"use client";
import { Case } from "@/types/Cases";
import { IconFilter, IconPlus, IconSearch } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";
import AddCasePage from "./AddCase";
import AddEvidencePage from "./AddEvidence";
import { initBlockchain } from "@/middlewares/blockchain.config";
import Link from "next/link";

const ManageCasesPage = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showEvidenceUpload, setShowEvidenceUpload] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    type: "",
    dateFrom: "",
    dateTo: "",
  });
  const filterOptions = {
    type: ["Burglary", "Theft", "Assault", "Fraud", "Homicide", "Traffic"],
    status: ["Active", "Pending", "Closed", "Under Review"],
    priority: ["High", "Medium", "Low"],
  };

  const fetchCases = async () => {
    const res = await axios.get("/api/cases");
    setCases(res.data.cases);
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const filteredCases = cases.filter((c) => {
    return (
      (filters.status === "" || c.status === filters.status) &&
      (filters.priority === "" || c.priority === filters.priority) &&
      (filters.type === "" || c.type === filters.type) &&
      (searchQuery === "" ||
        c.caseId.includes(searchQuery) ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (filters.dateFrom === "" ||
        new Date(c.date) >= new Date(filters.dateFrom)) &&
      (filters.dateTo === "" || new Date(c.date) <= new Date(filters.dateTo))
    );
  });

  return (
    <>
      <h1 className="text-4xl font-bold mb-6 text-center uppercase">
        Manage your cases here
      </h1>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <label className="w-full input input-primary input-lg transition-all">
          <IconSearch className="h-[1em] opacity-50" />
          <input
            type="text"
            placeholder="Search cases by ID, title, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </label>
        <button
          className="btn btn-primary btn-lg"
          onClick={() => {
            (
              document.getElementById("addCase") as HTMLDialogElement
            ).showModal();
          }}
        >
          <IconPlus size={20} /> New Case
        </button>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn btn-secondary btn-outline btn-lg"
        >
          <IconFilter size={20} /> Filters
        </button>
      </div>
      {showFilters && (
        <div className="mb-8 p-6 border border-base-content rounded-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.keys(filterOptions).map((key) => (
              <fieldset className="fieldset" key={key}>
                <legend className="fieldset-legend">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </legend>
                <select
                  className="select select-primary select-bordered w-full"
                  value={filters[key]}
                  onChange={(e) =>
                    setFilters({ ...filters, [key]: e.target.value })
                  }
                >
                  <option value="">All {key}</option>
                  {filterOptions[key].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </fieldset>
            ))}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Date From</legend>
              <input
                type="date"
                className="input input-primary input-bordered w-full"
                value={filters.dateFrom}
                onChange={(e) =>
                  setFilters({ ...filters, dateFrom: e.target.value })
                }
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Date To</legend>
              <input
                type="date"
                className="input input-primary input-bordered w-full"
                value={filters.dateTo}
                onChange={(e) =>
                  setFilters({ ...filters, dateTo: e.target.value })
                }
              />
            </fieldset>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={() =>
                setFilters({
                  status: "",
                  priority: "",
                  type: "",
                  dateFrom: "",
                  dateTo: "",
                })
              }
              className="btn btn-secondary btn-outline"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>#</th>
              <th>Case ID</th>
              <th>Title</th>
              <th>Type</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Evidence</th>
              <th>Action</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {filteredCases.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center">
                  No cases found
                </td>
              </tr>
            ) : (
              filteredCases.map((c, idx) => (
                <tr key={c._id}>
                  <td>{idx + 1}</td>
                  <td>{c.caseId}</td>
                  <td>{c.title}</td>
                  <td>{c.type}</td>
                  <td>
                    {c.status === "active" ? (
                      <span className="badge badge-success">Active</span>
                    ) : c.status === "solved" ? (
                      <span className="badge badge-primary">Solved</span>
                    ) : (
                      <span className="badge badge-warning">Pending</span>
                    )}
                  </td>
                  <td>
                    {c.priority === "high" ? (
                      <span className="badge badge-error">High</span>
                    ) : c.priority === "medium" ? (
                      <span className="badge badge-warning">Medium</span>
                    ) : (
                      <span className="badge badge-success">Low</span>
                    )}
                  </td>
                  <td>{c.evidence.length}</td>
                  <td>
                    <button
                      onClick={() => {
                        setSelectedCase(c);
                        (
                          document.getElementById(
                            "addEvidence"
                          ) as HTMLDialogElement
                        ).showModal();
                      }}
                      className="btn btn-primary btn-sm"
                    >
                      Upload Evidence
                    </button>
                  </td>
                  <td>
                    <Link
                      href={`case?caseId=${c.caseId}`}
                      className="btn btn-primary btn-outline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <AddCasePage />
      <AddEvidencePage id={selectedCase?._id} caseId={selectedCase?.caseId} />
    </>
  );
};

export default ManageCasesPage;
