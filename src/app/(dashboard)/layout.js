"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FaPlusCircle, 
  FaListAlt, 
  FaHome, 
  FaUser, 
  FaFileMedical,
  FaSignOutAlt,
  FaUsers,       // Admin: All Users আইকন
  FaClipboardList // Admin: Public Requests আইকন
} from "react-icons/fa";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  // 🕵️‍♂️ ইউআরএল দেখে অটোমেটিক রোল ডিটেক্ট করা হচ্ছে
  const isAdmin = pathname.includes("/admin");
  const isVolunteer = pathname.includes("/volunteer");

  // একটি হেল্পার ফাংশন যা একটিভ লিংকগুলোকে সুন্দরভাবে হাইলাইট করবে
  const getLinkClass = (path) => {
    const baseClass = "flex items-center gap-3 p-3 rounded-xl transition-all duration-200";
    return pathname === path
      ? `${baseClass} bg-slate-800 text-white font-bold`
      : `${baseClass} hover:bg-slate-800 hover:text-white`;
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white text-slate-800 transition-colors duration-300">
      
      {/* 🟢 মেইন ডার্ক সাইডবার (রোল অনুযায়ী অটোমেটিক চেঞ্জ হবে) */}
      <div className="w-full md:w-64 bg-slate-900 text-slate-100 p-5 space-y-6 flex flex-col justify-between">
        <div>
          
          {/* 🔄 ডাইনামিক হেডার (Admin, Volunteer, নাকি Donor সে অনুযায়ী চেঞ্জ হবে) */}
          <div className="text-2xl font-black text-center border-b border-slate-800 pb-4 flex flex-col items-center gap-1">
            {isAdmin ? (
              <>
                <div className="flex items-center gap-1.5 tracking-tighter">
                  Admin<span className="text-[#ff0000]">Panel</span>
                </div>
                <span className="block text-xs font-semibold text-[#ff0000] bg-rose-950/40 px-2.5 py-0.5 rounded-full mt-1">
                  Admin Dashboard
                </span>
              </>
            ) : isVolunteer ? (
              <>
                <div className="flex items-center gap-1.5 tracking-tighter">
                  Volunteer<span className="text-[#ff0000]">Panel</span>
                </div>
                <span className="block text-xs font-semibold text-[#ff0000] bg-rose-950/40 px-2.5 py-0.5 rounded-full mt-1">
                  Volunteer Dashboard
                </span>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1.5 tracking-tighter">
                  Donor<span className="text-[#ff0000]">Profile</span>
                </div>
                <span className="block text-xs font-semibold text-[#ff0000] bg-rose-950/40 px-2.5 py-0.5 rounded-full mt-1">
                  User Dashboard
                </span>
              </>
            )}
          </div>
          
          {/* 🔄 ডাইনামিক নেভিগেশন মেনু */}
          <nav className="flex flex-col space-y-1 text-sm font-medium text-slate-300 mt-4">
            
            {/* ========================================================
                 👑 ১. এডমিন মেনু (ইউআরএল-এ admin থাকলে এই লিংকগুলো দেখাবে)
                 ======================================================== */}
            {isAdmin && (
              <>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 px-3 mb-1">Main Menu</p>
                <Link href="/admin/dashboard" className={getLinkClass("/admin/dashboard")}>
                  <FaListAlt className="text-[#ff0000] text-lg" /> Dashboard
                </Link>
                <Link href="/admin/profile" className={getLinkClass("/admin/profile")}>
                  <FaUser className="text-[#ff0000] text-lg" /> My Profile
                </Link>

                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 px-3 mt-4 mb-1">Management</p>
                <Link href="/admin/dashboard" className={getLinkClass("/admin/dashboard")}> {/* যদি আলাদা অল ইউজার পেজ থাকে তবে পাথ চেঞ্জ করতে পারেন */}
                  <FaUsers className="text-[#ff0000] text-lg" /> All Users
                </Link>
                <Link href="/admin/requests" className={getLinkClass("/admin/requests")}>
                  <FaClipboardList className="text-[#ff0000] text-lg" /> Public Requests
                </Link>
              </>
            )}

            {/* ========================================================
                 🙋‍♂️ ২. ভলেন্টিয়ার মেনু (ইউআরএল-এ volunteer থাকলে এই লিংকগুলো দেখাবে)
                 ======================================================== */}
            {isVolunteer && !isAdmin && (
              <>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 px-3 mb-1">Main Menu</p>
                <Link href="/volunteer/dashboard" className={getLinkClass("/volunteer/dashboard")}>
                  <FaListAlt className="text-[#ff0000] text-lg" /> Dashboard
                </Link>
                <Link href="/volunteer/profile" className={getLinkClass("/volunteer/profile")}>
                  <FaUser className="text-[#ff0000] text-lg" /> My Profile
                </Link>

                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 px-3 mt-4 mb-1">Donations</p>
                <Link href="/volunteer/create-request" className={getLinkClass("/volunteer/create-request")}>
                  <FaPlusCircle className="text-[#ff0000] text-lg" /> Create Request 
                </Link>
                <Link href="/volunteer/my-requests" className={getLinkClass("/volunteer/my-requests")}>
                  <FaFileMedical className="text-[#ff0000] text-lg" /> My Requests
                </Link>
              </>
            )}

            {/* ========================================================
                 🩸 ৩. ডোনর মেনু (ইউআরএল-এ admin বা volunteer না থাকলে এটি দেখাবে)
                 ======================================================== */}
            {!isAdmin && !isVolunteer && (
              <>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 px-3 mb-1">Main Menu</p>
                <Link href="/dashboard/profile" className={getLinkClass("/dashboard/profile")}>
                  <FaUser className="text-[#ff0000] text-lg" /> My Profile
                </Link>
                <Link href="/dashboard/create-request" className={getLinkClass("/dashboard/create-request")}>
                  <FaPlusCircle className="text-[#ff0000] text-lg" /> Create Request 
                </Link>
                <Link href="/dashboard/my-donations" className={getLinkClass("/dashboard/my-donations")}>
                  <FaListAlt className="text-[#ff0000] text-lg" /> My Donations
                </Link>
              </>
            )}
            
            <div className="border-t border-slate-800 my-4 pt-4"></div>
            
            {/* কমন ব্যাক টু হোম লিংক */}
            <Link 
              href="/" 
              className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-slate-800 hover:text-white text-slate-400"
            >
              <FaHome className="text-lg" /> Back to Home
            </Link>
          </nav>
        </div>

        {/* এডমিন ও ভলেন্টিয়ারদের জন্য নিচে এক্সট্রা লগআউট বাটন */}
        {(isAdmin || isVolunteer) && (
          <div className="pt-4 border-t border-slate-800">
            <button className="w-full flex items-center gap-3 p-3 rounded-xl text-slate-400 hover:bg-red-950/40 hover:text-red-500 transition-all duration-200 text-sm font-medium">
              <FaSignOutAlt className="text-lg" /> Logout
            </button>
          </div>
        )}
      </div>

      {/* 🟢 ডান পাশের মূল কনটেন্ট এরিয়া */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-white text-slate-900">
        {children}
      </div>
      
    </div>
  );
}