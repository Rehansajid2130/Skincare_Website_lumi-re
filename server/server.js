// ponytail: minimal Node.js + Express backend for Stripe following agency-payments-billing-engineer standards.
// Requires: npm install express cors dotenv stripe
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20'
});

const PORT = process.env.PORT || 5000;

// In-memory processed webhook cache for deduplication (in production use Redis or SQL table)
const processedEvents = new Set();

// 1. Webhook endpoint MUST receive raw body (NOT parsed json) for HMAC signature verification
app.post(
  '/api/webhooks',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Deduplicate: PSPs deliver at-least-once (meaning duplicate delivery is normal)
    if (processedEvents.has(event.id)) {
      return res.status(200).json({ received: true, deduplicated: true });
    }
    processedEvents.add(event.id);

    // Handle payment events
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        console.log(`[FULFILL] Payment succeeded for order: ${paymentIntent.metadata.order_id}`);
        // Fulfill order in database idempotently
        break;
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        console.log(`[DECLINED] Payment failed for order: ${paymentIntent.metadata.order_id}`);
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  }
);

// Standard JSON parsing for other REST endpoints
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

// 2. Create PaymentIntent with deterministic business idempotency key
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amountCents, currency = 'usd', orderId, attempt = 1 } = req.body;

    if (!amountCents || !orderId) {
      return res.status(400).json({ error: 'Missing required fields: amountCents or orderId' });
    }

    // Critical: Derive idempotency key from business domain (orderId + attempt)
    const idempotencyKey = `order-${orderId}-attempt-${attempt}`;

    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: Math.round(amountCents), // Integer cents only (never floats)
        currency: currency.toLowerCase(),
        automatic_payment_methods: { enabled: true },
        metadata: { order_id: orderId, attempt: String(attempt) }
      },
      { idempotencyKey }
    );

    res.json({
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id,
      idempotencyKey
    });
  } catch (error) {
    console.error('Payment intent error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Lumiere Payment Gateway Server running on port ${PORT}`);
});
