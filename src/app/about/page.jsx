export default function AboutPage() {
  return (
    <main className="min-h-screen  py-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold  tracking-tight">
            About <span className="text-red-600">Us</span>
          </h1>
          <p className="mt-3 text-base ">
            We are dedicated to providing the best service possible to our users.
          </p>
        </div>

        {/* Content Box */}
        <div className=" p-8 rounded-xl shadow-sm border border-slate-100 space-y-6">
          <div>
            <h2 className="text-xl font-semibold  mb-2">Our Mission</h2>
            <p className=" leading-relaxed text-sm sm:text-base">
              Our mission is to deliver high-quality, innovative, and reliable solutions that simplify your everyday life and build long-term trust.
            </p>
          </div>

          <hr className="border-slate-100" />

          <div>
            <h2 className="text-xl font-semibold  mb-2">Our Vision</h2>
            <p className=" leading-relaxed text-sm sm:text-base">
              To become a globally recognized platform known for excellent user experience, transparency, and top-tier customer satisfaction.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}