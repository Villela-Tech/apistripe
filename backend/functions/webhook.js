const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
    // Verifica se é uma requisição POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed'
        };
    }

    const sig = event.headers['stripe-signature'];
    let eventStripe;

    try {
        eventStripe = stripe.webhooks.constructEvent(
            event.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        return {
            statusCode: 400,
            body: `Webhook Error: ${err.message}`
        };
    }

    // Handle the event
    switch (eventStripe.type) {
        case 'customer.subscription.created':
            console.log('Subscription created:', eventStripe.data.object);
            break;
        case 'customer.subscription.updated':
            console.log('Subscription updated:', eventStripe.data.object);
            break;
        case 'customer.subscription.deleted':
            console.log('Subscription deleted:', eventStripe.data.object);
            break;
        case 'invoice.paid':
            console.log('Invoice paid:', eventStripe.data.object);
            break;
        case 'invoice.payment_failed':
            console.log('Payment failed:', eventStripe.data.object);
            break;
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ received: true })
    };
}; 