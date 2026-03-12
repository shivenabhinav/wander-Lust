import Footer from "@/components/Footer";

export default function SearchLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">

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
