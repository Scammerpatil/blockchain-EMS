"use client";
import "../globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthProvider";

const Component = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
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
        <Navbar />
        {children}
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
