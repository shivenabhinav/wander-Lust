export default function CTAHostSection() {
  return (
    <section className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-10 my-12">
      <h2 className="text-3xl font-bold mb-3">Become a Host</h2>
      <p className="text-lg mb-5">Share your space and start earning today</p>
      <a
        href="/auth/register"
        className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
      >
        Start Hosting
      </a>
    </section>
  );
}
