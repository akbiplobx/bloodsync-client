import { NextResponse } from "next/server";
import { auth } from "./lib/auth";
import { headers } from "next/headers";

export async function proxy(request) {
  //   console.log(request, "request");

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  console.log(session, "session");

  //   const isLoggedIn = false;

if(!session) {
         return NextResponse.redirect(new URL('/signin', request.url))
    }
  // if (session) {
  //   return NextResponse.next();
  // }

  // return NextResponse.redirect(new URL("/signin", request.url));
}


export const config = {
 
  matcher: [
  '/dashboard/:path*',
]
}