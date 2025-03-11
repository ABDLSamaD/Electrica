"use client";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(0);

  const sections = [
    { id: "introduction", title: "1. Introduction" },
    { id: "information-collected", title: "2. Information We Collect" },
    { id: "how-we-use", title: "3. How We Use Your Information" },
    { id: "information-sharing", title: "4. Information Sharing" },
    { id: "data-security", title: "5. Data Security" },
    { id: "your-rights", title: "6. Your Rights" },
    { id: "children-privacy", title: "7. Children's Privacy" },
    { id: "changes", title: "8. Changes to This Policy" },
    { id: "contact", title: "9. Contact Us" },
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

        <div className="relative mx-auto px-6">
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
          <span className="text-sm text-blue-400">Privacy Policy</span>
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
                  onClick={() => navigate("/terms")}
                  className="rounded-lg border border-gray-700 bg-transparent px-4 py-2 text-sm text-gray-300 transition-all hover:border-blue-500 hover:text-blue-400"
                >
                  Terms & Conditions
                </button>
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
              <div className="relative mb-12 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 p-8">
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-600 opacity-20 blur-3xl"></div>
                <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-indigo-600 opacity-20 blur-2xl"></div>

                <div className="relative">
                  <div className="mb-6 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-3 h-8 w-8 text-blue-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    <h2 className="text-3xl font-bold text-white">
                      Privacy Policy
                    </h2>
                  </div>

                  <p className="text-blue-200">
                    Last updated: {new Date().toLocaleDateString()}
                  </p>

                  <div className="mt-6 rounded-xl bg-white/10 p-6 backdrop-blur-sm">
                    <p className="text-blue-100">
                      At Electrica, we are committed to protecting your privacy
                      and ensuring the security of your personal information.
                      This Privacy Policy explains how we collect, use,
                      disclose, and safeguard your information when you use our
                      services or visit our website.
                    </p>
                  </div>
                </div>
              </div>

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
                      This Privacy Policy applies to all information collected
                      through our website, mobile applications, and any related
                      services, sales, marketing, or events (collectively, the
                      "Services").
                    </p>
                    <p>
                      Please read this Privacy Policy carefully as it will help
                      you understand what we do with the information that we
                      collect.
                    </p>
                  </div>
                </section>

                <section
                  id="information-collected"
                  className={activeSection === 1 ? "block" : "hidden md:block"}
                >
                  <div className="mb-4 flex items-center">
                    <div className="mr-4 h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-center text-lg font-bold leading-8 text-white">
                      2
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      Information We Collect
                    </h3>
                  </div>
                  <div className="ml-12 space-y-4">
                    <p>
                      We collect several types of information from and about
                      users of our Services, including:
                    </p>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-lg bg-gray-900/50 p-4">
                        <h4 className="mb-2 font-medium text-blue-400">
                          Personal Data
                        </h4>
                        <p className="text-sm text-gray-400">
                          Personally identifiable information, such as your
                          name, shipping address, email address, telephone
                          number, and demographic information.
                        </p>
                      </div>

                      <div className="rounded-lg bg-gray-900/50 p-4">
                        <h4 className="mb-2 font-medium text-blue-400">
                          Financial Data
                        </h4>
                        <p className="text-sm text-gray-400">
                          Payment information, such as data related to your
                          payment method (e.g. valid credit card number, card
                          brand, expiration date).
                        </p>
                      </div>

                      <div className="rounded-lg bg-gray-900/50 p-4">
                        <h4 className="mb-2 font-medium text-blue-400">
                          Technical Data
                        </h4>
                        <p className="text-sm text-gray-400">
                          Internet protocol (IP) address, browser type, browser
                          version, the pages of our Service that you visit, time
                          and date of your visit, time spent on those pages, and
                          other diagnostic data.
                        </p>
                      </div>

                      <div className="rounded-lg bg-gray-900/50 p-4">
                        <h4 className="mb-2 font-medium text-blue-400">
                          Usage Data
                        </h4>
                        <p className="text-sm text-gray-400">
                          Information about how you use our website, products,
                          and services, including which features you use and
                          your preferences.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                <section
                  id="how-we-use"
                  className={activeSection === 2 ? "block" : "hidden md:block"}
                >
                  <div className="mb-4 flex items-center">
                    <div className="mr-4 h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-center text-lg font-bold leading-8 text-white">
                      3
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      How We Use Your Information
                    </h3>
                  </div>
                  <div className="ml-12 space-y-4">
                    <p>
                      We use the information we collect in various ways,
                      including to:
                    </p>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="flex items-start rounded-lg bg-gray-900/50 p-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-blue-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-300">
                          Provide, operate, and maintain our website and
                          services
                        </span>
                      </div>

                      <div className="flex items-start rounded-lg bg-gray-900/50 p-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-blue-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-300">
                          Improve, personalize, and expand our website and
                          services
                        </span>
                      </div>

                      <div className="flex items-start rounded-lg bg-gray-900/50 p-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-blue-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-300">
                          Understand and analyze how you use our website and
                          services
                        </span>
                      </div>

                      <div className="flex items-start rounded-lg bg-gray-900/50 p-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-blue-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-300">
                          Develop new products, services, features, and
                          functionality
                        </span>
                      </div>

                      <div className="flex items-start rounded-lg bg-gray-900/50 p-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-blue-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-300">
                          Communicate with you about our services, updates, and
                          promotions
                        </span>
                      </div>

                      <div className="flex items-start rounded-lg bg-gray-900/50 p-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-blue-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-300">
                          Process your transactions and manage your account
                        </span>
                      </div>
                    </div>
                  </div>
                </section>

                <section
                  id="information-sharing"
                  className={activeSection === 3 ? "block" : "hidden md:block"}
                >
                  <div className="mb-4 flex items-center">
                    <div className="mr-4 h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-center text-lg font-bold leading-8 text-white">
                      4
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      Information Sharing
                    </h3>
                  </div>
                  <div className="ml-12 space-y-4">
                    <p>We may share your information with:</p>

                    <div className="space-y-4">
                      <div className="rounded-lg bg-gray-900/50 p-4">
                        <h4 className="mb-2 font-medium text-blue-400">
                          Service Providers
                        </h4>
                        <p className="text-sm text-gray-400">
                          We may share your information with third-party
                          vendors, service providers, contractors, or agents who
                          perform services for us or on our behalf and require
                          access to such information to do that work.
                        </p>
                      </div>

                      <div className="rounded-lg bg-gray-900/50 p-4">
                        <h4 className="mb-2 font-medium text-blue-400">
                          Business Transfers
                        </h4>
                        <p className="text-sm text-gray-400">
                          We may share or transfer your information in
                          connection with, or during negotiations of, any
                          merger, sale of company assets, financing, or
                          acquisition of all or a portion of our business to
                          another company.
                        </p>
                      </div>

                      <div className="rounded-lg bg-gray-900/50 p-4">
                        <h4 className="mb-2 font-medium text-blue-400">
                          Legal Requirements
                        </h4>
                        <p className="text-sm text-gray-400">
                          We may disclose your information where we are legally
                          required to do so in order to comply with applicable
                          law, governmental requests, a judicial proceeding,
                          court order, or legal process.
                        </p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-blue-900 bg-blue-900/20 p-4">
                      <div className="flex items-start">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mr-3 h-6 w-6 flex-shrink-0 text-blue-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <div>
                          <h4 className="font-medium text-white">
                            Important Note
                          </h4>
                          <p className="mt-1 text-sm text-blue-200">
                            We do not sell, rent, or trade your personal
                            information with third parties for their commercial
                            purposes.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section
                  id="data-security"
                  className={activeSection === 4 ? "block" : "hidden md:block"}
                >
                  <div className="mb-4 flex items-center">
                    <div className="mr-4 h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-center text-lg font-bold leading-8 text-white">
                      5
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      Data Security
                    </h3>
                  </div>
                  <div className="ml-12 space-y-4">
                    <p>
                      We have implemented appropriate technical and
                      organizational security measures designed to protect the
                      security of any personal information we process. However,
                      despite our safeguards and efforts to secure your
                      information, no electronic transmission over the Internet
                      or information storage technology can be guaranteed to be
                      100% secure.
                    </p>

                    <div className="rounded-lg bg-gray-900/50 p-4">
                      <div className="flex items-center">
                        <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600/20">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-blue-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                        </div>
                        <h4 className="font-medium text-white">
                          Our Security Measures Include:
                        </h4>
                      </div>

                      <ul className="mt-4 space-y-2 pl-14">
                        <li className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-2 h-4 w-4 text-blue-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="text-gray-400">
                            Secure Sockets Layer (SSL) encryption
                          </span>
                        </li>
                        <li className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-2 h-4 w-4 text-blue-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="text-gray-400">
                            Regular security assessments
                          </span>
                        </li>
                        <li className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-2 h-4 w-4 text-blue-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="text-gray-400">
                            Access controls and authentication procedures
                          </span>
                        </li>
                        <li className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-2 h-4 w-4 text-blue-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="text-gray-400">
                            Data encryption at rest and in transit
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section
                  id="your-rights"
                  className={activeSection === 5 ? "block" : "hidden md:block"}
                >
                  <div className="mb-4 flex items-center">
                    <div className="mr-4 h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-center text-lg font-bold leading-8 text-white">
                      6
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      Your Rights
                    </h3>
                  </div>
                  <div className="ml-12 space-y-4">
                    <p>
                      Depending on your location, you may have certain rights
                      regarding your personal information, including:
                    </p>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-lg bg-gray-900/50 p-4">
                        <div className="flex items-center">
                          <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600/20">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-blue-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </div>
                          <h4 className="font-medium text-white">
                            Right to Access
                          </h4>
                        </div>
                        <p className="mt-2 text-sm text-gray-400">
                          You have the right to request copies of your personal
                          information.
                        </p>
                      </div>

                      <div className="rounded-lg bg-gray-900/50 p-4">
                        <div className="flex items-center">
                          <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600/20">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-blue-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                              />
                            </svg>
                          </div>
                          <h4 className="font-medium text-white">
                            Right to Rectification
                          </h4>
                        </div>
                        <p className="mt-2 text-sm text-gray-400">
                          You have the right to request that we correct
                          inaccurate information about you.
                        </p>
                      </div>

                      <div className="rounded-lg bg-gray-900/50 p-4">
                        <div className="flex items-center">
                          <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600/20">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-blue-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </div>
                          <h4 className="font-medium text-white">
                            Right to Erasure
                          </h4>
                        </div>
                        <p className="mt-2 text-sm text-gray-400">
                          You have the right to request that we delete your
                          personal information in certain circumstances.
                        </p>
                      </div>

                      <div className="rounded-lg bg-gray-900/50 p-4">
                        <div className="flex items-center">
                          <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600/20">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-blue-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                              />
                            </svg>
                          </div>
                          <h4 className="font-medium text-white">
                            Right to Restriction
                          </h4>
                        </div>
                        <p className="mt-2 text-sm text-gray-400">
                          You have the right to request that we restrict the
                          processing of your personal information.
                        </p>
                      </div>
                    </div>

                    <p>
                      To exercise any of these rights, please contact us using
                      the information provided in the "Contact Us" section
                      below.
                    </p>
                  </div>
                </section>

                <section
                  id="children-privacy"
                  className={activeSection === 6 ? "block" : "hidden md:block"}
                >
                  <div className="mb-4 flex items-center">
                    <div className="mr-4 h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-center text-lg font-bold leading-8 text-white">
                      7
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      Children's Privacy
                    </h3>
                  </div>
                  <div className="ml-12 space-y-4">
                    <p>
                      Our Services are not intended for use by children under
                      the age of 13. We do not knowingly collect personally
                      identifiable information from children under 13. If you
                      are a parent or guardian and you are aware that your child
                      has provided us with personal information, please contact
                      us so that we can take necessary actions.
                    </p>

                    <div className="rounded-xl border border-blue-900 bg-blue-900/20 p-4">
                      <div className="flex items-start">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mr-3 h-6 w-6 flex-shrink-0 text-blue-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p className="text-sm text-blue-200">
                          If we become aware that we have collected personal
                          information from children without verification of
                          parental consent, we take steps to remove that
                          information from our servers.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                <section
                  id="changes"
                  className={activeSection === 7 ? "block" : "hidden md:block"}
                >
                  <div className="mb-4 flex items-center">
                    <div className="mr-4 h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-center text-lg font-bold leading-8 text-white">
                      8
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      Changes to This Policy
                    </h3>
                  </div>
                  <div className="ml-12 space-y-4">
                    <p>
                      We may update our Privacy Policy from time to time. We
                      will notify you of any changes by posting the new Privacy
                      Policy on this page and updating the "Last updated" date
                      at the top of this Privacy Policy.
                    </p>
                    <p>
                      You are advised to review this Privacy Policy periodically
                      for any changes. Changes to this Privacy Policy are
                      effective when they are posted on this page.
                    </p>
                  </div>
                </section>

                <section
                  id="contact"
                  className={activeSection === 8 ? "block" : "hidden md:block"}
                >
                  <div className="mb-4 flex items-center">
                    <div className="mr-4 h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-center text-lg font-bold leading-8 text-white">
                      9
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      Contact Us
                    </h3>
                  </div>
                  <div className="ml-12 space-y-4">
                    <p>
                      If you have any questions about this Privacy Policy,
                      please contact us:
                    </p>

                    <div className="rounded-xl bg-gray-900/50 p-6 backdrop-blur-sm">
                      <div className="grid gap-6 md:grid-cols-2">
                        <div>
                          <h4 className="mb-2 text-lg font-medium text-white">
                            Electrica
                          </h4>
                          <p className="text-gray-400">123 Power Avenue</p>
                          <p className="text-gray-400">
                            Circuit City, EC 12345
                          </p>
                        </div>
                        <div>
                          <div className="mb-3 flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="mr-2 h-5 w-5 text-blue-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                            <span className="text-gray-300">
                              privacy@electrica.com
                            </span>
                          </div>
                          <div className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="mr-2 h-5 w-5 text-blue-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                            <span className="text-gray-300">
                              (555) 123-4567
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
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
                    onClick={() => navigate("/terms")}
                    className="rounded-lg border border-gray-700 bg-transparent px-4 py-2 text-sm text-gray-300 transition-all hover:border-blue-500 hover:text-blue-400"
                  >
                    Terms & Conditions
                  </button>
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
                    href="/privacy-policy"
                    className="text-sm text-gray-400 transition-colors hover:text-blue-400"
                  >
                    Privacy Policy
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
