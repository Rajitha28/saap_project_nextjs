import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { NextResponse } from 'next/server';

export default NextAuth({
  callbacks: {

    /* The `async signIn({ user, account })` function in the provided code snippet is a callback
    function used in NextAuth to handle the sign-in process when a user signs in using a Google
    account. Here's a breakdown of what this function is doing: */
    async signIn({ account }) {
      const { id_token } = account;

      return account;
    },
    async jwt({ token, session, account }) {
      if (account) {
        token.accessToken = account.access_token;
        if (account) {
          token.id_token = account.id_token
        }
        // console.log(account.id_token)
        // token.sub=account.id_token
        // console.log(token.sub)

      }
      return token;
    },
    async session({ session, token, user }) {
      // console.log(session,token);
      // Optional: Customize user session data
      // setting id_token in the session
      session.user.id = token.sub;
      // console.log(session.user.id)
      session.id_token = token.id_token
      // session.token
      // Use appropriate user ID from Google response
      return session;
    },
    /* The `async redirect({ url, baseUrl })` function in the provided code snippet is a callback function
    used in NextAuth to handle the redirection after a successful sign-in process. Here's a breakdown of
    what this function is doing: */
    // async redirect({ url, baseUrl }) {
    //   // Redirect to the register page to register the use in the database
    //   if (url === `${baseUrl}/authentication/sign-in`) {
    //     return Promise.resolve(`${baseUrl}/authentication/register`);
    //   }
    //   if (url === `${baseUrl}/authentication/sign-up`) {
    //     return Promise.resolve(`${baseUrl}/authentication/register`);
    //   }
    //   return Promise.resolve(url);

    // },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
});
