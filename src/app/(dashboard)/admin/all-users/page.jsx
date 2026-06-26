import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { MongoClient } from "mongodb";
import { UserTable } from "@/components/UserTable";

async function getUsersFromDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Please add your MONGODB_URI to env");

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const users = await client
      .db("bloodsync")
      .collection("user")
      .find({})
      .project({ password: 0 }) 
      .toArray();

    return users.map(user => ({
      ...user,
      _id: user._id.toString(),
    }));
  } catch (error) {
    console.error("Database fetch failed:", error);
    return [];
  } finally {
    await client.close();
  }
}

export default async function AllUsersPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  if (session.user?.role !== "admin") {
    redirect("/dashboard");
  }

  const liveUsers = await getUsersFromDB();

  return (
    <div className="w-full p-4">
      
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100">User Management</h1>
        <p className="text-sm text-slate-500 mt-1">Oversee community roles, statuses, and permissions.</p>
      </div>

      
      <UserTable initialUsers={liveUsers} />
    </div>
  );
}