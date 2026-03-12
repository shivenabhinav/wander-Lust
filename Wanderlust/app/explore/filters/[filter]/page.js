import PropertiesList from "@/app/explore/components/PropertiesList";

export default async function FiltersPage({ params }) {
  const resolved = await params;
  const filter = resolved.filter;

  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${baseURL}/api/explore/filters/${filter}`, {
    cache: "no-store",
  });

  const data = await res.json();

  return (
    <div className="space-y-6 mt-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        {filter.charAt(0).toUpperCase() + filter.slice(1)} Stays
      </h1>

      {/* ⚠️ FIX: Pass the array, not the whole object */}
      <PropertiesList data={data.properties || []} />
    </div>
  );
}
