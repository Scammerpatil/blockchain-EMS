"use client";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const SignUp = () => {
  const [disabled, setDisabled] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otp, setOtp] = useState();
  const [formData, setFormData] = useState({
    stationName: "",
    stationCode: "",
    contactNumber: "",
    address: "",
    city: "",
    state: "",
    inChargeName: "",
    emergencyContact: "",
    email: "",
    password: "",
    otp: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (
      !formData.stationName ||
      !formData.stationCode ||
      !formData.contactNumber ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.inChargeName ||
      !formData.emergencyContact ||
      !formData.email ||
      !formData.password
    ) {
      toast.error("Please fill all the fields");
      return;
    }
    try {
      const response = axios.post("/api/auth/signup", { formData });
      toast.promise(response, {
        loading: "Creating Account",
        success: () => {
          router.push("/login");
          return "Account Created Successfully";
        },
        error: (err: any) => {
          console.log(err);
          return err.response?.data?.message || "Error creating account";
        },
      });
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Failed to create account");
    }
  };
  const verifyEmail = async () => {
    if (
      !formData.email ||
      !formData.email.includes("@") ||
      !formData.email.includes(".")
    ) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!formData.stationName) {
      toast.error("Please enter your station name first");
      return;
    }
    try {
      const response = axios.post("/api/helper/verify-email", {
        name: formData.stationName,
        email: formData.email,
      });
      toast.promise(response, {
        loading: "Sending Email...",
        success: (data: AxiosResponse) => {
          (
            document.getElementById("otpContainer") as HTMLDialogElement
          ).showModal();
          setOtp(data.data.token);
          return "Email Sent!!";
        },
        error: (err) => err.data?.response.message || "Something went wrong",
      });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!!!");
    }
  };
  return (
    <div className="flex justify-center items-center w-full bg-base-200 px-5 py-5 min-h-[calc(100vh-5.6rem)]">
      <div className="xl:max-w-7xl bg-base-100 drop-shadow-xl border border-base-content/20 w-full rounded-md flex justify-between items-stretch px-5 xl:px-5 py-5">
        <div className="sm:w-[60%] lg:w-[50%] bg-cover bg-center items-center justify-center hidden md:flex ">
          <img src="login.png" alt="login" className="h-[500px]" />
        </div>
        <div className="mx-auto w-full lg:w-1/2 flex flex-col items-center justify-center md:p-10 md:py-0">
          <h1 className="text-center text-2xl sm:text-3xl font-semibold text-primary">
            Create Account
          </h1>
          <div className="w-full mt-5 sm:mt-8">
            <div className="mx-auto w-full sm:max-w-md md:max-w-lg flex flex-col gap-5">
              <input
                type="text"
                placeholder="Enter The Station Name"
                className="input input-bordered input-primary w-full text-base-content placeholder:text-base-content/70"
                value={formData.stationName}
                onChange={(e) => {
                  setFormData({ ...formData, stationName: e.target.value });
                }}
              />
              <input
                type="text"
                placeholder="Enter The Station Code"
                className="input input-bordered input-primary w-full text-base-content placeholder:text-base-content/70"
                value={formData.stationCode}
                onChange={(e) => {
                  setFormData({ ...formData, stationCode: e.target.value });
                }}
              />
              <div className="flex flex-col sm:flex-row gap-3 text-base-content">
                <input
                  type="email"
                  placeholder="Enter The Station Email"
                  className="input input-bordered input-primary w-full text-base-content placeholder:text-base-content/70"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                  }}
                />
                <button
                  className="btn btn-outline btn-primary"
                  onClick={verifyEmail}
                  disabled={
                    emailVerified ||
                    !formData.email ||
                    !formData.email.includes("@") ||
                    !formData.email.includes(".")
                  }
                >
                  Verify Email
                </button>
              </div>
              <input
                type="text"
                minLength={10}
                maxLength={10}
                placeholder="Enter Your Contact No"
                className="input input-bordered input-primary w-full text-base-content placeholder:text-base-content/70"
                value={formData.contactNumber}
                onChange={(e) => {
                  setFormData({ ...formData, contactNumber: e.target.value });
                }}
              />
              <textarea
                placeholder="Enter The Station Address"
                className="textarea textarea-bordered textarea-primary w-full text-base-content placeholder:text-base-content/70"
                value={formData.address}
                onChange={(e) => {
                  setFormData({ ...formData, address: e.target.value });
                }}
              />
              <div className="flex flex-col sm:flex-row gap-3 text-base-content">
                <input
                  type="text"
                  placeholder="Enter The Station City"
                  className="input input-bordered input-primary w-full text-base-content placeholder:text-base-content/70"
                  value={formData.city}
                  onChange={(e) => {
                    setFormData({ ...formData, city: e.target.value });
                  }}
                />
                <input
                  type="text"
                  placeholder="Enter The Station State"
                  className="input input-bordered input-primary w-full text-base-content placeholder:text-base-content/70"
                  value={formData.state}
                  onChange={(e) => {
                    setFormData({ ...formData, state: e.target.value });
                  }}
                />
              </div>
              <input
                type="text"
                placeholder="Enter The Incharge Name"
                className="input input-bordered input-primary w-full text-base-content placeholder:text-base-content/70"
                value={formData.inChargeName}
                onChange={(e) => {
                  setFormData({ ...formData, inChargeName: e.target.value });
                }}
              />
              <input
                type="text"
                minLength={10}
                maxLength={10}
                placeholder="Enter The Emergency Contact No"
                className="input input-bordered input-primary w-full text-base-content placeholder:text-base-content/70"
                value={formData.emergencyContact}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    emergencyContact: e.target.value,
                  });
                }}
              />
              <label className="input input-primary input-bordered w-full flex items-center gap-2">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Your Password"
                  className="w-full text-base-content placeholder:text-base-content/70"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                  }}
                />
                {showPassword ? (
                  <IconEyeOff
                    size={20}
                    className="cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                ) : (
                  <IconEye
                    size={20}
                    className="cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                )}
              </label>
              <div className="flex items-center gap-1.5  justify-start pl-2">
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <input
                      type="checkbox"
                      className="checkbox"
                      onChange={() => {
                        setDisabled(!disabled);
                      }}
                    />
                  </label>
                </div>
                <h3 className="flex items-center whitespace-nowrap text-base text-base-content">
                  I agree to the
                  <span className="text-primary">&nbsp;Terms</span>
                  &nbsp;and
                  <span className="text-primary">&nbsp;Privacy Policy</span>.
                </h3>
              </div>
              <div className="flex flex-col md:flex-row gap-2 md:gap-4 justify-center items-center">
                <button
                  className="btn btn-outline btn-primary btn-block max-w-[200px]"
                  onClick={handleSubmit}
                  disabled={disabled || !emailVerified}
                >
                  Sign Up
                </button>
              </div>
              <p className="text-center mt-3 text-base text-base-content">
                Already have an account?{" "}
                <span
                  className="text-primary cursor-pointer"
                  onClick={() => router.push("/login")}
                >
                  Login
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <dialog id="otpContainer" className="modal">
        <div className="modal-box space-y-4">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-base-content">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg text-center text-base-content uppercase my-4">
            Please Enter The OTP
          </h3>
          <input
            type="text"
            placeholder="Enter Your OTP"
            className="input input-bordered input-primary w-full text-base-content placeholder:text-base-content/70"
            value={formData.otp}
            onChange={(e) => {
              setFormData({ ...formData, otp: e.target.value });
            }}
          />
          <button
            className="btn btn-primary w-full"
            onClick={(e) => {
              if (otp === formData.otp) {
                setEmailVerified(true);
                toast.success("OTP Verified");
                (
                  document.getElementById("otpContainer") as HTMLDialogElement
                ).close();
              } else {
                toast.error("Invalid OTP!!!");
              }
            }}
          >
            Verify
          </button>
        </div>
      </dialog>
    </div>
  );
};

export default SignUp;
