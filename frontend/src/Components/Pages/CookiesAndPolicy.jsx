"use client";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function CookiesPolicy() {
  const navigate = useNavigate();
  const [showCookieConsent, setShowCookieConsent] = useState(true);
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
                <div className="absolute inset-0 rounded-full bg-blue-500 blur-sm"></div>
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
          <span className="text-sm text-blue-400">Cookies Policy</span>
        </div>

        <div className="mx-auto max-w-4xl">
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
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h2 className="text-3xl font-bold text-white">
                  Cookies Policy
                </h2>
              </div>

              <p className="text-blue-200">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <div className="mt-6 rounded-xl bg-white/10 p-6 backdrop-blur-sm">
                <p className="text-blue-100">
                  This Cookies Policy explains what cookies are and how we use
                  them. You should read this policy to understand what cookies
                  are, how we use them, the types of cookies we use, and how to
                  control your cookie preferences.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-12">
            <section>
              <div className="mb-6 flex items-center">
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
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">
                  What Are Cookies
                </h3>
              </div>

              <div className="ml-14">
                <p className="text-gray-400">
                  Cookies are small text files that are placed on your computer
                  or mobile device when you visit a website. They are widely
                  used to make websites work more efficiently and provide
                  information to the website owners. Cookies enhance user
                  experience by remembering your preferences and enabling
                  certain website features.
                </p>
              </div>
            </section>

            <section>
              <div className="mb-6 flex items-center">
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
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">
                  How We Use Cookies
                </h3>
              </div>

              <div className="ml-14">
                <p className="mb-4 text-gray-400">
                  Electrica uses cookies for various purposes, including:
                </p>
                <ul className="grid gap-3 sm:grid-cols-2">
                  <li className="flex items-start rounded-lg bg-gray-900/50 p-3">
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
                      To provide essential website functionality
                    </span>
                  </li>
                  <li className="flex items-start rounded-lg bg-gray-900/50 p-3">
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
                      To remember your preferences and settings
                    </span>
                  </li>
                  <li className="flex items-start rounded-lg bg-gray-900/50 p-3">
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
                      To understand how you use our website
                    </span>
                  </li>
                  <li className="flex items-start rounded-lg bg-gray-900/50 p-3">
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
                      To improve our website and services
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <div className="mb-6 flex items-center">
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
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Types of Cookies We Use
                </h3>
              </div>

              <div className="ml-14">
                <p className="mb-6 text-gray-400">
                  We use the following types of cookies on our website:
                </p>

                <div className="overflow-hidden rounded-xl bg-gray-900/50 backdrop-blur-sm">
                  <div className="grid grid-cols-1 divide-y divide-gray-800 md:grid-cols-3 md:divide-x md:divide-y-0">
                    <div className="p-6">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600/20">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-blue-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                      </div>
                      <h4 className="mb-2 text-lg font-medium text-white">
                        Essential Cookies
                      </h4>
                      <p className="text-sm text-gray-400">
                        These cookies are necessary for the website to function
                        properly. They enable basic functions like page
                        navigation and access to secure areas.
                      </p>
                      <div className="mt-4 inline-block rounded-full bg-blue-900/50 px-3 py-1 text-xs text-blue-300">
                        Session / Persistent
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600/20">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-blue-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <h4 className="mb-2 text-lg font-medium text-white">
                        Preference Cookies
                      </h4>
                      <p className="text-sm text-gray-400">
                        These cookies allow the website to remember choices you
                        make and provide enhanced, more personal features.
                      </p>
                      <div className="mt-4 inline-block rounded-full bg-blue-900/50 px-3 py-1 text-xs text-blue-300">
                        1 year
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600/20">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-blue-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                      </div>
                      <h4 className="mb-2 text-lg font-medium text-white">
                        Analytics Cookies
                      </h4>
                      <p className="text-sm text-gray-400">
                        These cookies help us understand how visitors interact
                        with our website by collecting and reporting information
                        anonymously.
                      </p>
                      <div className="mt-4 inline-block rounded-full bg-blue-900/50 px-3 py-1 text-xs text-blue-300">
                        2 years
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="mb-6 flex items-center">
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Managing Cookies
                </h3>
              </div>

              <div className="ml-14">
                <p className="mb-4 text-gray-400">
                  Most web browsers allow you to control cookies through their
                  settings preferences. However, if you limit the ability of
                  websites to set cookies, you may worsen your overall user
                  experience, as it will no longer be personalized to you.
                </p>
                <p className="mb-4 text-gray-400">
                  To manage cookies in your browser, you can:
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg bg-gray-900/50 p-4">
                    <div className="mb-2 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-2 h-5 w-5 text-blue-400"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-medium text-white">Chrome</span>
                    </div>
                    <p className="text-sm text-gray-400">
                      Settings &gt; Privacy and security &gt; Cookies and other
                      site data
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-900/50 p-4">
                    <div className="mb-2 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-2 h-5 w-5 text-blue-400"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-medium text-white">Firefox</span>
                    </div>
                    <p className="text-sm text-gray-400">
                      Options &gt; Privacy & Security &gt; Cookies and Site Data
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-900/50 p-4">
                    <div className="mb-2 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-2 h-5 w-5 text-blue-400"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-medium text-white">Safari</span>
                    </div>
                    <p className="text-sm text-gray-400">
                      Preferences &gt; Privacy &gt; Cookies and website data
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-900/50 p-4">
                    <div className="mb-2 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-2 h-5 w-5 text-blue-400"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-medium text-white">Edge</span>
                    </div>
                    <p className="text-sm text-gray-400">
                      Settings &gt; Cookies and site permissions &gt; Cookies
                      and site data
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="mb-6 flex items-center">
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
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Contact Information
                </h3>
              </div>

              <div className="ml-14">
                <p className="mb-4 text-gray-400">
                  If you have any questions or concerns about our Cookies
                  Policy, please contact us at:
                </p>

                <div className="rounded-xl bg-gray-900/50 p-6 backdrop-blur-sm">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="mb-2 text-lg font-medium text-white">
                        Electrica
                      </h4>
                      <p className="text-gray-400">123 Power Avenue</p>
                      <p className="text-gray-400">Circuit City, EC 12345</p>
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
                        <span className="text-gray-300">(555) 123-4567</span>
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
                className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                Terms & Conditions
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Cookie consent banner */}
      {showCookieConsent && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md">
          <div className="container mx-auto p-4">
            <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
              <div className="flex items-start space-x-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 flex-shrink-0 text-blue-400"
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
                <p className="text-sm text-gray-300">
                  We use cookies to enhance your browsing experience, serve
                  personalized ads or content, and analyze our traffic. By
                  clicking "Accept All", you consent to our use of cookies.
                </p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowCookieConsent(false)}
                  className="rounded-lg border border-gray-700 bg-transparent px-4 py-2 text-sm text-gray-300 transition-all hover:border-blue-500 hover:text-blue-400"
                >
                  Cookie Settings
                </button>
                <button
                  onClick={() => setShowCookieConsent(false)}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  <Link
                    to="/"
                    className="text-sm text-gray-400 transition-colors hover:text-blue-400"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/service"
                    className="text-sm text-gray-400 transition-colors hover:text-blue-400"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="text-sm text-gray-400 transition-colors hover:text-blue-400"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/project-details"
                    className="text-sm text-gray-400 transition-colors hover:text-blue-400"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
                Legal
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/terms"
                    className="text-sm text-gray-400 transition-colors hover:text-blue-400"
                  >
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    to="/cookies"
                    className="text-sm text-gray-400 transition-colors hover:text-blue-400"
                  >
                    Cookies Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy-policy"
                    className="text-sm text-gray-400 transition-colors hover:text-blue-400"
                  >
                    Privacy Policy
                  </Link>
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
