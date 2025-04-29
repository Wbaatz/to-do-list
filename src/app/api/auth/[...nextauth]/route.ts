import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/dbConnect';
import User from '@/lib/models/User';
import { compare } from 'bcryptjs';
import { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await dbConnect();
        const user = await User.findOne({ email: credentials?.email });

        if (!user) {
          throw new Error('No user found');
        }

        const isValid = await compare(credentials!.password, user.password);
        if (!isValid) {
          throw new Error('Incorrect password');
        }

        return { id: user._id, email: user.email };
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/Auth/SignIn',
  },
};

// Export NextAuth handler as default
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
