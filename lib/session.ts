import { cache } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { api, ApiError } from "@/lib/api-client";

/** Server Component/Action helper: current NextAuth session plus the Laravel Sanctum bearer token. */
export const getAuthSession = cache(async function getAuthSession() {
  const session = await getServerSession(authOptions);
  if (!session) return null;
  const token = (session as any).accessToken as string | undefined;
  if (!token) return null;

  try {
    const user = await api.auth.me(token);
    Object.assign(session.user, {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.imageUrl ?? null,
      role: user.role,
      permissions: user.permissions ?? [],
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }

  return { session, token };
});
