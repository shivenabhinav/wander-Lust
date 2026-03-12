import PropertiesList from "@/app/explore/components/PropertiesList";

export default async function FeaturedListPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/explore/featured`, {
    cache: "no-store",
  });

  const data = await res.json();
  const featured = data.featured || [];

  return (
    <div className="mt-10 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        All Featured Stays ✨
      </h1>

      <PropertiesList data={featured} />
    </div>
  );
}
