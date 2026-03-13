import { NextResponse } from "next/server";
import { axiosServer } from "@/app/lib/http/axiosServer";

function toMessage(data: unknown, fallback: string) {
  if (typeof data === "string" && data.trim()) return data;
  if (typeof data === "object" && data !== null) {
    const d = data as { message?: unknown; error?: unknown };
    if (typeof d.message === "string" && d.message.trim()) return d.message;
    if (typeof d.error === "string" && d.error.trim()) return d.error;
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

  const parsed = body as Partial<{ otpCode: unknown; email: unknown; userId: unknown }>;
  const otpCode = typeof parsed.otpCode === "string" ? parsed.otpCode.trim() : "";
  const email = typeof parsed.email === "string" ? parsed.email.trim() : "";
  const userId = typeof parsed.userId === "string" ? parsed.userId.trim() : "";

  if (!otpCode || !email || !userId) {
    return NextResponse.json(
      { message: "otpCode, email and userId are required" },
      { status: 400 }
    );
  }

  try {
    const resp = await axiosServer.post(
      "/auth/verify-otp",
      { otpCode, email, userId },
      { headers: { "Content-Type": "application/json" } }
    );

    if (resp.status >= 200 && resp.status < 300) {
      return NextResponse.json(resp.data ?? { ok: true }, { status: resp.status });
    }

    const message = toMessage(resp.data, "OTP verification failed");
    return NextResponse.json({ message }, { status: resp.status || 400 });
  } catch {
    return NextResponse.json({ message: "Unexpected server error" }, { status: 500 });
  }
}
