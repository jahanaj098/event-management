import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Only allow specific email to access admin
      if (user.email === process.env.ADMIN_EMAIL) {
        return true;
      }
      return false;
    },
    async session({ session, token }) {
      return session;
    },
  },
  pages: {
    signIn: '/admin',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
