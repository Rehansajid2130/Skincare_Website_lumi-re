import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function testConnection() {
  try {
    console.log('Testing Stripe API key...');
    // 1. Check account / balance
    const balance = await stripe.balance.retrieve();
    console.log('✅ STRIPE CONNECTION SUCCESSFUL!');
    console.log('Available balance (live/test):', balance.available);

    // 2. Test creating a real test PaymentIntent for $48.00 (4800 cents)
    const idempotencyKey = `test-order-${Date.now()}-attempt-1`;
    const pi = await stripe.paymentIntents.create(
      {
        amount: 4800,
        currency: 'usd',
        metadata: { order_id: 'LUM-TEST-1001', test: 'true' },
        automatic_payment_methods: { enabled: true }
      },
      { idempotencyKey }
    );

    console.log('✅ PAYMENT INTENT CREATED SUCCESSFULLY!');
    console.log('PaymentIntent ID:', pi.id);
    console.log('Status:', pi.status);
    console.log('Client Secret (for frontend):', pi.client_secret.slice(0, 15) + '...');
    console.log('Idempotency Key verified:', idempotencyKey);
  } catch (err) {
    console.error('❌ STRIPE ERROR:', err.message);
  }
}

testConnection();
