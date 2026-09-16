// ponytail: 1-line test trigger script that simulates an HMAC-signed Stripe webhook
// sends directly to http://localhost:5000/api/webhooks using the whsec secret in .env
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_MfHAokw3rpZLqyAQTpYnzLKIjC8oE5tr';
const endpoint = 'http://localhost:5000/api/webhooks';

const payload = JSON.stringify({
  id: 'evt_test_' + Date.now(),
  object: 'event',
  api_version: '2024-06-20',
  created: Math.floor(Date.now() / 1000),
  type: 'payment_intent.succeeded',
  data: {
    object: {
      id: 'pi_test_' + Math.random().toString(36).substring(2, 10),
      object: 'payment_intent',
      amount: 4800,
      currency: 'usd',
      status: 'succeeded',
      metadata: {
        order_id: 'LUM-' + Math.floor(100000 + Math.random() * 900000),
        attempt: '1'
      }
    }
  }
});

// Compute Stripe HMAC-SHA256 signature: t=timestamp,v1=signature
const timestamp = Math.floor(Date.now() / 1000);
const signedPayload = `${timestamp}.${payload}`;
const signature = crypto
  .createHmac('sha256', webhookSecret)
  .update(signedPayload, 'utf8')
  .digest('hex');

const stripeSignatureHeader = `t=${timestamp},v1=${signature}`;

console.log('Sending signed webhook to:', endpoint);

fetch(endpoint, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Stripe-Signature': stripeSignatureHeader
  },
  body: payload
})
  .then(async res => {
    const text = await res.text();
    console.log(`✅ Webhook response [${res.status}]:`, text);
  })
  .catch(err => {
    console.error('❌ Failed to send webhook:', err.message);
  });
