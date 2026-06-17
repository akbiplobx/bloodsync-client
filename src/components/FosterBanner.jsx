import { Button } from "@heroui/react";
import Link from "next/link";

export function FosterBanner() {
  return (
    <section className="py-16 max-w-7xl mx-auto px-5">
      <div className="w-full bg-gradient-to-r from-[#FFA600] to-orange-500 rounded-3xl p-8 md:p-12 shadow-xl text-white flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* কন্টেন্ট এরিয়া */}
        <div className="max-w-xl text-center md:text-left">
          <h2 className="text-2xl md:text-4xl font-black tracking-tight mb-3">
            Blood-----?
          </h2>
          <p className="text-orange-50 font-medium leading-relaxed">
            You can still make a huge difference! Become a foster parent or volunteer today to give temporary shelter to homeless pets.
          </p>
        </div>

        {/* বাটন এরিয়া (সহজ ও এরর-মুক্ত উপায়ে Link ব্যবহার করা হয়েছে) */}
        <Link href="/signup" passHref>
          <Button 
            size="lg" 
            className="bg-white text-orange-600 font-bold rounded-full px-8 hover:bg-orange-50 transition shadow-md"
          >
            Join Our Community
          </Button>
        </Link>

      </div>
    </section>
  );
}