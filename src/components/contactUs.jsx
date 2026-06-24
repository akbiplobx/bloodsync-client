import { Button } from "@heroui/react";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react"; 

export function ContactUs() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-5">
      <div className="w-full rounded-3xl p-8 md:p-16 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-10">
        
        {/* Content Area */}
        <div className="max-w-xl text-center md:text-left">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">
            Need Help or Have <span className="text-red-600">Queries?</span>
          </h2>
          <p className=" font-medium leading-relaxed mb-8">
            Whether you want to organize a blood donation camp, have questions about donor eligibility, or need urgent assistance, we are here to support you.
          </p>
          
          <div className="flex flex-col gap-4 text-slate-400">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <Mail className="w-5 h-5 text-red-500" />
              <span className="text-slate-600">support@blooddonation.com</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <Phone className="w-5 h-5 text-red-500" />
              <span className="text-slate-600">+880 1234-567890</span>
            </div>
          </div>
        </div>

        {/* Button Area */}
        <div className="flex flex-col gap-4 w-full md:w-auto">
          <Link href="/contact" passHref>
            <Button 
              size="lg" 
              className="bg-red-600 text-white font-bold rounded-xl px-10 py-6 hover:bg-red-700 transition shadow-lg shadow-red-900/20"
            >
              Contact Us Now
            </Button>
          </Link>
          <p className="text-xs text-slate-500 text-center">We usually respond within 24 hours.</p>
        </div>

      </div>
    </section>
  );
}