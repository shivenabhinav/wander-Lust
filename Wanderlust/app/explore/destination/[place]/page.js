import PropertiesList from "@/app/explore/components/PropertiesList";

export default async function DestinationPage({ params }) {
  const { place } = await params;

  // Fetch properties for this destination
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/explore/destination/${place}`,
    {
      cache: "no-store",
    }
  );

  const data = await res.json();
  const properties = data.properties || [];

  const title = place.charAt(0).toUpperCase() + place.slice(1);

  return (
    <div className="space-y-6 mt-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        Stays in {title}
      </h1>

      {/* HERE → Now all properties open the property details page */}
      <PropertiesList data={properties} />
    </div>
  );
}
