import { getScalekit } from "@/lib/scalekit";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
    const redirectUri=`${req.nextUrl.origin}/api/auth/callback`
    const url=getScalekit().getAuthorizationUrl(redirectUri)
    console.log(url)
    return NextResponse.redirect(url)
}
