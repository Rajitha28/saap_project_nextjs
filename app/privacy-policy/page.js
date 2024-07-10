"use client"
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const PrivacyPolicy = () => {
  return (
    <Container className="my-5">
      <Row>
        <Col>
          <h1>Privacy Policy</h1>
          <hr />
          <h2>Information Collection</h2>
          <p>
            We collect certain personal information from you, such as your name,
            email address, and profile picture, to provide you with a personalized
            exam preparation experience.
          </p>
          <h2>Data Usage</h2>
          <p>
            We use your personal information to deliver relevant study materials,
            track your progress, and provide you with updates and notifications
            about our services.
          </p>
          <h2>Data Sharing</h2>
          <p>
            We may share your personal information with third-party service
            providers who assist us in operating our web application. These
            providers are bound by confidentiality agreements and are not
            permitted to use your data for any other purpose.
          </p>
          {/* Add more sections as needed */}
        </Col>
      </Row>
    </Container>
  );
};

export default PrivacyPolicy;
