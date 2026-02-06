import { cookies } from "next/headers";
import { axiosServer } from "@/app/lib/http/axiosServer";
import { AUTH_TOKEN_COOKIE } from "@/app/lib/auth/constants";
import { normalizeUserProfile, type UserProfile } from "@/app/lib/auth/normalizeProfile";

export async function getServerProfile(): Promise<UserProfile | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_TOKEN_COOKIE)?.value;
  if (!token) return null;

  const resp = await axiosServer.get("/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (resp.status >= 200 && resp.status < 300) {
    return normalizeUserProfile(resp.data);
  }

  return null;
}
