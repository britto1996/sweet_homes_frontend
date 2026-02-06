import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { axiosServer } from "@/app/lib/http/axiosServer";
import { AUTH_TOKEN_COOKIE } from "@/app/lib/auth/constants";

function toMessage(data: unknown, fallback: string) {
  if (typeof data === "string" && data.trim()) return data;
  if (typeof data === "object" && data !== null) {
    const maybeAny = data as { message?: unknown; error?: unknown };
    if (typeof maybeAny.message === "string" && maybeAny.message.trim()) return maybeAny.message;
    if (typeof maybeAny.error === "string" && maybeAny.error.trim()) return maybeAny.error;
  }
  return fallback;
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_TOKEN_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const resp = await axiosServer.get("/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });


    if (resp.status >= 200 && resp.status < 300) {
      return NextResponse.json(resp.data ?? { ok: true }, { status: resp.status });
    }

    const message = toMessage(resp.data, "Failed to load profile");
    return NextResponse.json({ message }, { status: resp.status || 400 });
  } catch {
    return NextResponse.json({ message: "Unexpected server error" }, { status: 500 });
  }
}
