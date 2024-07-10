import { SessionProvider } from 'next-auth/react';

export default function App({ Component, pageProps }) {
  /* The variable `loginedin` is being assigned a value of `false` in the code snippet provided. It
  seems like it is intended to be used to track whether a user is logged in or not, but there is a
  typo in the variable name. The correct variable name should be `loggedIn` instead of `loginedin`. */
  // let loginedin = false;
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}