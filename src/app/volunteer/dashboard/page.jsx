// src/app/volunteer/dashboard/page.jsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// Mock data for blood donation requests managed by the volunteer
const donationRequestsMock = [
  { id: "REQ-101", patientName: "Rahim Ali", bloodType: "A+", location: "Chittagong Medical", status: "PENDING", date: "2026-06-20" },
  { id: "REQ-102", patientName: "Fatima Begum", bloodType: "O-", location: "Dhaka Medical College", status: "ACCEPTED", date: "2026-06-19" },
  { id: "REQ-103", patientName: "Sumon Das", bloodType: "B+", location: "General Hospital, CTG", status: "COMPLETED", date: "2026-06-15" },
  { id: "REQ-104", patientName: "Anika Tahsin", bloodType: "AB+", location: "Apollo Hospital", status: "PENDING", date: "2026-06-22" },
];

export default async function VolunteerDashboard() {
  // Better-Auth server session protection
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Guard Clause: Secure route access for volunteers only
  if (!session) {
    redirect("/login");
  }

  if (session.user?.role?.toLowerCase() !== "volunteer") {
    redirect("/dashboard");
  }

  return (
    <div className="w-full">
      {/* Top Header section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100">Volunteer Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Welcome back, {session.user.name}! Manage and create blood donation requests.</p>
        </div>
        <button className="px-5 py-2.5 text-sm font-bold bg-[#ff0000] hover:bg-[#cc0000] text-white rounded-xl shadow-md transition-all flex items-center gap-2">
          <span>➕</span> New Blood Request
        </button>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Requests Created</p>
          <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100 mt-2">12</h3>
          <p className="text-xs text-slate-500 mt-1">Requests posted by you</p>
        </div>
        <div className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Pending</p>
          <h3 className="text-3xl font-black text-amber-600 mt-2">2</h3>
          <p className="text-xs text-slate-500 mt-1">Awaiting donor response</p>
        </div>
        <div className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Successful Matches</p>
          <h3 className="text-3xl font-black text-emerald-600 mt-2">10</h3>
          <p className="text-xs text-slate-500 mt-1">Lives helped so far 🎉</p>
        </div>
      </div>

      {/* Main Table Container Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="font-bold text-lg text-slate-800 dark:text-slate-200">Recent Donation Requests</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-800/40">
                <th className="py-4 px-6 w-28">Request ID</th>
                <th className="py-4 px-6">Patient Name</th>
                <th className="py-4 px-6 text-center">Blood Type</th>
                <th className="py-4 px-6">Hospital Location</th>
                <th className="py-4 px-6">Needed Date</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-center w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {donationRequestsMock.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-6 text-slate-400 font-mono text-xs">{req.id}</td>
                  <td className="py-4 px-6 font-bold text-slate-800 dark:text-slate-200">{req.patientName}</td>
                  <td className="py-4 px-6 text-center">
                    <span className="inline-block bg-rose-50 text-[#ff0000] dark:bg-rose-950/40 dark:text-rose-400 font-black text-xs px-2.5 py-1 rounded-md">
                      {req.bloodType}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-500 font-normal">{req.location}</td>
                  <td className="py-4 px-6 text-slate-500 font-normal">{req.date}</td>
                  <td className="py-4 px-6 text-center">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-full ${
                        req.status === "COMPLETED"
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
                          : req.status === "ACCEPTED"
                          ? "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400"
                          : "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${req.status === "COMPLETED" ? "bg-emerald-500" : req.status === "ACCEPTED" ? "bg-blue-500" : "bg-amber-500"}`} />
                      {req.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 font-bold text-lg rounded">
                      •••
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}