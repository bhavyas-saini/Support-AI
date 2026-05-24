
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
   const cookieStore=await cookies()
   cookieStore.delete("access_token")
   return NextResponse.redirect(req.nextUrl.origin)
}
