// src/app/admin/layout.jsx
import Link from "next/link";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Sidebar Component */}
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="text-rose-600 text-2xl font-black tracking-wider">BloodSync</div>
          </div>

          {/* Main Navigation Menu */}
          <nav className="space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Main Menu</p>
              <ul className="space-y-1">
                <li>
                  <Link href="/admin/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                    <span>📊</span> Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/admin/profile" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                    <span>👤</span> My Profile
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Management</p>
              <ul className="space-y-1">
                <li>
                  <Link href="/admin/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm font-bold bg-rose-50 dark:bg-rose-950/30 text-rose-600 rounded-xl">
                    <span>👥</span> All Users
                  </Link>
                </li>
                <li>
                  <Link href="/admin/requests" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                    <span>🩸</span> Public Requests
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        {/* Admin Footer Info inside Sidebar */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-rose-600 flex items-center justify-center text-white font-bold">A</div>
            <div>
              <p className="text-xs font-bold">Admin User</p>
              <p className="text-[11px] text-slate-400">admin@bloodsync.com</p>
            </div>
          </div>
          <button className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition">
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}