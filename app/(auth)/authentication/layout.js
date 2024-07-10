'use client'
import { SessionProvider } from 'next-auth/react';
// import node module libraries
import { Container } from 'react-bootstrap';

export default function AuthLayout({ children }) {
  return (
    <Container className="d-flex flex-column">  
        <SessionProvider>
        {children}
        </SessionProvider>
    </Container>
  )
}
