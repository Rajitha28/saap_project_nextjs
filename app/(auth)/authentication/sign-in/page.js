'use client'

// import node module libraries
import { Row, Col, Card, Button, Container } from 'react-bootstrap';
import Link from 'next/link';
import { signIn, signOut, useSession } from "next-auth/react"
import { useRouter } from 'next/navigation';
// import hooks
import useMounted from 'hooks/useMounted';
import React, { useEffect } from 'react';
const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

const SignIn = () => {
  const router = useRouter();
  // Assuming this is the recursive call
  const { data: session } = useSession();
  const hasMounted = useMounted();
  useEffect(() => {
    const loginWithSession = async () => {
      if (session && !localStorage.getItem('access_token')) {
        try {
          const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({ "id_token": session.id_token }), // Assuming user ID from session data
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            const data = await response.json();
            if (data.detail === 'User not registered') {
              // User not registered: Redirect to registration page
              router.push('/authentication/sign-up');
            }
          }
          else {
      
            const data = await response.json();
            localStorage.setItem('access_token', data.token);
            localStorage.setItem('user_id', data.user_id);
            localStorage.setItem('name', session.user?.name);
            localStorage.setItem("profileurl", session.user?.image);
            router.replace('/');
          }


        } catch (error) {
          console.error('Login failed:', error);
          await signOut();
          // Sign out if login fails
        }
      } []
    };

    if (hasMounted) {
      loginWithSession();
    }
  }, [session, hasMounted]);

  const handleGoogleSignIn = async () => {
    await signIn('google');
  };

  return (
    <Container className="d-flex flex-column">
      <Row className="align-items-center justify-content-center g-0 min-vh-100">
        <Col xxl={12} lg={12} md={12} xs={12} className="py-8 py-xl-0">
          {/* Card */}
          <Card className="smooth-shadow-md m-5 rounded-4">
            {/* Card body */}
            <Card.Body className="p-6">
              <Row className="align-items-center justify-content-center g-0 h-100">
                <Col xxl={6} lg={6} md={6} xs={12} className="py-8 py-xl-0">
                  <div>
                    <img className="me-1" src="/images/login/login-illustration.jpg" alt="login-illustration" style={{ width: "100%" }} />
                  </div>
                </Col>
                <Col xxl={6} lg={6} md={6} xs={6} className="py-8 py-xl-0">
                  <div className=" d-flex align-items-center flex-column">
                    <h2 className="mb-5 text-primary">Welcome back!</h2>
                    <Button onClick={handleGoogleSignIn} variant="light" className="me-1 bg-white d-flex justify-content-center align-items-center p-3 rounded"><img className="me-2" src="/images/svg/google.svg" style={{ width: "20px" }} alt="google-icon" /><h4 className=' text-primary mb-0'> Continue with Google </h4></Button>
                    <h5 className="my-5 text-center">New to AStarPrep? <Link href='/authentication/sign-up'>Sign up</Link></h5>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SignIn;
