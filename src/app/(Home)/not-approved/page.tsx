"use client";
import { IconCircleChevronRight } from "@tabler/icons-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Home() {
  const router = useRouter();
  return (
    <section className="bg-base-300 h-[calc(100vh-6rem)] flex items-center">
      <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
        <div className="mr-auto place-self-center lg:col-span-7">
          <h1 className="max-w-2xl mb-4 text-4xl text-base-content font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl">
            Your Are Not Approved.
          </h1>
          <p className="max-w-2xl mb-6 font-light text-base-content/70 lg:mb-8 md:text-lg lg:text-xl">
            Securely upload, store, and verify digital evidence with blockchain
            integrity, cloud storage, and tamper-proof verification.
          </p>
          <button
            onClick={() => {
              axios.get("/api/auth/logout").then(() => {
                toast.success("Logout Success");
                router.push("/");
              });
            }}
            className="btn btn-primary text-base font-medium text-center rounded-lg mr-4"
          >
            Logout
            <IconCircleChevronRight />
          </button>
          <a
            href="#"
            className="btn btn-outline text-base font-medium text-center rounded-lg mr-4"
          >
            Learn More
          </a>
        </div>
        <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
          <img src="/bg.png" alt="Blockchain Voting" />
        </div>
      </div>
    </section>
  );
}
