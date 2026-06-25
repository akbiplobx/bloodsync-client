
import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const updates = await request.json();

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid ID format" }, { status: 400 });
    }

    const uri = process.env.MONGODB_URI;
    if (!uri) {
      return NextResponse.json({ success: false, message: "Database URI missing" }, { status: 500 });
    }

    const client = new MongoClient(uri);
    await client.connect();
    
    const result = await client
      .db("bloodsync")
      .collection("user")
      .updateOne({ _id: new ObjectId(id) }, { $set: updates });

    await client.close();

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "User updated successfully!" });
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}