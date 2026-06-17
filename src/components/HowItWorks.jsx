export function HowItWorks() {
  const steps = [
    { 
      step: "01", 
      title: "Search", 
      desc: "Browse through our verified listings to find your ideal pet comrade." 
    },
    { 
      step: "02", 
      title: "Connect", 
      desc: "Submit an adoption request and communicate directly with the owner." 
    },
    { 
      step: "03", 
      title: "Adopt", 
      desc: "Complete the easy paperwork and bring your new family member home." 
    }
  ];

  return (
    <section className="py-16  transition-colors">
      <div className="max-w-7xl mx-auto px-5">
        
       
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black tracking-tight mb-2 ">
            How Bloodsync Works
          </h2>
          <p className="">
            Your journey to adopting a pet made simple in just three steps.
          </p>
        </div>

       
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center p-4">
              <span className="text-5xl font-black text-red-600  mb-2">
                {item.step}
              </span>
              <h3 className="text-xl font-bold mb-2 ">
                {item.title}
              </h3>
              <p className="text-sm max-w-xs leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}