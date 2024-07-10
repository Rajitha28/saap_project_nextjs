"use client"
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const TermsAndConditions = () => {
  return (
    <Container className="my-5">
      <Row>
        <Col>
          <h1>Terms and Conditions</h1>
          <hr />
          <h2>Introduction</h2>
          <p>
            Welcome to our exam preparation web application. By accessing or using our
            services, you agree to be bound by these terms and conditions and our
            privacy policy.
          </p>
          <h2>User Responsibilities</h2>
          <ul>
            <li>You must be at least 18 years old to use our services.</li>
            <li>
              You agree to use our services only for lawful purposes and in
              accordance with these terms and conditions.
            </li>
            <li>
              You are responsible for maintaining the confidentiality of your
              account information.
            </li>
          </ul>
          {/* Add more sections as needed */}
        </Col>
      </Row>
    </Container>
  );
};

export default TermsAndConditions;
