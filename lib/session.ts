import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/** Server Component/Action helper: current NextAuth session plus the Laravel Sanctum bearer token. */
export async function getAuthSession() {
  const session = await getServerSession(authOptions);
  if (!session) return null;
  const token = (session as any).accessToken as string | undefined;
  if (!token) return null;
  return { session, token };
}
