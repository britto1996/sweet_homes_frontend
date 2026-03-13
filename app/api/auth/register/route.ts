import { NextResponse } from "next/server";
import { axiosServer } from "@/app/lib/http/axiosServer";

function toMessage(data: unknown, fallback: string) {
  if (typeof data === "string" && data.trim()) return data;
  if (typeof data === "object" && data !== null) {
    const d = data as { message?: unknown; error?: unknown; errors?: unknown };
    if (typeof d.message === "string" && d.message.trim()) return d.message;
    if (typeof d.error === "string" && d.error.trim()) return d.error;
    if (Array.isArray(d.errors) && d.errors.length > 0) {
      const first = d.errors[0];
      if (typeof first === "string" && first.trim()) return first;
      if (typeof first === "object" && first !== null) {
        const f = first as { message?: unknown };
        if (typeof f.message === "string" && f.message.trim()) return f.message;
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

  const parsed = body as Partial<{
    email: unknown;
    password: unknown;
    confirmPassword: unknown;
    role: unknown;
  }>;

  const email = typeof parsed.email === "string" ? parsed.email.trim() : "";
  const password = typeof parsed.password === "string" ? parsed.password : "";
  const confirmPassword = typeof parsed.confirmPassword === "string" ? parsed.confirmPassword : "";
  const role = parsed.role === "seller" || parsed.role === "user" ? parsed.role : "user";

  if (!email || !password || !confirmPassword) {
    return NextResponse.json(
      { message: "email, password and confirmPassword are required" },
      { status: 400 }
    );
  }

  if (password !== confirmPassword) {
    return NextResponse.json({ message: "Passwords do not match" }, { status: 400 });
  }

  try {
    const resp = await axiosServer.post(
      "/auth/register",
      { email, password, confirmPassword, role },
      { headers: { "Content-Type": "application/json" } }
    );

    if (resp.status >= 200 && resp.status < 300) {
      return NextResponse.json(resp.data ?? { ok: true }, { status: resp.status });
    }

    const message = toMessage(resp.data, "Registration failed");
    return NextResponse.json({ message }, { status: resp.status || 400 });
  } catch {
    return NextResponse.json({ message: "Unexpected server error" }, { status: 500 });
  }
}
