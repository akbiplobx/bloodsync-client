export default function PrivacyPage() {
  return (
    <main className="min-h-screen  py-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto  p-8 rounded-xl shadow-sm border border-slate-100">
        <div className="border-b border-slate-100 pb-4 mb-6">
          <h1 className="text-3xl font-bold ">Privacy Policy</h1>
          <p className="text-xs  mt-1">Your privacy is important to us</p>
        </div>

        <div className="space-y-6 text-sm sm:text-base leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold  mb-2">Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as your name, email address, and any other contact information when you use our services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold  mb-2">How We Use Your Data</h2>
            <p>We use the collected data to improve your experience, maintain security, and provide customer support. We do not sell your personal data to third parties.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold  mb-2">Cookies Policy</h2>
            <p>
              Our website uses cookies to enhance your browsing experience. You can choose to disable cookies through your individual browser settings if you prefer.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}