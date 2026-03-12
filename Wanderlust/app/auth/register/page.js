"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    avatar: "",
    role: "guest",

    // Host fields
    phone: "",
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    ifsc: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Registration failed");
        return;
      }

      alert("✅ Registered successfully! Please login.");
      router.push("/auth/login");
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="h-[90%] my-4 rounded-2xl flex items-center justify-center bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md dark:bg-gray-800 p-8">

        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Create an Account ✨
        </h2>

        {/* TOP: ROLE SELECTION */}
        <div className="mb-6">
          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            I am a
          </span>

          <div className="flex items-center gap-6">
            <label className="flex items-center text-gray-700 dark:text-gray-300">
              <input
                type="radio"
                name="role"
                value="guest"
                checked={formData.role === "guest"}
                onChange={handleChange}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              Guest
            </label>

            <label className="flex items-center text-gray-700 dark:text-gray-300">
              <input
                type="radio"
                name="role"
                value="host"
                checked={formData.role === "host"}
                onChange={handleChange}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              Host
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* NAME */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
              focus:ring-blue-500 focus:border-blue-500 
              dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
              focus:ring-blue-500 focus:border-blue-500 
              dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
              focus:ring-blue-500 focus:border-blue-500 
              dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* AVATAR */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Avatar URL
            </label>
            <input
              type="text"
              name="avatar"
              required
              value={formData.avatar}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
              focus:ring-blue-500 focus:border-blue-500 
              dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          {/* --------------------------------- */}
          {/* HOST ONLY SECTION */}
          {/* --------------------------------- */}
          {formData.role === "host" && (
            <div className="space-y-4 border-t pt-4">

              {/* PHONE */}
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                  dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* ACCOUNT HOLDER NAME */}
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  name="accountHolderName"
                  required
                  value={formData.accountHolderName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                  dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Must match bank records"
                />
              </div>

              {/* BANK NAME (OPTIONAL) */}
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Bank Name (optional)
                </label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                  dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* ACCOUNT NUMBER */}
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Bank Account Number
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  required
                  value={formData.accountNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                  dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* IFSC */}
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  IFSC Code
                </label>
                <input
                  type="text"
                  name="ifsc"
                  required
                  value={formData.ifsc}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                  dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg 
            hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 
            dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
          >
            Register
          </button>
        </form>

        {/* DIVIDER */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300 dark:border-gray-600" />
          <span className="mx-2 text-gray-500 dark:text-gray-400 text-sm">or</span>
          <hr className="flex-grow border-gray-300 dark:border-gray-600" />
        </div>

        {/* LOGIN LINK */}
        <p className="text-center text-gray-600 dark:text-gray-300 text-sm">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-blue-600 hover:underline dark:text-blue-400">
            Login here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default RegisterPage;
