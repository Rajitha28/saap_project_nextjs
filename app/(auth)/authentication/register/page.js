'use client'

import { useState, useEffect, Fragment } from 'react';
import { Row, Col, Card, Form, Button, Image, Container, Spinner } from 'react-bootstrap';
import Link from 'next/link';
import { signIn, useSession } from "next-auth/react"
import { useRouter } from 'next/navigation';

// import hooks
import useMounted from 'hooks/useMounted';

const Register = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [registered, setRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;
  // const hasMounted = useMounted();
  const checkUserLoginStatus = async () => {
    // if (!hasMounted) return;

    if (session?.id_token) {
      try {
        const response = await fetch(`${apiUrl}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id_token: session.id_token })
        });
        const data = await response.json();

        if (data.detail === 'User not registered') {
          setIsLoading(false);
          setRegistered(true);
          localStorage.removeItem('registered');
        } else if (!data.token || data.detail === "Invalid user or session expired") {
          localStorage.removeItem('token');
          localStorage.removeItem('registered');
        } else {
          localStorage.setItem('token', data.token);
          localStorage.setItem('registered', "yes");
          router.replace('/');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error posting JSON:', error);
      }
    } else {
      setIsLoading(false);
    }
  };

/**
 * The `handleRegistration` function sends a POST request to register a user if they are already
 * registered.
 */
  const handleRegistration = () => {
    if(registered){
      console.log("yes")
    fetch(`${apiUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id_token: session?.id_token })
    })
      .then(response => response.json())
      .then(data => {
        // setIsLoading(false);
        if (data.message === "User registered successfully") {
          console.log(data.message)
          localStorage.setItem('registered', "yes"); 
          router.replace('/');
        }
      })
      .catch(error => {
        console.error('Error posting JSON:', error);
      });
    }
  };
  useEffect(() => {
  checkUserLoginStatus();
}, [session]);

  if (isLoading || status !=="authenticated") {
        return <Fragment>
        <Row className="align-items-center justify-content-center g-0 min-vh-100">
          <Col xxl={12} lg={12} md={12} xs={12} className="py-8 py-xl-0">
            {/* Card */}
            <Card className="smooth-shadow-md m-5 rounded-4">
              {/* Card body */}
              <Card.Body className="p-20">
                <Row className=" g-0 h-100">
                    <div className="d-flex align-items-center justify-content-center">
                        <h2 className="text-center text-primary me-3">Loading...</h2>
                        <Spinner animation="border" variant="primary" />
                    </div>
                 </Row>   
              </Card.Body>
            </Card>
          </Col>
        </Row>
    </Fragment>;
      }
    

  return (
    <>
    {registered && (
    <Row className="align-items-center justify-content-center g-0 min-vh-100">
      <Col xxl={8} lg={8} md={8} xs={8} className="py-8 py-xl-0">
        {/* Card */}
        <Card className="smooth-shadow-md m-5 rounded-4">
          {/* Card body */}
          <Card.Body className="p-6">
            <Row className="align-items-center justify-content-center g-0 h-100">
              <Col xxl={10} lg={10} md={10} xs={12} className="py-8 py-xl-0">
                <div className="d-flex align-items-center flex-column">
                  <h2 className="mb-5 text-primary">AStarPrep</h2>
                  <h2 className="mb-5 text-black">Hello!  {session && session.user.name}</h2>
                  {/* <h2 className="mb-5 text-primary">AStarPrep</h2> */}

                  <span className='text-center'>By clicking Agree, you agree to our<a href="/terms-and-conditions"> Terms</a> and have read our <a href="/privacy-policy">Privacy Policy</a></span>
                  <Button
                    onClick={handleRegistration}
                    variant="light"
                    className="me-1 my-5 bg-primary d-flex justify-content-center align-items-center p-3 rounded"
                  >
                    <h3 className='text-light mb-0 px-3 rounded-3'> Agree </h3>
                  </Button>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
          )}
          </>
  )
}

export default Register;