import PropertiesList from "@/app/explore/components/PropertiesList";

export default async function CategoryPage({ params }) {
  const resolved = await params;
  const name = resolved.name;

  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${baseURL}/api/explore/category/${name}`, {
    cache: "no-store",
  });

  const data = await res.json();

  return (
    <div className="space-y-6 mt-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        {name.charAt(0).toUpperCase() + name.slice(1)} Stays
      </h1>

      <PropertiesList data={data.properties || []} />
    </div>
  );
}
