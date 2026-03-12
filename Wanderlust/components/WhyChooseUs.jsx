import { ShieldCheck, Home, Headphones, Globe } from "lucide-react";

export default function WhyChooseUs() {
  const features = [
    { icon: ShieldCheck, title: "Secure Payments", text: "Book confidently with 100% safe transactions." },
    { icon: Home, title: "Verified Properties", text: "All properties are verified and host-approved." },
    { icon: Headphones, title: "24/7 Support", text: "We're always here to help you, day or night." },
    { icon: Globe, title: "Global Destinations", text: "Stay anywhere, from beaches to mountains." },
  ];

  return (
    <section className="my-16">
      <h2 className="text-2xl font-bold mb-8 text-gray-800 dark:text-white text-center">
        Why Choose Wanderlust?
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f) => (
          <div
            key={f.title}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center hover:shadow-lg transition"
          >
            <f.icon className="mx-auto text-blue-600 mb-3" size={36} />
            <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-2">
              {f.title}
            </h3>
            <p className="text-gray-500 text-sm">{f.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
