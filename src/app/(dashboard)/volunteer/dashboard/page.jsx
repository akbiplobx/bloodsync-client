// src/app/volunteer/dashboard/page.jsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { FaHeartbeat } from "react-icons/fa";

export default async function VolunteerDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // 🔒 অথেন্টিকেশন এবং রোল চেক
  if (!session) {
    redirect("/login");
  }

  if (session.user?.role !== "volunteer") {
    redirect("/dashboard");
  }

  const volunteerName = session.user?.name || "Volunteer";

  return (
    <div className="w-full p-4 space-y-6">
      
      {/* 🔴 Welcome Banner (ভলেন্টিয়ারের নামসহ) */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-6 md:p-8 text-white shadow-md">
        <div className="flex items-center gap-3 mb-2">
          <FaHeartbeat className="text-3xl animate-pulse" />
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">
            Welcome to BloodSync, {volunteerName}! 🎉
          </h1>
        </div>
        <p className="text-rose-100 max-w-xl text-sm md:text-base font-medium">
          Thank you for your incredible support. Use the sidebar options to create urgent blood donation requests and track your submitted applications.
        </p>
      </div>

      {/* 📊 ভলেন্টিয়ারদের জন্য কুইক অ্যাকশন এবং ওভারভিউ গ্রিড */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        
        {/* কুইক অ্যাকশন ১ */}
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
          <h3 className="font-bold text-slate-700 text-lg mb-1">Create Blood Request</h3>
          <p className="text-sm text-slate-500 mb-3">Is there an immediate need for blood? Post an urgent request to notify our donor network instantly.</p>
        </div>
        
        {/* কুইক অ্যাকশন ২ */}
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
          <h3 className="font-bold text-slate-700 text-lg mb-1">Track Applications</h3>
          <p className="text-sm text-slate-500">Go to "My Requests" to easily monitor the screening, progress, and approval status of all your submitted blood requests.</p>
        </div>

      </div>
    </div>
  );
}