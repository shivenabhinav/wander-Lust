import PropertiesList from "@/app/explore/components/PropertiesList";


export default async function SearchPage(props) {
  // ✅ searchParams is a Promise, so await it
  const { searchParams } = props;
  const params = await searchParams;

  const query = params?.query || "";

  // Prevent loading all data on empty search
  if (!query.trim()) {
    return (
      <div className="min-h-screen pt-24">
        <h1 className="text-3xl font-bold dark:text-white">
          Search results for ""
        </h1>
        <p className="text-gray-400 mt-3 text-lg">
          Type something in the search bar to find properties.
        </p>
      </div>
    );
  }

  // Fetch filtered results
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/search?query=${encodeURIComponent(
      query
    )}`,
    { cache: "no-store" }
  );

  const data = await res.json();
  const properties = data.properties || [];

  return (
    <div className="min-h-screen pt-24">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">
        Search results for "{query}"
      </h1>

      {properties.length === 0 ? (
        <p className="text-gray-400 text-lg">
          No properties found. Try another search.
        </p>
      ) : (
        <PropertiesList data={properties} />
      )}
    </div>
  );
}
