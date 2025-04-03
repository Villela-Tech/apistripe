const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { priceId } = JSON.parse(event.body);

    // Cria a sessão de checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: process.env.SUCCESS_URL || 'https://apisenderstripe.netlify.app/success',
      cancel_url: process.env.CANCEL_URL || 'https://apisenderstripe.netlify.app/cancel',
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer_creation: 'always'
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        sessionId: session.id
      })
    };
  } catch (error) {
    console.error('Erro ao criar sessão:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Erro ao criar sessão de pagamento'
      })
    };
  }
}; 