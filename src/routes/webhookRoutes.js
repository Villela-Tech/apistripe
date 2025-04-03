const express = require('express');
const router = express.Router();
const stripe = require('../config/stripeConfig');

router.post('/webhook', async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'customer.subscription.created':
            console.log('Subscription created:', event.data.object);
            break;
        case 'customer.subscription.updated':
            console.log('Subscription updated:', event.data.object);
            break;
        case 'customer.subscription.deleted':
            console.log('Subscription deleted:', event.data.object);
            break;
        case 'invoice.paid':
            console.log('Invoice paid:', event.data.object);
            break;
        case 'invoice.payment_failed':
            console.log('Payment failed:', event.data.object);
            break;
    }

    res.json({received: true});
});

module.exports = router; 