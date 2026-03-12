"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ " + data.message);
        
        if (data.user?._id) {
          localStorage.setItem("userId", data.user._id);
          localStorage.setItem("userRole", data.user.role || "guest");
          localStorage.setItem("userName", data.user.name || "Host");
          localStorage.setItem("userAvatar",data.user.avatar || "/default-avatar.png");
        }

        console.log("Saved userId =", localStorage.getItem("userId"));

        alert(data.user._id + " " + data.user.role);

        // Optional: Clear form after success
        setFormData({
          email: "",
          password: "",
        });

        if (data.user?.role === "host") {
          router.push("/host"); // host dashboard
        }
        // else if (data.user?.role === "guest") {
        //   router.push("/guest/dashboard");}
         else {
          router.push("/"); // guest home page
        }
      } else {
        alert("⚠️ " + data.message);
      }
    } catch (error) {
      console.error("❌ Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="h-[90vh] flex items-center justify-center rounded-2xl bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md dark:bg-gray-800 p-8">
        {/* Header */}
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Welcome Back 👋
        </h2>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
              focus:ring-blue-500 focus:border-blue-500 
              dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
              focus:ring-blue-500 focus:border-blue-500 
              dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="••••••••"
            />
          </div>

          {/* Remember me + Forgot password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-gray-600 dark:text-gray-300">
              <input
                type="checkbox"
                className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Remember me
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-medium rounded-lg 
            hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 
            dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
          >
            Login
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300 dark:border-gray-600" />
          <span className="mx-2 text-gray-500 dark:text-gray-400 text-sm">
            or
          </span>
          <hr className="flex-grow border-gray-300 dark:border-gray-600" />
        </div>

        {/* Signup Link */}
        <p className="text-center text-gray-600 dark:text-gray-300 text-sm">
          Don’t have an account?{" "}
          <Link
            href="/auth/register"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
