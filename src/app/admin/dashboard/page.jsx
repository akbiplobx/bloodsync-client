// src/app/admin/dashboard/page.jsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// Mock data matching the look of the uploaded User Management table
const usersMockData = [
  { id: "01", name: "Shoyeb", email: "shoyeb@gmail.com", role: "VOLUNTEER", status: "BLOCKED" },
  { id: "02", name: "Mahedi Hasan", email: "mahedi@gmail.com", role: "ADMIN", status: "ACTIVE" },
  { id: "03", name: "Sajid", email: "sajid@gmail.com", role: "VOLUNTEER", status: "ACTIVE" },
  { id: "04", name: "abin", email: "abin@gmail.com", role: "VOLUNTEER", status: "ACTIVE" },
  { id: "05", name: "Bangladesh", email: "bd@gmail.com", role: "VOLUNTEER", status: "ACTIVE" },
  { id: "06", name: "Niyaz", email: "niyaz@gmail.com", role: "DONOR", status: "ACTIVE" },
  { id: "07", name: "Rafi", email: "rafi@gmail.com", role: "DONOR", status: "ACTIVE" },
  { id: "08", name: "Jamil", email: "jamil@gmail.com", role: "DONOR", status: "ACTIVE" },
];

export default async function AdminDashboard() {
  // Better-Auth server session tracking
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Guard Clause: Secure route access
  if (!session) {
    redirect("/login");
  }

  if (session.user?.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="w-full">
      {/* Top Header section */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100">User Management</h1>
        <p className="text-sm text-slate-500 mt-1">Oversee community roles, statuses, and permissions.</p>
      </div>

      {/* Main Table Container Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-800/40">
                <th className="py-4 px-6 w-16">#</th>
                <th className="py-4 px-6">User Profile</th>
                <th className="py-4 px-6">Email Address</th>
                <th className="py-4 px-6 text-center">Current Role</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-center w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {usersMockData.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                  {/* Order ID */}
                  <td className="py-4 px-6 text-slate-400 font-mono">{user.id}</td>
                  
                  {/* Avatar & Name */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold text-xs uppercase">
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{user.name}</span>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="py-4 px-6 text-slate-500 font-normal">{user.email}</td>

                  {/* Dynamic Badges for Role */}
                  <td className="py-4 px-6 text-center">
                    <span
                      className={`inline-block text-[10px] font-black px-2.5 py-1 rounded-md tracking-wider ${
                        user.role === "ADMIN"
                          ? "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400"
                          : user.role === "VOLUNTEER"
                          ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  {/* Dynamic Badges for Status */}
                  <td className="py-4 px-6 text-center">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-full ${
                        user.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
                          : "bg-rose-50 text-[#ff0000] dark:bg-rose-950/30 dark:text-rose-400"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${user.status === "ACTIVE" ? "bg-emerald-500" : "bg-rose-500"}`} />
                      {user.status}
                    </span>
                  </td>

                  {/* Action Menu Trigger (Three Dots) */}
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