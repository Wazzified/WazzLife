// src/auth.ts
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        const { username, password } = credentials;

        // Cek Admin
        if (username === "admin" && password === "admin123") {
          return { id: "1", name: "Admin", role: "admin" };
        }

        // Cek Demo User
        if (username === "demo" && password === "demo123") {
          return { id: "2", name: "Demo User", role: "demo" };
        }

        // Jika salah
        return null;
      }
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
      }
      return session;
    }
  }
})