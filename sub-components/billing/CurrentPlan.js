// import node module libraries
import { useState } from 'react'
import { Row, Col, Card } from 'react-bootstrap';

const CurrentPlan = ({plan }) => {

   /* This code snippet is defining a React functional component called `CurrentPlan`. Inside the
   component, it is returning JSX (JavaScript XML) code that represents the structure of a card
   displaying the current plan overview. Here's a breakdown of what the JSX code is doing: */
    return (
        <Col xs={12} className="mb-6">
            <Card>
                {/* card header  */}
                <Card.Header className="p-4 bg-white">
                    <h4 className="mb-0">Current Plan Overview</h4>
                </Card.Header>
                {/* card body  */}
                <Card.Body>
                    <Row className="row">
                        <Col xl={8} lg={6} md={12} xs={12}>
                            <div className="mb-2">
                                <p className="text-muted mb-0">Current Plan</p>
                                <h3 className="mt-2 mb-3 fw-bold">Plan Start Date: {plan.payment_date}</h3>
                                <p>Unlimited access to elevate Your Learning Journey with AStarPrep Subscription</p>
                                <p>
                                    <i className="fe fe-info fs-4 me-2 text-muted icon-xs"></i>
                                    Next Payment: on 
                                    <span className="text-dark mx-2 fw-bold">{plan.renewal_date}</span><span className="text-primary">{plan.amount_paid_usd} Pound</span>
                                </p>
                            </div>
                        </Col>
                        <Col xl={4} lg={6} md={12} xs={12}>
                            <div>
                            <h1 className="fw-bold text-primary">£{plan.amount_paid_usd}</h1>
                                <small className="text-muted">
                                    Yearly Payment
                                </small>
                                
                                {/* <Link href="#" className="mb-3 text-muted text-primary-hover d-block">Learn more about our membership policy</Link> */}
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Col>
    )
}

export default CurrentPlan