const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Donation = require('../Model/Donation');

// Helper: normalize Stripe payment intent status to schema enum
function mapStripeStatusToDonationStatus(stripeStatus) {
  switch (stripeStatus) {
    case 'succeeded':
      return 'succeeded';
    case 'canceled':
      return 'canceled';
    case 'processing':
      return 'pending';
    case 'requires_payment_method':
    case 'requires_action':
    case 'requires_confirmation':
    case 'requires_capture':
    default:
      return 'pending';
  }
}

// simple reachability check
router.get('/ping', (req, res) => res.json({ ok: true }));

// CREATE payment intent for donation
router.post('/donations', async (req, res) => {
  console.log('📥 Donation Payload:', req.body);
  try {
    const { amount, name, email, message } = req.body;

    // Expect amount in cents (integer). If client sent dollars by mistake, convert here:
    if (amount === undefined || name === undefined || email === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Normalize incoming amount:
    let amountNum = Number(amount);
    if (!Number.isFinite(amountNum) || isNaN(amountNum)) {
      return res.status(400).json({ error: 'Invalid donation amount' });
    }

    // If the value looks like dollars (has decimals or < 100), convert to cents.
    // This keeps the API tolerant while preferring cents.
    let amountInCents;
    if (Number.isInteger(amountNum) && amountNum >= 100) {
      amountInCents = amountNum; // already cents
    } else {
      amountInCents = Math.round(amountNum * 100); // treat as dollars -> cents
    }

    if (amountInCents <= 0) {
      return res.status(400).json({ error: 'Invalid donation amount' });
    }

    // Idempotency: accept client idempotency key or derive one
    const idempotencyKey =
      req.headers['idempotency-key'] || `${email}-${amountInCents}-${Date.now()}`;

    // create Stripe PaymentIntent using cents
    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: amountInCents,
        currency: 'usd',
        payment_method_types: ['card'],
        metadata: { name, email, message: message || '' },
      },
      {
        idempotencyKey,
      }
    );

    // prepare donation document (store cents)
    const donationDoc = new Donation({
      amount: amountInCents,
      name,
      email,
      message: message || '',
      paymentIntentId: paymentIntent.id,
      currency: 'usd',
      status: mapStripeStatusToDonationStatus(paymentIntent.status),
    });

    // save and handle duplicate key gracefully
    try {
      await donationDoc.save();
    } catch (saveErr) {
      if (saveErr.code === 11000 && saveErr.keyPattern && saveErr.keyPattern.paymentIntentId) {
        console.warn('⚠️ Duplicate donation record for paymentIntentId, continuing');
      } else {
        throw saveErr;
      }
    }

    return res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('❌ POST /api/donations error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

module.exports = router;