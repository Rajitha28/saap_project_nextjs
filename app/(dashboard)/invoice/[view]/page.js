"use client"

import { useEffect, useState } from "react";
import { Container, Col, Row, Table, Button } from "react-bootstrap";
import { PageHeading } from "widgets";
import { getInvoiceHistory } from "services/payment/payment";

export default function InvoiceView({ }) {

    const [invoiceHistory, setInvoiceHistory] = useState([]);

    useEffect(() => {

        let userId = localStorage.getItem("user_id");

        getInvoiceHistory(userId).then((res) => {
            setInvoiceHistory(res);
        }).catch((error) => {
            console.error('Error fetching invoice history:', error);    
        });
    }, [])

    return (
        <Container fluid className="p-6">
            <PageHeading heading="Invoice" />
            <Row className="mt-4">
                <Col xl={{ span: 12 }} lg={{ span: 12 }} md={12} xs={12}>
                    <Row>
                        <Row className="justify-content-center">
                            <Col md={8}>
                                {invoiceHistory && <Table bordered>
                                    <tbody>
                                        <tr>
                                            <td>Invoice Number</td>
                                            <td>{invoiceHistory[0]?.invoice.stripe_invoice_id}</td>
                                        </tr>
                                        <tr>
                                            <td>Date</td>
                                            <td>{invoiceHistory[0]?.start_date}</td>
                                        </tr>
                                        {/* <tr>
                                            <td>Customer Information</td>
                                            <td>
                                                John Doe<br />
                                                123 Main St, City<br />
                                                john@example.com
                                            </td>
                                        </tr> */}
                                        <tr>
                                            <td>Subscription Plan</td>
                                            <td>{invoiceHistory[0]?.subscription_plan}</td>
                                        </tr>
                                        <tr>
                                            <td>Subscription Period</td>
                                            <td>{invoiceHistory[0]?.subscription_period}</td>
                                        </tr>
                                        <tr>
                                            <td>Total Amount Paid</td>
                                            <td>{invoiceHistory[0]?.amount_paid}</td>
                                        </tr>
                                        {/* <tr>
                                            <td>Payment Method</td>
                                            <td>Credit Card - Visa ending in XXXX</td>
                                        </tr> */}
                                        <tr>
                                            <td>Transaction ID</td>
                                            <td>{invoiceHistory[0]?.transaction_id}</td>
                                        </tr>
                                        <tr>
                                            <td>Subscription Expiry Date</td>
                                            <td>{invoiceHistory[0]?.renewal_date}</td>
                                        </tr>
                                        <tr>
                                            <td>Status</td>
                                            <td>{invoiceHistory[0]?.plan_status}</td>
                                        </tr>
                                    </tbody>
                                </Table>}

                                <p className="text-center mt-4">Thank you for your subscription!</p>
                            </Col>
                        </Row>
                    </Row>
                </Col>
            </Row>

        </Container>
    )
}