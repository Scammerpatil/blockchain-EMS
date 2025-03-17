"use client";
import { PoliceStation } from "@/types/PoliceStation";
import { IconCheck, IconX } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ManageOrganisationPage = () => {
  const [policeStations, setPoliceStations] = useState<PoliceStation[]>([]);

  useEffect(() => {
    fetchPoliceStations();
  }, []);

  const fetchPoliceStations = async () => {
    try {
      const response = await axios.get("/api/police-stations");
      setPoliceStations(response.data.policeStations);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch Police Stations");
    }
  };

  const handleVerify = async (id: string, isVerified: boolean) => {
    try {
      const res = axios.put(
        `/api/police-stations/verify?id=${id}&isVerified=${isVerified}`
      );
      toast.promise(res, {
        loading: "Verifying...",
        success: () => {
          fetchPoliceStations();
          return "Police Station Verified Successfully";
        },
        error: "Failed to verify Police Station",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to verify Police Station");
    }
  };

  return (
    <>
      <h1 className="text-4xl text-center font-bold uppercase">
        Manage Police Stations
      </h1>
      <div className="w-full px-6 py-4">
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>#</th>
                <th>Station Name</th>
                <th>Station Code</th>
                <th>Contact</th>
                <th>Email</th>
                <th>City</th>
                <th>State</th>
                <th>In Charge</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {policeStations.length ? (
                policeStations.map((policeStation, index) => (
                  <tr key={policeStation._id!}>
                    <td>{index + 1}</td>
                    <td>{policeStation.stationName}</td>
                    <td>{policeStation.stationCode}</td>
                    <td>{policeStation.contactNumber}</td>
                    <td>{policeStation.email}</td>
                    <td>{policeStation.city}</td>
                    <td>{policeStation.state}</td>
                    <td>{policeStation.inChargeName}</td>
                    <td>
                      {policeStation.isVerified ? (
                        <button
                          className="btn btn-error btn-outline"
                          onClick={() =>
                            handleVerify(policeStation._id!, false)
                          }
                        >
                          <IconX /> Reject
                        </button>
                      ) : (
                        <button
                          className="btn btn-success btn-outline"
                          onClick={() => handleVerify(policeStation._id!, true)}
                        >
                          <IconCheck /> Verify
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="text-center">
                    No Police Stations Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ManageOrganisationPage;
