"use client";

import {
  IconLock,
  IconCloudUpload,
  IconShieldCheck,
  IconFingerprint,
  IconUsers,
  IconSearch,
} from "@tabler/icons-react";

const features = [
  {
    title: "Immutable Blockchain Logs",
    description:
      "Every piece of evidence is cryptographically hashed and recorded on the blockchain to ensure tamper-proof verification.",
    icon: <IconFingerprint size={36} className="text-primary" />,
  },
  {
    title: "Secure Cloud Storage",
    description:
      "Uploaded files are securely stored in the cloud with proper encryption and restricted access protocols.",
    icon: <IconCloudUpload size={36} className="text-primary" />,
  },
  {
    title: "Integrity Verification",
    description:
      "Verify the originality of evidence at any point by matching hash values on-chain and off-chain.",
    icon: <IconShieldCheck size={36} className="text-primary" />,
  },
  {
    title: "Role-Based Access",
    description:
      "Custom roles for administrators, investigators, and evidence submitters to control data visibility and actions.",
    icon: <IconUsers size={36} className="text-primary" />,
  },
  {
    title: "End-to-End Encryption",
    description:
      "All data transmissions and file handling are protected using advanced encryption standards.",
    icon: <IconLock size={36} className="text-primary" />,
  },
  {
    title: "Advanced Search & Audit Trails",
    description:
      "Quickly search evidence files and review complete, immutable audit histories for accountability.",
    icon: <IconSearch size={36} className="text-primary" />,
  },
];

const Features = () => {
  return (
    <div className="px-6 py-12 bg-base-100">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-primary">Core Features</h1>
        <p className="text-lg text-base-content/70 mt-3">
          Explore the powerful features that make our platform secure, scalable,
          and reliable.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-base-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition duration-300"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-secondary">
              {feature.title}
            </h3>
            <p className="text-base-content/70 mt-2">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
