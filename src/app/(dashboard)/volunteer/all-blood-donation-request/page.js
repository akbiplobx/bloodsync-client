import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import Link from "next/link";

const ITEMS_PER_PAGE = 10;

export default async function VolunteerAllBloodRequestsPage({ searchParams }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");
  if (session.user?.role !== "volunteer") redirect("/dashboard");

  const resolvedParams = await searchParams;
  const search = resolvedParams?.search || "";
  const bloodGroup = resolvedParams?.bloodGroup || "All Groups";
  const page = parseInt(resolvedParams?.page) || 1;
  const skip = (page - 1) * ITEMS_PER_PAGE;

  const client = await clientPromise;
  const db = client.db("bloodsync");

  let query = {};

  if (search) {
    query.$or = [
      { hospitalName: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
    ];
  }

  if (bloodGroup && bloodGroup !== "All Groups") {
    query.bloodGroup = bloodGroup;
  }

  const total = await db.collection("blood-data").countDocuments(query);
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const bloodRequests = await db
    .collection("blood-data")
    .find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(ITEMS_PER_PAGE)
    .toArray();

  async function updateStatus(formData) {
    "use server";
    const requestId = formData.get("requestId");
    const newStatus = formData.get("status");
    const client = await clientPromise;
    const db = client.db("bloodsync");
    await db.collection("blood-data").updateOne(
      { _id: new ObjectId(requestId) },
      { $set: { status: newStatus, updatedAt: new Date() } }
    );
    revalidatePath("/dashboard/all-blood-donation-request");
  }

  const baseUrl = `?search=${search}&bloodGroup=${bloodGroup}`;

  return (
    <div className="w-full p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-black  tracking-tight">
          All Blood Donation Requests 🩸
        </h1>
        <p className="text-sm  mt-1">
          Review, filter, and manage donation statuses to coordinate lifesaving responses.
        </p>
      </div>

      <form method="GET" className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-100 dark:border-zinc-800 shadow-sm">
        <div className="sm:col-span-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-1 block">
            Search Hospital / Location
          </label>
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="e.g. Dhaka Medical, Chittagong..."
            className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-700 dark:text-zinc-300"
          />
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-1 block">
            Blood Group
          </label>
          <select
            name="bloodGroup"
            defaultValue={bloodGroup}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-700 dark:text-zinc-300"
          >
            <option value="All Groups">All Groups</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
        </div>
        <input type="hidden" name="page" value="1" />
        <button type="submit" className="hidden"></button>
        <div className="sm:col-span-3 flex justify-end gap-2 pt-1">
          <button
            type="submit"
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold text-xs rounded-lg transition-colors uppercase tracking-wider shadow-sm"
          >
            Apply Filters
          </button>
        </div>
      </form>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-zinc-950 text-slate-400 dark:text-zinc-500 text-xs font-bold uppercase tracking-wider border-b border-slate-100 dark:border-zinc-800">
                <th className="p-4">Patient / Hospital</th>
                <th className="p-4 text-center">Blood Group</th>
                <th className="p-4">Location</th>
                <th className="p-4">Urgency</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action (Status Update Only)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 text-sm">
              {bloodRequests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400 dark:text-zinc-500 font-medium">
                    No blood donation requests found matching your filters.
                  </td>
                </tr>
              ) : (
                bloodRequests.map((request) => (
                  <tr key={request._id.toString()} className="hover:bg-slate-50/50 dark:hover:bg-zinc-950/30 transition-colors">
                    <td className="p-4 font-semibold text-slate-700 dark:text-zinc-300">
                      <div>{request.patientName || "Anonymous"}</div>
                      <div className="text-xs text-slate-400 font-normal mt-0.5">{request.hospitalName}</div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-block px-2.5 py-1 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-black rounded-md border border-red-100 dark:border-red-900/50">
                        {request.bloodGroup}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-zinc-400 font-medium">
                      {request.location}
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2 py-0.5 text-xs font-bold rounded-full capitalize ${
                        request.urgency === "urgent"
                          ? "bg-amber-50 dark:bg-amber-950/40 text-amber-600 border border-amber-100 dark:border-amber-900/50"
                          : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400"
                      }`}>
                        {request.urgency || "normal"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-0.5 text-xs font-bold rounded-full uppercase tracking-wider ${
                        request.status === "pending" ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400" :
                        request.status === "inprogress" ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400" :
                        request.status === "success" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400" :
                        "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400"
                      }`}>
                        {request.status || "pending"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <form action={updateStatus} className="flex items-center justify-end gap-2">
                        <input type="hidden" name="requestId" value={request._id.toString()} />
                        <select
                          name="status"
                          defaultValue={request.status || "pending"}
                          className="px-2 py-1 text-xs bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-700 dark:text-zinc-300 font-medium"
                        >
                          <option value="pending">Pending</option>
                          <option value="inprogress">In Progress</option>
                          <option value="success">Success</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button
                          type="submit"
                          className="px-2.5 py-1 bg-zinc-800 dark:bg-zinc-100 hover:bg-zinc-700 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-bold text-xs rounded transition-colors"
                        >
                          Update
                        </button>
                      </form>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 p-4 border-t border-slate-100 dark:border-zinc-800">
            <Link
              href={page === 1 ? "#" : `${baseUrl}&page=${page - 1}`}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                page === 1
                  ? "pointer-events-none opacity-40 border-slate-200 dark:border-zinc-800 text-slate-400"
                  : "border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800"
              }`}
            >
              Prev
            </Link>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`${baseUrl}&page=${p}`}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                  p === page
                    ? "bg-red-500 border-red-500 text-white"
                    : "border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800"
                }`}
              >
                {p}
              </Link>
            ))}

            <Link
              href={page === totalPages ? "#" : `${baseUrl}&page=${page + 1}`}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                page === totalPages
                  ? "pointer-events-none opacity-40 border-slate-200 dark:border-zinc-800 text-slate-400"
                  : "border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800"
              }`}
            >
              Next
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}