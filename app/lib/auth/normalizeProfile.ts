import type { UserRole } from "@/app/components/UI/RoleSwitch";

export type UserProfile = {
  email: string;
  role?: UserRole;
  name?: string;
  imageUrl?: string;
};

export function normalizeUserProfile(data: unknown): UserProfile | null {
  if (typeof data !== "object" || data === null) return null;
  const anyData = data as Record<string, unknown>;

  const rootEmail = typeof anyData.email === "string" ? anyData.email : undefined;
  const rootRole = anyData.role === "buyer" || anyData.role === "seller" ? anyData.role : undefined;

  const userObj = typeof anyData.user === "object" && anyData.user !== null ? (anyData.user as Record<string, unknown>) : null;
  const dataObj = typeof anyData.data === "object" && anyData.data !== null ? (anyData.data as Record<string, unknown>) : null;
  const nestedUser =
    userObj ||
    (typeof dataObj?.user === "object" && dataObj.user !== null ? (dataObj.user as Record<string, unknown>) : null);

  const nestedEmail = typeof nestedUser?.email === "string" ? nestedUser.email : undefined;
  const nestedRole = nestedUser?.role === "buyer" || nestedUser?.role === "seller" ? (nestedUser.role as UserRole) : undefined;

  const email = (rootEmail ?? nestedEmail ?? "").trim();
  if (!email) return null;

  const name =
    (typeof anyData.name === "string" ? anyData.name : undefined) ??
    (typeof nestedUser?.name === "string" ? (nestedUser.name as string) : undefined);

  const imageUrl =
    (typeof anyData.imageUrl === "string" ? anyData.imageUrl : undefined) ??
    (typeof nestedUser?.imageUrl === "string" ? (nestedUser.imageUrl as string) : undefined);

  return {
    email,
    role: rootRole ?? nestedRole,
    ...(name ? { name } : {}),
    ...(imageUrl ? { imageUrl } : {}),
  };
}

export function extractToken(data: unknown): string | null {
  if (typeof data !== "object" || data === null) return null;
  const anyData = data as Record<string, unknown>;
  const token =
    (typeof anyData.token === "string" && anyData.token.trim()) ||
    (typeof anyData.accessToken === "string" && anyData.accessToken.trim()) ||
    (typeof anyData.jwt === "string" && anyData.jwt.trim()) ||
    null;
  return token;
}
