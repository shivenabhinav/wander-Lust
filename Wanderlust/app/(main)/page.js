import HeroSection from "@/components/HeroSection";
import DestinationGrid from "@/components/DestinationGrid";
import WhyChooseUs from "@/components/WhyChooseUs";
import CTAHostSection from "@/components/CTAHostSection";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import SentimentChat from "@/components/SentimentChat";

export default function HomePage() {
  return (
    <main className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <HeroSection />
      <section className="max-w-7xl mx-auto px-4">
        <DestinationGrid />
        <WhyChooseUs />
        <CTAHostSection />
        <Testimonials />
      </section>
      <Footer />
      <SentimentChat />
    </main>
  );
}
