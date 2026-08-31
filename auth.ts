import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Admin",

      credentials: {
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        const password = credentials?.password;

        if (
          typeof password !== "string" ||
          !process.env.ADMIN_PASSWORD
        ) {
          return null;
        }

        if (password !== process.env.ADMIN_PASSWORD) {
          return null;
        }

        return {
          id: "admin",
          name: "Diary Admin",
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  secret: process.env.AUTH_SECRET,

  pages: {
    signIn: "/diary",
  },
});