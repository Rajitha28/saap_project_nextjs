'use client'
// import node module libraries
import { Row, Col, Container, Card, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { PageHeading } from 'widgets'
import Image from 'next/image';
import Link from 'next/link';
import { getPaymentStatus, trialPlan } from 'services/payment/payment';
import { useRouter } from 'next/navigation';
// import sub components
import { CurrentPlan } from 'sub-components'
import Loader from 'components/loader/loader';

const Billing = () => {

  const router = useRouter();

  const [activePlanStatus, setActivePlanStatus] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState();

  const userId = localStorage.getItem('user_id');

  useEffect(() => {

    trialPlan(userId)
      .then(response => {
        response.data.start_date = formatDate(response.data.start_date)
        response.data.trial_expired = formatDate(response.data.trial_expired)
        setSubscriptionData(response.data);
        setIsLoading(false);
      })
      .catch(() => {
        router.push('/subscription');
      });
    /* This code block in the `Billing` component is responsible for fetching the payment status for
the current session and updating the state of the `activePlanStatus` based on the retrieved
status. */

    getPaymentStatus().then(status => {
      setActivePlanStatus(status);
      setIsLoading(false);
      // localStorage.setItem('active_plan_status', status.status);
    })
      .catch(() => {
        router.push('/subscription');
      });
  }
    , [])

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = String(date.getFullYear()); // Get the full year
    return `${day}-${month}-${year}`;
  }

  if (isLoading) {
    return (
      <div className='h-75 d-flex align-items-center justify-content-center'>
        <Loader />
      </div>
    );
  }

  /* This `return` statement in the `Billing` component is rendering the JSX (JavaScript XML) code that
  represents the UI of the Billing component. Here's a breakdown of what it's doing: */
  return (
    <Container fluid className="p-4">
      {/* Page Heading */}
      <PageHeading heading="Subscription" />
      <Row className="justify-content-center mt-8">
        <Col xl={{ span: 10 }} lg={{ span: 12 }} md={12} xs={12}>
          <Row>
            {/* Current Plan Overview */}

            {subscriptionData?.plan == "subscribed" ? (activePlanStatus?.status && (<CurrentPlan plan={activePlanStatus} />)) :
              (<Card>
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
                        <h3 className="mt-2 mb-3 fw-bold">Plan Start Date: {subscriptionData.start_date}</h3>
                        {/* <p>Unlimited access to elevate Your Learning Journey with AStarPrep Subscription</p> */}
                        {subscriptionData.plan == "trial" ? (
                          <>
                            <p>Your trial period will expired on <span className='fw-bold text-dark'>{subscriptionData.expires_in} </span>days. To continue accessing assessments without any interruptions, please subscribe to our unlimited subscription pack.</p>
                            <p>Thank you for choosing AStarPrep!</p>
                          </>
                        ) : (
                          <>
                            <p>Your trial period ended on <span className='fw-bold text-dark'>{subscriptionData.trial_expired} </span>. To continue accessing assessments and enjoying uninterrupted learning, please subscribe to our unlimited subscription pack.</p>
                            <p>Thank you for choosing AStarPrep!</p>
                          </>
                        )}

                        {/* <p>
                                  <i className="fe fe-info fs-4 me-2 text-muted icon-xs"></i>
                                  Next Payment: on 
                                  <span className="text-dark mx-2 fw-bold">Renweal Date</span><span className="text-primary">Plan Amount</span>
                              </p> */}
                      </div>
                    </Col>
                    <Col xl={4} lg={6} md={12} xs={12}>
                      <div>
                        <h3 className="fw-bold">Pricing Plan</h3>
                        <h1 className="fw-bold text-primary">£1</h1>
                        <small className="text-muted">
                          Yearly Payment
                        </small>

                      </div>
                      <Button className='text-white mt-3' href={"/pricing"}>
                        Subscribe
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>)}

            {/* // ( 
            //   <>  
            //    <div className="text-center">
            //   <Image src="/images/payment/unsubscribe-page-1.jpg" height={300} width={520} alt='No Active Plan' />
            //    <h3 className='mb-5'>You have not subscribed to any plan yet.</h3>
            //   <Link href="/pricing" className='btn btn-primary text-light'>
            //     Subscribe Now
            //    </Link>
            //   </div> 
            //   </>
            //  )
            } */}

            {/* {subscriptionData && (
                <Card>
            
                <Card.Header className="p-4 bg-white">
                    <h4 className="mb-0">Current Plan Overview</h4>
                </Card.Header>
                <Card.Body>
                    <Row className="row">
                        <Col xl={8} lg={6} md={12} xs={12}>
                            <div className="mb-2">
                                <p className="text-muted mb-0">Current Plan</p>
                                <h3 className="mt-2 mb-3 fw-bold">Plan Start Date: {subscriptionData.start_date}</h3>
                                <p>Unlimited access to elevate Your Learning Journey with AStarPrep Subscription</p>
                                {subscriptionData.plan === 'trial' ? (
                                   <p>Your trial period will be end in <span className='fw-bold text-dark'>{subscriptionData.expires_in} </span>days.</p>
                                ) : (
                                  <p>Your trial period ended on <span className='fw-bold text-dark'>{subscriptionData.trial_expired} </span>. To attend the assessment, Please <a className="text-primary fw-bold underline" href={"/pricing"}> Subscribe.</a></p>
                                )}
                                
                                
                            </div>
                        </Col>
                        <Col xl={4} lg={6} md={12} xs={12}>
                            <div>
                              <h3 className="fw-bold">Pricing Plan</h3>
                            <h1 className="fw-bold text-primary">£1</h1>
                                <small className="text-muted">
                                    Yearly Payment
                                </small>
                                
                            </div>
                            <Button className='text-white mt-3' href={"/pricing"}>
                                Subscribe
                                </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            )} */}
          </Row>
        </Col>
      </Row>
    </Container>
  )
}

export default Billing;