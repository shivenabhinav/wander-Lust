"use client";

import React, { useEffect, useState } from "react";
import { FaSearch, FaBars } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const router = useRouter();

  // 🔐 Client-only logic (fix hydration)
  useEffect(() => {
    setMounted(true);
    const role = localStorage.getItem("userRole");
    setUserRole(role);
  }, []);

  if (!mounted) return null;

  // ✅ Final logout action
  const confirmLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userAvatar");

    setUserRole(null);
    setShowLogoutPopup(false);
    router.push("/");
  };

  const userName = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("userEmail");

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md dark:bg-gray-900">
        <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="https://flowbite.com/docs/images/logo.svg"
              alt="Logo"
              width={32}
              height={32}
            />
            <span className="text-2xl font-semibold dark:text-white">
              Wanderlust
            </span>
          </Link>

          {/* Search */}

          {/* Right Side */}
          <div className="flex items-center space-x-4">

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-gray-500"
            >
              <FaBars />
            </button>

            {!userRole ? (
              <>
                <Link
                  href="/auth/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Register
                </Link>
                <Link
                  href="/auth/login"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Login
                </Link>
              </>
            ) : (
              <>
                {userRole === "guest" && (
                  <button
                    onClick={() => router.push("/guest/dashboard")}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Dashboard
                  </button>
                )}

                {userRole === "host" && (
                  <button
                    onClick={() => router.push("/host")}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Host Dashboard
                  </button>
                )}

                <button
                  onClick={() => setShowLogoutPopup(true)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* 🔴 LOGOUT POPUP */}
      {showLogoutPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-[90%] max-w-md shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Confirm Logout
            </h2>

            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Are you sure you want to log out?
            </p>

            {userName && (
              <p className="text-sm text-gray-500 mb-4">
                Logged in as <b>{userName}</b>
              </p>
            )}

            <p className="text-sm text-gray-500 mb-6">
              Your bookings and wishlist are safely saved.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowLogoutPopup(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

