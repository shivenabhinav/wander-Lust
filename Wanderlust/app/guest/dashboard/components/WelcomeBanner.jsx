// app/guest/dashboard/components/WelcomeBanner.jsx
"use client";
import { motion } from "framer-motion";

export default function WelcomeBanner({ user }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white p-6 rounded-2xl shadow-md"
    >
      <h2 className="text-2xl font-bold">Welcome back, {user?.name || "Guest"} 👋</h2>
      <p className="mt-2 text-sm opacity-90">
        Ready to explore your next destination?
      </p>
    </motion.div>
  );
}
