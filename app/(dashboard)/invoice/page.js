"use client";

import React from 'react';
// import node module libraries
import { Row, Col, Container } from 'react-bootstrap';

// import widget as custom components
import { PageHeading } from 'widgets'

import InvoiceHistory from 'sub-components/billing/InvoiceHistory';

const Invoice = () => {
    return (
        <Container fluid className="p-6">
            <PageHeading heading="Invoice" />
            <Row className="mt-4">
            <Col xl={{ span: 12 }} lg={{ span: 12 }} md={12} xs={12}>
          <Row>
           <InvoiceHistory />
          </Row>
        </Col>
            </Row>
        </Container>
    );
};

export default Invoice;
