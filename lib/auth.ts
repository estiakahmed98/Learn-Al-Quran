import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { api, ApiError } from "@/lib/api-client";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login"
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const { user, token } = await api.auth.login(credentials.email, credentials.password);
          if (!user.isActive) return null;

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.imageUrl ?? null,
            role: user.role,
            permissions: user.permissions ?? [],
            accessToken: token
          };
        } catch (error) {
          if (error instanceof ApiError) return null;
          throw error;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = (user as any).id;
        token.picture = (user as any).image || null;
        token.permissions = (user as any).permissions || [];
        token.accessToken = (user as any).accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
        (session.user as any).image = token.picture || null;
        (session.user as any).permissions = token.permissions || [];
      }
      (session as any).accessToken = token.accessToken;
      return session;
    }
  }
};
