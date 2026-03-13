import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { axiosServer } from "@/app/lib/http/axiosServer";
import { AUTH_TOKEN_COOKIE } from "@/app/lib/auth/constants";

export async function GET(req: Request) {
  // Accept token from Authorization header first, then fall back to cookie
  const authHeader = req.headers.get("Authorization") ?? req.headers.get("authorization") ?? "";
  const headerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";

  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(AUTH_TOKEN_COOKIE)?.value ?? "";

  const token = headerToken || cookieToken;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const resp = await axiosServer.get("/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (resp.status >= 200 && resp.status < 300) {
      return NextResponse.json(resp.data ?? {}, { status: resp.status });
    }

    return NextResponse.json(
      { message: "Failed to fetch profile" },
      { status: resp.status || 400 }
    );
  } catch {
    return NextResponse.json({ message: "Unexpected server error" }, { status: 500 });
  }
}
