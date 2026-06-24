"use client";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-24 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
          
          {/* 1. Brand Section */}
          <div className="space-y-5">
            <Link href="/" className="flex gap-2 items-center">
              <img 
                src="/logo.png" 
                alt="BloodSync Logo" 
                className="w-10 h-10 object-contain" 
              />
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
                Blood<span className="text-[#ff0000]">Sync</span>
              </h2>
            </Link>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              An advanced blood donation platform connecting life-saving donors with families in critical need seamlessly and efficiently.
            </p>

            {/* Social Links with required new X logo */}
            <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-900 hover:bg-[#ff0000] hover:text-white transition-all duration-300 shadow-sm">
                <i className="fa-brands fa-facebook-f text-sm"></i>
              </a>
              {/* Updated to use the latest X rebranding icon as per requirement docs */}
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-900 hover:bg-[#ff0000] hover:text-white transition-all duration-300 shadow-sm">
                <i className="fa-brands fa-x-twitter text-sm"></i>
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-900 hover:bg-[#ff0000] hover:text-white transition-all duration-300 shadow-sm">
                <i className="fa-brands fa-instagram text-sm"></i>
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-900 hover:bg-[#ff0000] hover:text-white transition-all duration-300 shadow-sm">
                <i className="fa-brands fa-linkedin-in text-sm"></i>
              </a>
            </div>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-6 uppercase tracking-widest">
              Platform
            </h3>
            <ul className="space-y-4 text-sm font-medium text-slate-500 dark:text-slate-400">
              <li><Link href="/donation-requests" className="hover:text-[#ff0000] transition">Donation Requests</Link></li>
              <li><Link href="/search" className="hover:text-[#ff0000] transition">Search Donors</Link></li>
              <li><Link href="/funding" className="hover:text-[#ff0000] transition">Funding & Grants</Link></li>
            </ul>
          </div>

          {/* 3. Contact Information */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-6 uppercase tracking-widest">
              Contact Us
            </h3>
            <ul className="space-y-4 text-sm font-medium text-slate-500 dark:text-slate-400">
              <li className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mt-0.5 text-[#ff0000]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25H4.5A2.25 2.25 0 0 1 2.25 17.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5H4.5A2.25 2.25 0 0 0 2.25 6.75m19.5 0-8.25 6.75-8.25-6.75" />
                </svg>
                <span>support@bloodsync.com</span>
              </li>
              <li className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mt-0.5 text-[#ff0000]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                <span>Dhaka, Bangladesh</span>
              </li>
            </ul>
          </div>

          {/* 4. Legal Section */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-6 uppercase tracking-widest">
              Organization
            </h3>
            <ul className="space-y-4 text-sm font-medium text-slate-500 dark:text-slate-400">
              <li><Link href="/about" className="hover:text-[#ff0000] transition">About Us</Link></li>
              <li><Link href="/terms" className="hover:text-[#ff0000] transition">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-[#ff0000] transition">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
            © {currentYear} <span className="font-bold text-slate-600 dark:text-slate-400">BloodSync</span>. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link href="/terms" className="text-xs text-slate-400 dark:text-slate-500 hover:text-[#ff0000] transition">Terms</Link>
            <Link href="/privacy" className="text-xs text-slate-400 dark:text-slate-500 hover:text-[#ff0000] transition">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;