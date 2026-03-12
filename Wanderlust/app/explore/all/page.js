import PropertiesList from "@/app/explore/components/PropertiesList";

export default async function AllStaysPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/explore/all`, {
    cache: "no-store",
  });

  const data = await res.json();
  const properties = data.properties || [];

  return (
    <div className="mt-10 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        All Stays
      </h1>

      <PropertiesList data={properties} />
    </div>
  );
}
