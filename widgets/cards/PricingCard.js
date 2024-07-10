// import node module libraries
import { ListGroup, Card, Button } from 'react-bootstrap';
import { createCheckout } from 'services/payment/payment';
import { useRouter } from 'next/navigation';
import { useSession, signIn, signOut } from "next-auth/react"

const PricingCard = ({ content }) => {
    const { data: session } = useSession()
    let plan = content[0];

    const router = useRouter();

   /**
    * The `handleCheckout` function creates a checkout session, stores the session ID in local storage,
    * and redirects the user to the checkout page.
    */
    const handleCheckout = () => {
        let data = session?.user?.email
        createCheckout(data).then(res => {
            res.redirect_url ? router.push(res.redirect_url) : ""
            // localStorage.setItem('user_id', res.user_id)
        })
            .catch(error => {
                console.error("Error during checkout:", error);
            });
    }
    return (
     /* The code snippet you provided is defining the structure and content of a pricing card component
     in a React application. Here's a breakdown of what the code is doing: */
        <Card>
            <Card.Body className="p-5 border-bottom mb-0">
                <div className="d-flex align-items-end mt-3 mb-3">
                    <h1 className="fw-bold me-1 mb-0">£{plan.monthly} </h1>
                    <p className="mb-0">/year</p>
                </div>
                <Button onClick={handleCheckout} className='text-light'>{plan.buttonText}</Button>
            </Card.Body>
            <Card.Body>
                <p className="mb-0">{plan.featureHeading}</p>
                <ListGroup bsPrefix="list-unstyled" className="mt-2 mb-0">
                    {plan.features.map((item, index) => {
                        return (
                            <ListGroup.Item
                                key={index}
                                className="mb-1"
                                bsPrefix="list-item"
                            >
                                <span className="text-success me-2">
                                    <i className="far fa-check-circle"></i>
                                </span>
                                <span
                                    dangerouslySetInnerHTML={{ __html: item.feature }}
                                ></span>
                            </ListGroup.Item>
                        );
                    })}
                </ListGroup>
            </Card.Body>
        </Card>
    )
}

export default PricingCard