'use client'

// import node module libraries
import { Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import Link from 'next/link';
import { signIn, useSession } from "next-auth/react";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

const SignIn = () => {
  const { data: session, status } = useSession();
  const router = useRouter(); // Initialize router here
  const [isLoading, setIsLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    const loginWithSession = async () => {
      if (session && session.id_token) {
        setIsLoading(true);
        if (!localStorage.getItem("access_token")) {
          localStorage.setItem("g_token", session.id_token);
          const response = await login(session.id_token);
          if (response.token) {
            localStorage.setItem("access_token", response.token);
            localStorage.setItem("user_id", response.user_id);
            router.push('/'); // Use router here
          } else if (response.detail === 'User not registered') {
            setRegistered(true);
          } else {
            console.error('Login failed:', response);
          }
        }
        setIsLoading(false);
      }
    };

    if (status === 'authenticated') {
      loginWithSession();
    }
  }, [session, status, router]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn('google');
  };

  const handleRegistration = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id_token: session.id_token })
      });
      const data = await response.json();
      if (data.message === "User registered successfully") {
        localStorage.setItem('registered', "yes");
        router.push('/');
      } else {
        console.error('Registration failed:', data);
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <Row className="align-items-center justify-content-center g-0 min-vh-100">
        <Col xxl={12} lg={12} md={12} xs={12} className="py-8 py-xl-0">
          <Card className="smooth-shadow-md m-5 rounded-4">
            <Card.Body className="p-6">
              <Row className="align-items-center justify-content-center g-0 h-100">
                <div className="d-flex align-items-center justify-content-center">
                  <h2 className="text-center text-primary me-3">Loading...</h2>
                  <Spinner animation="border" variant="primary" />
                </div>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  }

  return (
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
              <Col xxl={6} lg={6} md={6} xs={12} className="py-8 py-xl-0">
                <div className="d-flex align-items-center flex-column">
                  <h2 className="mb-5 text-primary">AStarPrep</h2>
                  {!registered ? (
                    <Button onClick={handleGoogleSignIn} variant="light" className="me-1 bg-white d-flex justify-content-center align-items-center p-3 rounded">
                      <img className="me-2" src="/images/svg/google.svg" style={{ width: "20px" }} alt="google-icon" />
                      <h4 className='text-primary mb-0'>Continue with Google</h4>
                    </Button>
                  ) : (
                    <>
                      <h2 className="mb-5 text-black">Hello! {session.user.name}</h2>
                      <span className='text-center'>
                        {'By clicking "Agree", you agree to our'}
                        <Link href="/terms-and-conditions"> Terms</Link> and have read our
                        <Link href="/privacy-policy"> Privacy Policy</Link>
                      </span>
                      <Button
                        onClick={handleRegistration}
                        variant="light"
                        className="me-1 my-5 bg-primary d-flex justify-content-center align-items-center p-3 rounded"
                      >
                        <h3 className='text-white mb-0 px-3 rounded-3'>Agree</h3>
                      </Button>
                    </>
                  )}
                  <h5 className="my-5 text-center">New to AStarPrep? <Link href='/authentication/sign-up'>Sign up</Link></h5>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default SignIn;

async function login(id) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ "id_token": id }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      console.error("Login response error:", response);
      return response.status;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}
