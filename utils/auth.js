import { getSession } from 'next-auth/react';

export const requireAuthentication = async (context) => {
  const session = await getSession(context);

  if (!session) {
    // Redirect to the sign-in page if the user is not authenticated
    return {
      redirect: {
        destination: '/authentication/sign-in',
        permanent: false,
      },
    };
  }

  // Return an object with the session data
  return {
    props: { session },
  };
};