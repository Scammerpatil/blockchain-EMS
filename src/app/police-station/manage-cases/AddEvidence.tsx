import { getContract, initBlockchain } from "@/middlewares/blockchain.config";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const AddEvidencePage = ({ id, caseId }: { id: string; caseId: string }) => {
  const [evidenceData, setEvidenceData] = useState({
    id: id,
    caseId: caseId,
    description: "",
    type: "",
    file: null,
  });
  console.log(evidenceData);
  useEffect(() => {
    initBlockchain();
  }, []);

  const handleSubmit = async () => {
    setEvidenceData((prev) => ({ ...prev, id: id, caseId: caseId }));
    console.log(evidenceData);
    if (
      !evidenceData.description ||
      !evidenceData.type ||
      !evidenceData.file ||
      !evidenceData.caseId ||
      !evidenceData.id
    ) {
      toast.error("Please fill all fields");
      return;
    }
    if (!window.ethereum) {
      toast.error("MetaMask is not installed!");
      return;
    }

    const contract = await getContract();
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const walletAddress = accounts[0];

    if (!contract) {
      toast.error("Failed to fetch contract");
      return;
    }

    try {
      toast.loading("Uploading evidence...");

      const res = await axios.postForm(
        "/api/evidence/addEvidence",
        evidenceData
      );

      if (res.status === 200) {
        toast.dismiss();
        toast.success(res.data.message);

        toast.loading("Adding evidence to blockchain...");

        const { caseId, hash, type, description, date } = res.data.evidenceData;
        const transaction = await contract.createEvidence(
          caseId,
          hash,
          type,
          description,
          date,
          walletAddress
        );
        await transaction.wait();

        toast.dismiss();
        toast.success("Evidence added to blockchain successfully!");

        setEvidenceData({
          id: id,
          caseId: caseId,
          description: "",
          type: "",
          file: null,
        });

        (document.getElementById("addEvidence") as HTMLDialogElement)?.close();
      }
    } catch (error: any) {
      toast.dismiss();
      console.error(error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <dialog id="addEvidence" className="modal">
      <div className="modal-box w-11/12 max-w-5xl">
        <h3 className="font-bold text-3xl uppercase text-center">
          Add New Evidence For {caseId}
        </h3>
        <div className="px-20 py-6 w-full space-y-3 bg-base-300 rounded-2xl border border-base-200 mt-6">
          {/* Case ID Field */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Case ID</legend>
            <input
              type="text"
              className="input input-primary w-full"
              value={caseId}
              readOnly
            />
          </fieldset>

          {/* Description Field */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Description</legend>
            <textarea
              className="textarea textarea-primary w-full"
              value={evidenceData.description}
              placeholder="Enter case description"
              onChange={(e) =>
                setEvidenceData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </fieldset>

          {/* Evidence Type Dropdown */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Evidence Type</legend>
            <select
              value={evidenceData.type}
              className="select select-primary select-bordered w-full"
              onChange={(e) =>
                setEvidenceData((prev) => ({ ...prev, type: e.target.value }))
              }
            >
              <option value="">Select Type</option>
              <option value="Photo">Photo</option>
              <option value="Document">Document</option>
              <option value="Video">Video</option>
              <option value="Audio">Audio</option>
              <option value="Physical">Physical</option>
            </select>
          </fieldset>

          {/* File Upload Field */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Upload Evidence</legend>
            <input
              type="file"
              className="file-input file-input-primary w-full"
              onChange={(e) =>
                setEvidenceData((prev) => ({
                  ...prev,
                  file: e.target.files?.[0] || null,
                }))
              }
            />
          </fieldset>
        </div>

        {/* Modal Action Buttons */}
        <div className="modal-action justify-center">
          <form method="dialog" className="flex gap-4">
            <button
              className="btn btn-primary btn-outline"
              onClick={handleSubmit}
            >
              Add Evidence
            </button>
            <button className="btn btn-secondary">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default AddEvidencePage;
