"use client";
import "../globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "@/context/AuthProvider";
import { useEffect } from "react";
import axios from "axios";
import SideNav from "./SideNav";

const Component = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { setPoliceStation } = useAuth();
  useEffect(() => {
    fetchUser();
  }, []);
  const fetchUser = async () => {
    const res = await axios.get("/api/auth/verifytoken");
    if (res.data) {
      setPoliceStation(res.data.user);
    }
  };
  return (
    <html lang="en" data-theme="forest">
      <head>
        <title>
          Evidence Management System | A Blockchain-Based Digital Evidence
          Management System
        </title>
        <meta
          name="description"
          content=" A Blockchain-Based Digital Evidence Management System | Securely upload, store, and verify digital evidence with blockchain integrity, cloud storage, and tamper-proof verification"
        />
      </head>
      <body className={`antialiased`}>
        <Toaster />
        <SideNav>{children}</SideNav>
      </body>
    </html>
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <Component>{children}</Component>
    </AuthProvider>
  );
}
