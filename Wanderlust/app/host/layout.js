"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/host" },
  { name: "My Properties", path: "/host/properties" },
  { name: "Add Property", path: "/host/add-property" },
  { name: "Bookings", path: "/host/bookings" },
];

export default function HostLayout({ children }) {
  const [open, setOpen] = useState(false);

  // ✅ Safe: runs only on client & does not cause warnings
  const [hostname, setHostname] = useState("");

  // console.log(hostname);
  // console.log(localStorage.getItem("userId"));
  useEffect(() => {
    async function fetchHost() {
      const id = localStorage.getItem("userId");
      if (!id) return;

      try {
        const res = await fetch(`/api/host/${id}`);
        const data = await res.json();

        if (res.ok && data?.name) {
          setHostname(data.name);
        }
      } catch (err) {
        console.error("Error loading hostname", err);
      }
    }

    fetchHost();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        className={`${open ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 fixed md:static w-64 h-full bg-white dark:bg-gray-800 border-r border-gray-200 
           dark:border-gray-700 p-5 transition-transform duration-300`}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-blue-600">Host Panel</h1>
          <button className="md:hidden" onClick={() => setOpen(false)}>
            <X className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <nav className="space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="block text-gray-700 dark:text-gray-300 hover:bg-blue-100 
                       dark:hover:bg-gray-700 p-2 rounded-lg"
            >
              {item.name}
            </Link>
          ))}

          <hr className="my-4 border-gray-200 dark:border-gray-700" />

          <Link
            href="/"
            className="block text-blue-600 hover:bg-blue-50 dark:text-blue-400 
                     dark:hover:bg-gray-900 p-2 rounded-lg font-medium"
          >
            ← Back to Home
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 
                          border-b border-gray-200 dark:border-gray-700">
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            <Menu className="text-gray-600 dark:text-gray-300" />
          </button>

          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Host Dashboard
          </h2>

          <div className="flex items-center gap-3">
            <Image
              src="/default_profile_picture.webp"
              width={35}
              height={35}
              alt="avatar"
              className="rounded-full object-cover"
            />
            <span className="text-gray-700 dark:text-gray-200 font-medium">
              {hostname ? `${hostname}` : "Host Name"}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
