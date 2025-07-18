"use client";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otp: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const router = useRouter();
  const handleEmailVerification = async () => {
    if (!formData.email) {
      toast.error("Please enter your email");
      return;
    }
    if (formData.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      handleSubmit();
      return;
    }
    const response = axios.post("/api/auth/send-otp", {
      email: formData.email,
    });
    toast.promise(response, {
      loading: "Sending OTP...",
      success: (data: AxiosResponse) => {
        setOtp(data.data.token);
        (
          document.getElementById("otpContainer") as HTMLDialogElement
        ).showModal();
        return "OTP sent to your email";
      },
      error: (err: any) => {
        console.log(err);
        return err.response.data.message;
      },
    });
  };
  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      toast.error("Please fill all the fields");
      return;
    }
    const response = axios.post("/api/auth/login", { formData });
    toast.promise(response, {
      loading: "Signing in...",
      success: (data: AxiosResponse) => {
        router.push(data.data.route);
        return data.data.message;
      },
      error: (err: any) => {
        console.log(err);
        return err.response.data.message;
      },
    });
  };
  return (
    <div className="flex justify-center items-center w-full bg-base-200 px-5 py-5 h-[calc(100vh-5.6rem)]">
      <div className="xl:max-w-7xl bg-base-100 drop-shadow-xl border border-base-content/20 w-full rounded-md flex justify-between items-stretch px-5 xl:px-5 py-5">
        <div className="sm:w-[60%] lg:w-[50%] bg-cover bg-center items-center justify-center hidden md:flex ">
          <img src="login.png" alt="login" className="h-[500px]" />
        </div>
        <div className="mx-auto w-full lg:w-1/2 min-h-full flex flex-col items-center justify-center">
          <h1 className="text-center text-2xl sm:text-3xl font-semibold text-primary">
            Login to your account
          </h1>
          <div className="w-full mt-5 sm:mt-8">
            <div className="mx-auto w-full sm:max-w-md md:max-w-lg flex flex-col gap-5">
              <input
                type="email"
                placeholder="Enter Your Email"
                className="input input-bordered input-primary w-full text-base-content placeholder:text-base-content/70"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
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
              <div className="flex flex-col md:flex-row gap-2 md:gap-4 justify-center items-center">
                <button
                  className="btn btn-outline btn-primary btn-block max-w-[200px]"
                  onClick={handleEmailVerification}
                >
                  Login
                </button>
              </div>
              <p className="text-center mt-3 text-base text-base-content">
                Don't have an account ?{" "}
                <span
                  className="text-primary cursor-pointer"
                  onClick={() => router.push("/signup")}
                >
                  Sign Up
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
                toast.success("OTP Verified");
                (
                  document.getElementById("otpContainer") as HTMLDialogElement
                ).close();
                handleSubmit();
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
