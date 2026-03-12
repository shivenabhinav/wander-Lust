// app/properties/layout.js

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Property Details | Wanderlust",
};

export default function PropertiesLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Top Navbar */}
      <Navbar />

      {/* Middle content takes leftover space */}
      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {children}
        </div>
      </main>

      {/* Footer sticks to bottom */}
      <Footer />
    </div>
  );
}
