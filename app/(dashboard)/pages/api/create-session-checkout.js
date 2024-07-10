import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY); // Replace with your secret key

export default async function handler(req, res) {
  const { priceId } = req.body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd', // Replace with your currency
          product_data: {
            name: 'Yearly Subscription',
          },
          unit_amount: 12000, // Adjust amount based on your yearly price (in cents)
          interval: 'year',
        },
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_URL}/success`, // Replace with your success URL
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`, // Replace with your cancel URL
  });

  res.status(200).json({ clientSecret: session.clientSecret });
}
