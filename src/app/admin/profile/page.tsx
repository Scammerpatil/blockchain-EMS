"use client";
import { useAuth } from "@/context/AuthProvider";
import { IconCrown, IconEdit } from "@tabler/icons-react";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
const Profile = () => {
  const { user, setUser } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });
  const handleSubmit = async () => {
    (document.getElementById("editProfile") as HTMLDialogElement).close();
    const data = {
      ...user,
      name: formData.name,
      phone: formData.phone,
    };
    const res = axios.patch("/api/user/edit-profile", { user: data });
    toast.promise(res, {
      loading: "Updating Profile...",
      success: (data) => {
        setUser(data.data.user);
        return "Profile Updated Successfully!";
      },
      error: "An error occurred while updating the profile!",
    });
  };
  return (
    <>
      <h1 className="text-3xl font-bold text-primary mb-6 uppercase">
        Edit Profile
      </h1>

      {/* Profile Image */}
      <div className="relative mx-auto w-32 h-32 indicator">
        <img
          src={user?.profileImage || "/avatar.png"}
          alt="Profile Pic"
          className="rounded-full w-full h-full object-cover border-4 border-primary shadow-md"
        />
        <button className="absolute bottom-2 right-2 bg-secondary text-secondary-content p-2 rounded-full shadow-md hover:bg-secondary-focus transition">
          <IconEdit size={18} />
        </button>
      </div>

      <div className="mt-6 space-y-2">
        <h2 className="text-xl font-semibold text-primary">{user?.name}</h2>
        <p className="text-base text-base-content/80">{user?.email}</p>
        <p className="text-base text-base-content/80">{user?.phone}</p>
      </div>

      <button
        className="btn btn-primary mt-6 w-full"
        onClick={() => {
          (
            document.getElementById("editProfile") as HTMLDialogElement
          ).showModal();
        }}
      >
        Edit Profile
      </button>
      <dialog id="editProfile" className="modal">
        <div className="modal-box p-8">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <div className="p-8 flex items-center justify-center flex-col gap-6 border border-primary rounded-xl">
            <h1 className="text-3xl font-bold text-primary mb-6 uppercase">
              Edit Profile
            </h1>
            <div className="mx-auto w-full sm:max-w-md md:max-w-lg flex flex-col gap-5">
              <input
                type="text"
                placeholder="Enter Your Full Name"
                className="input input-bordered input-primary w-full text-base-content placeholder:text-base-content/70"
                value={formData?.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                }}
              />
              <input
                type="email"
                placeholder="Enter Your Email"
                className="input input-bordered input-primary w-full text-base-content placeholder:text-base-content/70"
                value={user?.email}
                readOnly
              />
              <input
                type="text"
                placeholder="Enter Your Contact No"
                className="input input-bordered input-primary w-full text-base-content placeholder:text-base-content/70"
                value={formData?.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                }}
              />
              <button
                className="btn btn-primary btn-block"
                onClick={handleSubmit}
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
};
export default Profile;
