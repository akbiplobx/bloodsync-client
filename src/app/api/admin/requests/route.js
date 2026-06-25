import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function GET() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      return NextResponse.json({ success: false, message: "Database URI missing" }, { status: 500 });
    }

    const client = new MongoClient(uri);
    await client.connect();
    
    // ডাটাবেজের সঠিক কালেকশন "blood-data" থেকে ডেটা রিড করা হচ্ছে
    const requests = await client
      .db("bloodsync")
      .collection("blood-data") 
      .find({})
      .sort({ donationDate: -1 }) // তারিখ অনুযায়ী সর্ট করা
      .toArray();

    await client.close();
    return NextResponse.json(requests, { status: 200 });
  } catch (error) {
    console.error("GET Requests Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}