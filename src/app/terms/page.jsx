export default function TermsPage() {
  const terms = [
    { title: "1. Acceptance of Terms", desc: "By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement." },
    { title: "2. User Responsibility", desc: "You agree to use this platform only for lawful purposes and in a way that does not infringe the rights of anyone else." },
    { title: "3. Account Security", desc: "If you create an account, you are solely responsible for maintaining the confidentiality of your password and account details." },
    { title: "4. Modifications", desc: "We reserve the right to change or modify these terms at any time without prior notice. Please review this page regularly." }
  ];

  return (
    <main className="min-h-screen  py-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto  p-8 rounded-xl shadow-sm border border-slate-100">
        <div className="border-b border-slate-100 pb-4 mb-6">
          <h1 className="text-3xl font-bold ">Terms & Conditions</h1>
          <p className="text-xs  mt-1">Last updated: May 2026</p>
        </div>

        <div className="space-y-6">
          {terms.map((item, index) => (
            <div key={index} className="space-y-1">
              <h2 className="text-lg font-semibold ">{item.title}</h2>
              <p className=" text-sm sm:text-base leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
