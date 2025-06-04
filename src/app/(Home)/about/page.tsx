"use client";

const About = () => {
  return (
    <div className="px-6 py-12 bg-base-100">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary">
          About Our Evidence Management System
        </h1>
        <p className="text-lg text-base-content/70 mt-3">
          Leveraging blockchain to ensure digital evidence integrity, secure
          storage, and tamper-proof verification.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image Section */}
        <img
          src="/image.jpg"
          alt="Evidence Management"
          className="rounded-lg shadow-lg h-96 object-cover mx-auto"
        />

        {/* Text Section */}
        <div>
          <h2 className="text-2xl font-semibold text-secondary">Our Mission</h2>
          <p className="text-base-content/70 mt-3">
            Our Blockchain-Powered Evidence Management System is designed to
            provide a secure, transparent, and immutable environment for
            handling digital evidence. Whether it's for legal proceedings, law
            enforcement, or corporate audits, we ensure that every file uploaded
            is cryptographically sealed and verifiable.
          </p>

          <h2 className="text-2xl font-semibold text-secondary mt-6">
            Why Choose Our Platform?
          </h2>
          <ul className="list-disc list-inside text-base-content/70 mt-3 space-y-2">
            <li>Immutable blockchain record for every evidence submission.</li>
            <li>Secure cloud storage with cryptographic hash verification.</li>
            <li>
              Supports multimedia files including images, videos, and documents.
            </li>
            <li>Easy traceability and tamper-proof audit trails.</li>
            <li>
              Role-based access control for investigators, admins, and
              submitters.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
