import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

const AddCasePage = () => {
  const [caseData, setCaseData] = useState({
    caseId: `CASE-${new Date().getFullYear()}-${Math.floor(
      Math.random() * 1000
    )}`,
    title: "",
    description: "",
    type: "",
    priority: "",
  });
  const handleSubmit = async () => {
    const res = axios.post("/api/cases/add-new-case", caseData);
    try {
      toast.promise(res, {
        loading: "Adding case...",
        success: "Case added successfully",
        error: "Failed to add case",
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to add case");
    }
  };
  return (
    <dialog id="addCase" className="modal">
      <div className="modal-box w-11/12 max-w-5xl">
        <h3 className="font-bold text-3xl uppercase text-center">
          Add New Case
        </h3>
        <div className="px-20 py-6 w-full space-y-3 bg-base-300 rounded-2xl border border-base-200 mt-6">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Case ID</legend>
            <input
              type="text"
              className="input input-primary w-full"
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
            <legend className="fieldset-legend">Description</legend>
            <textarea
              className="textarea textarea-primary w-full"
              value={caseData.description}
              placeholder="Enter case description"
              onChange={(e) => {
                setCaseData({ ...caseData, description: e.target.value });
              }}
            />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Prority</legend>
            <select
              value={caseData.priority}
              className="select select-primary select-bordered w-full"
              onChange={(e) => {
                setCaseData({ ...caseData, priority: e.target.value });
              }}
            >
              <option value="">Select Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Type</legend>
            <select
              value={caseData.priority}
              className="select select-primary select-bordered w-full"
              onChange={(e) => {
                setCaseData({ ...caseData, type: e.target.value });
              }}
            >
              <option value="">Select Type</option>
              {[
                "Burglary",
                "Theft",
                "Assault",
                "Fraud",
                "Homicide",
                "Traffic",
              ].map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </fieldset>
        </div>
        <div className="modal-action justify-center">
          <form method="dialog" className="flex gap-4">
            <button
              className="btn btn-primary btn-outline"
              onClick={handleSubmit}
            >
              Add Case
            </button>
            <button className="btn btn-secondary">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default AddCasePage;
