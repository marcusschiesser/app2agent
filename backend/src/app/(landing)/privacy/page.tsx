import Header from "../components/Header";
import Footer from "../components/Footer"; // Import the new Footer component

export default function Privacy() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 max-w-3xl py-16">
        <article className="prose prose-slate max-w-none">
          <h1 className="text-4xl font-bold mb-4">
            Privacy Policy for &quot;App2Agent&quot; by Schiesser IT, LLC
          </h1>
          <p className="font-semibold mb-8">
            Effective as of: 17th January 2025
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
          <p className="mb-4">
            Schiesser IT, LLC (&quot;Schiesser IT,&quot; &quot;we,&quot;
            &quot;us,&quot; or &quot;our&quot;) provides &quot;App2Agent&quot;
            (the &quot;Extension&quot;), a service designed to enhance web
            applications through artificial intelligence (&quot;AI&quot;)
            enhancements. This Privacy Policy (&quot;Policy&quot;) outlines our
            practices concerning the collection, use, and disclosure of personal
            information from users of the Extension.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Definitions</h2>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">
              <strong>User</strong> or <strong>You</strong> refers to any
              individual or entity using the Extension.
            </li>
            <li className="mb-2">
              <strong>Data</strong> or <strong>Personal Information</strong>{" "}
              refers to any information relating to an identified or
              identifiable natural person.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            3. Information We Collect
          </h2>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">
              <strong>Browser Window Data:</strong> The Extension collects
              information about your current browser tab when the Extension is
              active.
            </li>
            <li className="mb-2">
              <strong>IP Address:</strong> The Extension records your IP address
              for the purposes outlined in this Policy.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            4. Purpose of Data Collection
          </h2>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">
              <strong>Service Enhancement:</strong> Data is utilized to refine
              our AI models and improve the functionality of the Extension.
            </li>
            <li className="mb-2">
              <strong>Usage Analysis:</strong> IP addresses help in
              understanding usage patterns to enhance user experience.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            5. Data Retention and Storage
          </h2>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">
              <strong>Local Storage:</strong> Data is temporarily stored on your
              device to ensure seamless functionality of the Extension.
            </li>
            <li className="mb-2">
              <strong>Server Storage:</strong> Data may be stored on servers
              operated by Schiesser IT, LLC, located at 7901 4TH ST N, STE 300,
              33702 St. Petersburg, FL, USA, for analysis and improvement.
              Retention is limited to the period necessary for the stated
              purposes.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Data Security</h2>
          <p className="mb-4">
            We implement industry-standard security measures, including
            encryption during data transmissions to protect your information.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">7. User Rights</h2>
          <p className="mb-4">Users have the right to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">
              Control the data collected by opting not to use the Extension or
              by clearing browser data.
            </li>
            <li className="mb-2">
              <strong>Request Deletion:</strong> Users can opt out and request
              deletion of their data by sending an email to{" "}
              <a
                href="mailto:info@schiesser-it.com"
                className="text-blue-600 hover:underline"
              >
                info@schiesser-it.com
              </a>
              . We will process such requests in accordance with applicable laws
              and regulations.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            8. International Data Transfers
          </h2>
          <p className="mb-4">
            Your Data may be transferred outside your jurisdiction, including to
            the United States. By using the Extension, you consent to such
            transfers in accordance with this Policy.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            9. Updates to this Policy
          </h2>
          <p className="mb-4">
            Schiesser IT, LLC reserves the right to amend this Policy. Notices
            of material changes will be provided through the Extension or via
            email if contact information is available.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            10. Contact Information
          </h2>
          <p className="mb-4">
            For any inquiries regarding this Privacy Policy or the Extension,
            please contact:
          </p>
          <address className="mb-4 not-italic">
            <strong>Schiesser IT, LLC</strong>
            <br />
            7901 4TH ST N, STE 300,
            <br />
            33702 St. Petersburg, FL, USA
            <br />
            Email:{" "}
            <a
              href="mailto:info@schiesser-it.com"
              className="text-blue-600 hover:underline"
            >
              info@schiesser-it.com
            </a>
          </address>

          <h2 className="text-2xl font-semibold mt-8 mb-4">11. Consent</h2>
          <p className="mb-4">
            By installing and using &quot;App2Agent,&quot; you acknowledge and
            agree to this Privacy Policy. If you do not agree to these terms,
            please do not use the Extension.
          </p>

          <p className="mb-4">
            This document is governed by the laws of the United States and the
            state of Florida, without regard to conflict of law provisions.
          </p>

          <p className="mt-8 font-semibold">Last Revised: 17th January 2025</p>
        </article>
      </main>
      <Footer />
    </>
  );
}
