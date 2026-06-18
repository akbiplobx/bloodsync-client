"use client";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeSwitch } from "./ThemeSwitch";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { data: session } = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut();
  };

  // 🛠️ Dynamic Navigation Link based on User Roles (Admin, Volunteer, Donor)
  const getDashboardLink = () => {
    if (!session) return "/login";

    const role = session.user?.role?.toLowerCase();

    if (role === "admin") {
      return "/admin/dashboard";
    }
    if (role === "volunteer") {
      return "/volunteer/dashboard";
    }

    // Default route for donors
    return "/dashboard";
  };

  const dashboardLink = getDashboardLink();

  return (
    <div className="border-b border-slate-100 dark:border-slate-800 px-5 sticky top-0 backdrop-blur-md bg-white/80 dark:bg-slate-950/80 z-50 transition-colors duration-300">
      <nav className="flex justify-between items-center py-3 max-w-7xl mx-auto w-full">

        {/* Logo + Website Name */}
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="BloodSync Logo"
            className="w-10 h-10 object-contain"
          />
          <h3 className="font-black text-2xl tracking-tighter text-slate-800 dark:text-slate-100">
            Blood<span className="text-rose-600">Sync</span>
          </h3>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <li>
            <Link href="/" className="hover:text-rose-600 transition">Home</Link>
          </li>
          <li>
            <Link href="/donation-requests" className="hover:text-rose-600 transition">Donation Requests</Link>
          </li>

          {/* Funding Link - Only show after logged in */}
          {session && (
            <li>
              <Link href="/funding" className="hover:text-rose-600 transition">Funding</Link>
            </li>
          )}
        </ul>

        {/* Theme Switch & Auth Section */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeSwitch />

          {session ? (
            <div className="relative">
              {/* Profile Dropdown Trigger */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <img
                  src={session?.user?.image || "/default-avatar.png"}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full border-2 border-rose-500 p-0.5 object-cover cursor-pointer"
                />
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 hidden lg:block">
                  {session.user.name}
                </span>
              </button>

              {/* Profile Dropdown Content */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-3 w-48 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-xl py-2 z-50"
                  >
                    <div className="px-4 py-2 border-b border-slate-50 dark:border-slate-700">
                      <p className="text-xs text-slate-400 font-medium">Logged in as</p>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{session.user.email}</p>
                      <span className="inline-block text-[9px] font-black uppercase tracking-wider bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 px-1.5 py-0.5 mt-1 rounded">
                        {session.user?.role || "donor"}
                      </span>
                    </div>
                    {/* ✨ Added Link for Profile Page */}
                    <Link
                      href="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition font-medium border-t border-slate-100 dark:border-slate-700/50"
                    >
                      Profile Edit
                    </Link>
                    {/* Dynamic Link for Dashboard */}
                    <Link
                      href={dashboardLink}
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition font-medium"
                    >
                      Dashboard
                    </Link>



                    <button
                      onClick={() => { handleSignOut(); setIsDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition font-medium border-t border-slate-50 dark:border-slate-700/50"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-rose-600 transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-5 py-2 text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-md shadow-rose-100 dark:shadow-none transition-all duration-300"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeSwitch />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-slate-700 dark:text-slate-300 focus:outline-none p-2"
          >
            {isOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Content with Animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-white dark:bg-slate-900 border-t dark:border-slate-800"
          >
            <div className="flex flex-col gap-3 p-5">
              <Link href="/" onClick={() => setIsOpen(false)} className="text-slate-700 dark:text-slate-300 font-semibold py-2 hover:text-rose-600">Home</Link>
              <Link href="/donation-requests" onClick={() => setIsOpen(false)} className="text-slate-700 dark:text-slate-300 font-semibold py-2 hover:text-rose-600">Donation Requests</Link>

              {session && (
                <>
                  <Link href="/funding" onClick={() => setIsOpen(false)} className="text-slate-700 dark:text-slate-300 font-semibold py-2 hover:text-rose-600">Funding</Link>
                  <Link href={dashboardLink} onClick={() => setIsOpen(false)} className="text-slate-700 dark:text-slate-300 font-semibold py-2 hover:text-rose-600">Dashboard</Link>
                  {/* ✨ Added Link for Mobile Profile */}
                  <Link href="/profile" onClick={() => setIsOpen(false)} className="text-slate-700 dark:text-slate-300 font-semibold py-2 hover:text-rose-600">Profile</Link>
                </>
              )}

              <div className="h-[1px] bg-slate-100 dark:bg-slate-800 my-2"></div>

              {session ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
                    <img src={session.user.image || "/default-avatar.png"} className="w-12 h-12 rounded-full border-2 border-rose-500 object-cover" alt="User Avatar" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-slate-800 dark:text-slate-200">{session.user.name}</p>
                        <span className="text-[9px] font-black uppercase bg-rose-100 dark:bg-rose-950 text-rose-600 px-1 rounded">
                          {session.user?.role || "donor"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[180px]">{session.user.email}</p>
                    </div>
                  </div>
                  <button onClick={() => { handleSignOut(); setIsOpen(false); }} className="w-full py-3 text-rose-600 font-bold border border-rose-100 dark:border-rose-900/50 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition">
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 pt-2">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center py-3 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center py-3 bg-rose-600 text-white rounded-xl font-bold shadow-md shadow-rose-100"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;