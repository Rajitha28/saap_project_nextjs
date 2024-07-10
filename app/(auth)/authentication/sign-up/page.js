'use client'

import { useState, useEffect, Fragment } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Register = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session) {
      checkUserRegistrationStatus();
    }
  }, [session, status]);

  const checkUserRegistrationStatus = async () => {
    if (session?.id_token) {
      try {
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id_token: session.id_token })
        });
        const data = await response.json();
        handleRegistrationStatus(data);
      } catch (error) {
        console.error('Error during registration check:', error);
      }
    }
  };

  const handleRegistrationStatus = (data) => {
    if (data.detail === 'User not registered') {
      setRegistered(true);
    } else {
      localStorage.setItem('access_token', data.token);
      router.replace('/');
      window.location.reload();
    }
  };

  const handleRegistration = async () => {
    if (registered) {
      try {
        const response = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id_token: session?.id_token })
        });
        const data = await response.json();
        handleRegistrationResponse(data);
      } catch (error) {

        console.error('Error during registration:', error);
        await signOut();
      }
    }
  };

  const handleRegistrationResponse = (data) => {
    if (data.token) {
      localStorage.setItem("access_token", data.token);
      localStorage.setItem("user_id", data.user_id);
      router.replace('/');
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google');
  };

  return (
    <>
      {!session ? (
        <SignInScreen onSignIn={handleGoogleSignIn} />
      ) : registered ? (
        <RegistrationScreen session={session} onRegister={handleRegistration} />
      ) : null}
    </>
  );
};

const SignInScreen = ({ onSignIn }) => (
  <Row className="align-items-center justify-content-center g-0 min-vh-100">
    <Col xxl={12} lg={12} md={12} xs={12} className="py-8 py-xl-0">
      <Card className="smooth-shadow-md m-5 rounded-4">
        <Card.Body className="p-6">
          <Row className="align-items-center justify-content-center g-0 h-100">
            <Col xxl={6} lg={6} md={6} xs={12} className="py-8 py-xl-0">
              <div>
                <img className="me-1" src="/images/login/login-illustration.jpg" alt="login-illustration" style={{ width: "100%" }} />
              </div>
            </Col>
            <Col xxl={6} lg={6} md={6} xs={6} className="py-8 py-xl-0">
              <div className="d-flex align-items-center flex-column">
                <h2 className="mb-5 text-primary">Sign Up</h2>
                <Button onClick={onSignIn} variant="light" className="me-1 bg-white d-flex justify-content-center align-items-center p-3 rounded">
                  <img className="me-2" src="/images/svg/google.svg" style={{ width: "20px" }} alt="google-icon" />
                  <h4 className='text-primary mb-0'>Continue with Google</h4>
                </Button>
                <h5 className="my-5 text-center">Already have an account? <Link href='/'> Sign in </Link></h5>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Col>
  </Row>
);

const RegistrationScreen = ({ session, onRegister }) => (
  <Row className="align-items-center justify-content-center g-0 min-vh-100">
    <Col xxl={8} lg={8} md={8} xs={8} className="py-8 py-xl-0">
      <Card className="smooth-shadow-md m-5 rounded-4">
        <Card.Body className="p-6">
          <Row className="align-items-center justify-content-center g-0 h-100">
            <Col xxl={10} lg={10} md={10} xs={12} className="py-8 py-xl-0">
              <div className="d-flex align-items-center flex-column">
                <h2 className="mb-5 text-black">Hello! {session.user.name}</h2>
                <span className='text-center'>
                  {'By clicking "Agree", you agree to our'}
                  <a href="/terms-and-conditions"> Terms</a> and have read our
                  <a href="/privacy-policy"> Privacy Policy</a>
                </span>
                <Button
                  onClick={onRegister}
                  variant="light"
                  className="me-1 my-5 bg-primary d-flex justify-content-center align-items-center p-3 rounded"
                >
                  <h3 className='text-white mb-0 px-3 rounded-3'>Agree</h3>
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Col>
  </Row>
);

export default Register;
