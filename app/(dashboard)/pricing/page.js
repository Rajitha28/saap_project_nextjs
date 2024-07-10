'use client'
import { Col, Row, Container } from 'react-bootstrap';
// import sub components
import { PricingCard, PageHeading } from 'widgets'


// import data files
import { multisite } from 'data/pricing/PricingPlansData';
import { SessionProvider } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Pricing = () => {


  const [planStatus, setPlanStatus] = useState('');

  const router = useRouter();
  useEffect(() => {
    const planStatus = localStorage.getItem('active_plan_status')
    setPlanStatus(planStatus)
    if (planStatus) {
      router.push('/subscription');
    }
  }, []);

  return (
    (<Container fluid className="p-5">
      {/* Page Heading */}
      <PageHeading heading="Pricing" />
      <div className="py-1">
        <Row>
          <Col xl={{ span: 10 }} md={12} className='w-100'>
            <Row className="mb-3 justify-content-center p-2">
              <Col lg={7} xs={11} className="mb-3 d-flex flex-column justify-content-center p-0 px-lg-8 py-lg-4">
                <h3 className="display-8 fw-bold ls-sm">Elevate Your Learning Journey with AStarPrep Subscription</h3>
                <p className="mb-0">Welcome to AStarPrep, your personalized solution for growth and development. With our subscription service, you gain access to a wealth of resources designed to assess your current status, identify areas for improvement, and assist you in reaching your goals.</p>
                <br></br>
                <h4 className='mb-3'>Why Choose Astarprep Subscription:</h4>
                <ol>
                  <li><strong>Tailored Solutions: </strong>
                    Our platform is designed to adapt to your unique needs and preferences, providing tailored solutions that align with your goals and aspirations.</li>
                  <li><strong>Convenience and Flexibility: </strong>
                    Access our platform anytime, anywhere, and on any device. Whether you are at home, in the office, or on the go, you can seamlessly integrate our tools and resources into your daily routine.</li>
                  <li><strong>Continuous Support: </strong>
                    Our subscription service offers ongoing support and guidance, ensuring that you have the resources and assistance you need to succeed in your personal and professional endeavors.</li>
                  <li><strong>Proven Results: </strong>
                    Join thousands of satisfied subscribers who have achieved significant growth and success with the help of our platform. Our proven methodologies and innovative approach have empowered individuals like you to unlock their full potential and achieve their goals.</li>
                </ol>
              </Col>

              <Col xl={5} lg={5} md={12} xs={12} className="mb-2">
                <SessionProvider>
                  <PricingCard content={multisite} />
                </SessionProvider>
              </Col>

            </Row>
          </Col>
        </Row>
      </div>
    </Container>
    )
  )
}

export default Pricing