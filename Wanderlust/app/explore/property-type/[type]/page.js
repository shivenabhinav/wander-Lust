import PropertiesList from "@/app/explore/components/PropertiesList";

export default async function PropertyTypePage({ params }) {
  const resolved = await params;
  const type = resolved.type;

  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${baseURL}/api/explore/property-type/${type}`, {
    cache: "no-store",
  });

  const data = await res.json();

  return (
    <div className="space-y-6 mt-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        {type.charAt(0).toUpperCase() + type.slice(1)} Stays
      </h1>

      {/* 🔥 FIX HERE — pass only the array */}
      <PropertiesList data={data.properties || []} />
    </div>
  );
}
