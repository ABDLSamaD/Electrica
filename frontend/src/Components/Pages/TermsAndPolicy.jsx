import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function TermsAndPolicy() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(0);

  const sections = [
    { id: "introduction", title: "1. Introduction" },
    { id: "definitions", title: "2. Definitions" },
    { id: "license", title: "3. Use License" },
    { id: "disclaimer", title: "4. Disclaimer" },
    { id: "limitations", title: "5. Limitations" },
    { id: "revisions", title: "6. Revisions" },
    { id: "links", title: "7. Links" },
    { id: "governing-law", title: "8. Governing Law" },
  ];
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-black text-gray-300">
      {/* Animated gradient header */}
      <header className="relative overflow-hidden py-8 bg-gray-50/5 backdrop-blur-md">
        {/* Electric circuit lines */}
        <div className="absolute inset-0 opacity-10">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 L100,0 L100,100 L0,100 Z"
              fill="none"
              stroke="#4f46e5"
              strokeWidth="0.5"
            ></path>
            <path d="M0,50 L100,50" stroke="#4f46e5" strokeWidth="0.5"></path>
            <path d="M50,0 L50,100" stroke="#4f46e5" strokeWidth="0.5"></path>
            <path
              d="M25,0 L25,100"
              stroke="#4f46e5"
              strokeWidth="0.5"
              strokeDasharray="4,2"
            ></path>
            <path
              d="M75,0 L75,100"
              stroke="#4f46e5"
              strokeWidth="0.5"
              strokeDasharray="4,2"
            ></path>
            <path
              d="M0,25 L100,25"
              stroke="#4f46e5"
              strokeWidth="0.5"
              strokeDasharray="4,2"
            ></path>
            <path
              d="M0,75 L100,75"
              stroke="#4f46e5"
              strokeWidth="0.5"
              strokeDasharray="4,2"
            ></path>
          </svg>
        </div>

        <div className="container relative mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative h-10 w-10">
                <div className="relative flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                ELECTRICA
              </h1>
            </div>

            <nav className="hidden md:block">
              <ul className="flex space-x-8">
                <li>
                  <Link
                    to="/"
                    className="text-sm font-medium text-gray-300 transition-colors hover:text-white"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/service"
                    className="text-sm font-medium text-gray-300 transition-colors hover:text-white"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="text-sm font-medium text-gray-300 transition-colors hover:text-white"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/project-details"
                    className="text-sm font-medium text-gray-300 transition-colors hover:text-white"
                  >
                    Project
                  </Link>
                </li>
              </ul>
            </nav>

            <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 md:hidden">
              Menu
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="mb-8 flex items-center space-x-2">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-gray-400 transition-colors hover:text-blue-400"
          >
            Home
          </button>
          <span className="text-gray-600">/</span>
          <span className="text-sm text-blue-400">Terms & Policies</span>
        </div>

        <div className="grid gap-8 md:grid-cols-4">
          {/* Sidebar navigation */}
          <div className="md:col-span-1">
            <div className="sticky top-8 rounded-xl bg-gray-900/50 p-4 backdrop-blur-sm">
              <h3 className="mb-4 text-lg font-semibold text-white">
                Contents
              </h3>
              <ul className="space-y-2">
                {sections.map((section, index) => (
                  <li key={section.id}>
                    <button
                      onClick={() => setActiveSection(index)}
                      className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        activeSection === index
                          ? "bg-blue-600/20 text-blue-400"
                          : "text-gray-400 hover:bg-gray-800 hover:text-gray-300"
                      }`}
                    >
                      {section.title}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-col space-y-2">
                <button
                  onClick={() => navigate("/cookies")}
                  className="rounded-lg border border-gray-700 bg-transparent px-4 py-2 text-sm text-gray-300 transition-all hover:border-blue-500 hover:text-blue-400"
                >
                  Cookies Policy
                </button>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="md:col-span-3">
            <div className="rounded-xl bg-gray-900/30 p-6 backdrop-blur-sm">
              <h2 className="mb-8 text-3xl font-bold text-white">
                Terms and Policies
              </h2>

              <div className="space-y-10">
                <section
                  id="introduction"
                  className={activeSection === 0 ? "block" : "hidden md:block"}
                >
                  <div className="mb-4 flex items-center">
                    <div className="mr-4 h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-center text-lg font-bold leading-8 text-white">
                      1
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      Introduction
                    </h3>
                  </div>
                  <div className="ml-12 space-y-4">
                    <p>
                      Welcome to Electrica. These Terms of Service govern your
                      use of our website and form a binding contractual
                      agreement between you, the user of the Site and us,
                      Electrica.
                    </p>
                    <p>
                      By accessing or using the Site, you agree to be bound by
                      these Terms. If you disagree with any part of the terms,
                      you may not access the Site.
                    </p>
                  </div>
                </section>

                <section
                  id="definitions"
                  className={activeSection === 1 ? "block" : "hidden md:block"}
                >
                  <div className="mb-4 flex items-center">
                    <div className="mr-4 h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-center text-lg font-bold leading-8 text-white">
                      2
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      Definitions
                    </h3>
                  </div>
                  <div className="ml-12 space-y-4">
                    <p>
                      <span className="text-blue-400">Service</span> refers to
                      the website operated by Electrica.
                    </p>
                    <p>
                      <span className="text-blue-400">Personal Data</span> is
                      any information that relates to an identified or
                      identifiable individual.
                    </p>
                    <p>
                      <span className="text-blue-400">Usage Data</span> refers
                      to data collected automatically either generated by the
                      use of the Service or from the Service infrastructure
                      itself.
                    </p>
                  </div>
                </section>

                <section
                  id="license"
                  className={activeSection === 2 ? "block" : "hidden md:block"}
                >
                  <div className="mb-4 flex items-center">
                    <div className="mr-4 h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-center text-lg font-bold leading-8 text-white">
                      3
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      Use License
                    </h3>
                  </div>
                  <div className="ml-12 space-y-4">
                    <p>
                      Permission is granted to temporarily download one copy of
                      the materials on Electrica's website for personal,
                      non-commercial transitory viewing only. This is the grant
                      of a license, not a transfer of title, and under this
                      license you may not:
                    </p>
                    <ul className="list-inside list-disc space-y-2 pl-4 text-gray-400">
                      <li>Modify or copy the materials;</li>
                      <li>Use the materials for any commercial purpose;</li>
                      <li>
                        Attempt to decompile or reverse engineer any software
                        contained on Electrica's website;
                      </li>
                      <li>
                        Remove any copyright or other proprietary notations from
                        the materials; or
                      </li>
                      <li>
                        Transfer the materials to another person or "mirror" the
                        materials on any other server.
                      </li>
                    </ul>
                  </div>
                </section>

                <section
                  id="disclaimer"
                  className={activeSection === 3 ? "block" : "hidden md:block"}
                >
                  <div className="mb-4 flex items-center">
                    <div className="mr-4 h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-center text-lg font-bold leading-8 text-white">
                      4
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      Disclaimer
                    </h3>
                  </div>
                  <div className="ml-12 space-y-4">
                    <p>
                      The materials on Electrica's website are provided on an
                      'as is' basis. Electrica makes no warranties, expressed or
                      implied, and hereby disclaims and negates all other
                      warranties including, without limitation, implied
                      warranties or conditions of merchantability, fitness for a
                      particular purpose, or non-infringement of intellectual
                      property or other violation of rights.
                    </p>
                    <p>
                      Further, Electrica does not warrant or make any
                      representations concerning the accuracy, likely results,
                      or reliability of the use of the materials on its website
                      or otherwise relating to such materials or on any sites
                      linked to this site.
                    </p>
                  </div>
                </section>

                <section
                  id="limitations"
                  className={activeSection === 4 ? "block" : "hidden md:block"}
                >
                  <div className="mb-4 flex items-center">
                    <div className="mr-4 h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-center text-lg font-bold leading-8 text-white">
                      5
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      Limitations
                    </h3>
                  </div>
                  <div className="ml-12 space-y-4">
                    <p>
                      In no event shall Electrica or its suppliers be liable for
                      any damages (including, without limitation, damages for
                      loss of data or profit, or due to business interruption)
                      arising out of the use or inability to use the materials
                      on Electrica's website, even if Electrica or a Electrica
                      authorized representative has been notified orally or in
                      writing of the possibility of such damage.
                    </p>
                  </div>
                </section>

                <section
                  id="revisions"
                  className={activeSection === 5 ? "block" : "hidden md:block"}
                >
                  <div className="mb-4 flex items-center">
                    <div className="mr-4 h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-center text-lg font-bold leading-8 text-white">
                      6
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      Revisions and Errata
                    </h3>
                  </div>
                  <div className="ml-12 space-y-4">
                    <p>
                      The materials appearing on Electrica's website could
                      include technical, typographical, or photographic errors.
                      Electrica does not warrant that any of the materials on
                      its website are accurate, complete or current. Electrica
                      may make changes to the materials contained on its website
                      at any time without notice. Electrica does not, however,
                      make any commitment to update the materials.
                    </p>
                  </div>
                </section>

                <section
                  id="links"
                  className={activeSection === 6 ? "block" : "hidden md:block"}
                >
                  <div className="mb-4 flex items-center">
                    <div className="mr-4 h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-center text-lg font-bold leading-8 text-white">
                      7
                    </div>
                    <h3 className="text-xl font-semibold text-white">Links</h3>
                  </div>
                  <div className="ml-12 space-y-4">
                    <p>
                      Electrica has not reviewed all of the sites linked to its
                      website and is not responsible for the contents of any
                      such linked site. The inclusion of any link does not imply
                      endorsement by Electrica of the site. Use of any such
                      linked website is at the user's own risk.
                    </p>
                  </div>
                </section>

                <section
                  id="governing-law"
                  className={activeSection === 7 ? "block" : "hidden md:block"}
                >
                  <div className="mb-4 flex items-center">
                    <div className="mr-4 h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-center text-lg font-bold leading-8 text-white">
                      8
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      Governing Law
                    </h3>
                  </div>
                  <div className="ml-12 space-y-4">
                    <p>
                      These terms and conditions are governed by and construed
                      in accordance with the laws and you irrevocably submit to
                      the exclusive jurisdiction of the courts in that location.
                    </p>
                  </div>
                </section>
              </div>

              <div className="mt-12 flex flex-col space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
                <button
                  onClick={() => navigate("/")}
                  className="group flex items-center rounded-lg bg-transparent px-4 py-2 text-gray-400 transition-colors hover:text-blue-400"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Back to Home
                </button>

                <div className="flex space-x-4">
                  <button
                    onClick={() => navigate("/cookies")}
                    className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    Cookies Policy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-800 bg-black/80 py-12">
        <div className="container mx-auto px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="flex items-center space-x-3">
                <div className="relative h-8 w-8">
                  <div className="absolute inset-0 rounded-full bg-blue-500 blur-sm"></div>
                  <div className="relative flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                </div>
                <span className="text-lg font-bold text-white">ELECTRICA</span>
              </div>
              <p className="mt-4 text-sm text-gray-400">
                Providing high-quality electrical services with a focus on
                safety, reliability, and customer satisfaction.
              </p>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-400 transition-colors hover:text-blue-400"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-400 transition-colors hover:text-blue-400"
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-400 transition-colors hover:text-blue-400"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-400 transition-colors hover:text-blue-400"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
                Legal
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/terms"
                    className="text-sm text-gray-400 transition-colors hover:text-blue-400"
                  >
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a
                    href="/cookies"
                    className="text-sm text-gray-400 transition-colors hover:text-blue-400"
                  >
                    Cookies Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-400 transition-colors hover:text-blue-400"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-800 pt-8 text-center">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Electrica. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
