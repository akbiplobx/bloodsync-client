import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { FaHeartbeat } from "react-icons/fa";

export default async function AdminDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  if (session.user?.role !== "admin") {
    redirect("/dashboard");
  }

  const adminName = session.user?.name || "Admin";

  return (
    <div className="w-full p-4 space-y-6">
      {/* 🔴 Welcome Banner */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-6 md:p-8 text-white shadow-md">
        <div className="flex items-center gap-3 mb-2">
          <FaHeartbeat className="text-3xl animate-pulse" />
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">
            Welcome to BloodSync, {adminName}! 🎉
          </h1>
        </div>
        <p className="text-rose-100 max-w-xl text-sm md:text-base font-medium">
          Your decision can save a life. Use the sidebar options to oversee community roles, statuses, and manage public requests across the platform.
        </p>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
          <h3 className="font-bold text-slate-700 text-lg mb-1">Quick Insights</h3>
          <p className="text-sm text-slate-500">Select "User Management" from the sidebar to update user profiles, view active accounts, or change security roles.</p>
        </div>
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
          <h3 className="font-bold text-slate-700 text-lg mb-1">System Status</h3>
          <p className="text-sm text-slate-500">All services are functional. Keep track of recent blood requests through the "Public Requests" portal.</p>
        </div>
      </div>
    </div>
  );
}