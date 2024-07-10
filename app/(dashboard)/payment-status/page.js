"use client"

import React from 'react';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';
import { PageHeading } from 'widgets';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getPaymentStatus } from 'services/payment/payment';
import { useEffect, useState } from 'react';

function PaymentStatusPage() {
    const [paymentStatus, setPaymentStatus] = useState();
    const router = useRouter();

    // fetching the payment status information 
    useEffect(() => {
        // Call the getPaymentStatus function here
        const userId = localStorage.getItem('user_id') // Assuming you get sessionId from the query params

            getPaymentStatus().then(status => {
                // Set state with payment status
                const dateStr = status.transaction_date_time;
                const date = new Date(dateStr);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
                const year = String(date.getFullYear()); // Get last two digits of the year
                const hours = date.getHours();
                const minutes = String(date.getMinutes()).padStart(2, '0');

                status.transaction_date_time = `${day}-${month}-${year} ${hours}:${minutes}`
                setPaymentStatus(status);
            }).catch(() => {
                // router.push('/pricing')
            });
    }, []);

    /* This `return` statement in the `PaymentStatusPage` component is responsible for rendering the UI
    based on the `paymentStatus` state. Here's a breakdown of what it does: */
    return (
        (paymentStatus &&
            <Container fluid className="p-4">
                {/* Page Heading */}
                <PageHeading heading="Payment Status" />
                <div className="py-4">
                    <Row>
                        <Col xl={{ span: 10, offset: 1 }} md={12}>
                            {paymentStatus.status === true ? (
                                <Row className="mb-5 justify-content-center">

                                    <Col xl={6} lg={6} md={12} xs={12} className="mb-2 p-8">

                                        <div className='d-flex flex-column gap-3 align-items-center'>
                                            <img height={70} width={70} src='/images/payment/success-svg.svg'></img>
                                            <h3>{paymentStatus.message}</h3>
                                            <p className='text-center'>Your payment was successful and you can start your assessment whenever you want.</p>
                                        </div>
                                    </Col>
                                    <Col xl={6} lg={6} md={12} xs={12} className="mb-3">
                                        <Card>
                                            <Card.Body className="p-6 border-bottom mb-4">
                                                <p className='d-flex justify-content-between'><strong>Transaction ID:</strong>
                                                    <span className='px-5'>{paymentStatus.transaction_id}</span></p>
                                                <p className='d-flex justify-content-between'><strong>Amount paid:</strong> <span className='px-5'>£ {paymentStatus.amount_paid_usd}</span></p>
                                                <p className='d-flex justify-content-between'><strong>Date & Time</strong><span className='px-5'>{paymentStatus.transaction_date_time}</span></p>
                                                <p className='d-flex justify-content-between'><strong>Renewal Date :</strong><span className='px-5'>{paymentStatus.renewal_date}</span></p>
                                                <Link className='btn btn-primary text-light' href="/subscription">Back
                                                </Link>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            ) :
                                (
                                    <Row className="mb-5 justify-content-center">

                                        <Col xl={12} lg={12} md={12} xs={12} className="mb-2 p-8">
                                            <div className='d-flex flex-column gap-3 align-items-center'>
                                                <img height={70} width={70} src='/images/payment/status-failed-svg.svg'></img>
                                                <h3>{paymentStatus.message}</h3>
                                                <p className='text-center'>We cannot process your payment, check your internet connection and try again.</p>
                                                <Link href={'/pricing'} className='btn btn-warning' >Retry Payment</Link>
                                            </div>
                                        </Col>
                                    </Row>
                                )
                            }
                        </Col>
                    </Row>
                </div>
            </Container >)

    );
}

export default PaymentStatusPage;
