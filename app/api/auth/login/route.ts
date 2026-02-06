import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { axiosServer } from "@/app/lib/http/axiosServer";
import { AUTH_TOKEN_COOKIE } from "@/app/lib/auth/constants";
import { extractToken } from "@/app/lib/auth/normalizeProfile";

function toMessage(data: unknown, fallback: string) {
  if (typeof data === "string" && data.trim()) return data;
  if (typeof data === "object" && data !== null) {
    const maybeAny = data as { message?: unknown; error?: unknown; errors?: unknown };
    if (typeof maybeAny.message === "string" && maybeAny.message.trim()) return maybeAny.message;
    if (typeof maybeAny.error === "string" && maybeAny.error.trim()) return maybeAny.error;

    if (Array.isArray(maybeAny.errors) && maybeAny.errors.length > 0) {
      const first = maybeAny.errors[0];
      if (typeof first === "string" && first.trim()) return first;
      if (typeof first === "object" && first !== null) {
        const anyFirst = first as { message?: unknown };
        if (typeof anyFirst.message === "string" && anyFirst.message.trim()) return anyFirst.message;
      }
    }
  }
  return fallback;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = body as Partial<{ email: unknown; password: unknown; role: unknown }>;
  const email = typeof parsed.email === "string" ? parsed.email.trim() : "";
  const password = typeof parsed.password === "string" ? parsed.password : "";
  const role = parsed.role === "buyer" || parsed.role === "seller" ? parsed.role : null;

  if (!email || !password || !role) {
    return NextResponse.json({ message: "email, password and role are required" }, { status: 400 });
  }

  try {
    const resp = await axiosServer.post(
      "/auth/login",
      { email, password, role },
      { headers: { "Content-Type": "application/json" } }
    );

    if (resp.status >= 200 && resp.status < 300) {
      const token = extractToken(resp.data);
      if (!token) {
        return NextResponse.json(
          { message: "Login succeeded but no token was returned by the backend." },
          { status: 502 }
        );
      }

      const cookieStore = await cookies();
      cookieStore.set(AUTH_TOKEN_COOKIE, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return NextResponse.json(resp.data ?? { ok: true }, { status: resp.status });
    }

    const message = toMessage(resp.data, "Login failed");
    return NextResponse.json({ message }, { status: resp.status || 400 });
  } catch {
    return NextResponse.json({ message: "Unexpected server error" }, { status: 500 });
  }
}
