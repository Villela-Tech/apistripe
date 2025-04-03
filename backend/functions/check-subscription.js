const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
    // Verifica se é uma requisição GET
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed'
        };
    }

    const { customerId } = event.queryStringParameters;

    if (!customerId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Customer ID is required' })
        };
    }

    try {
        // Busca todas as assinaturas do cliente
        const subscriptions = await stripe.subscriptions.list({
            customer: customerId,
            limit: 1,
            status: 'active'
        });

        // Se não encontrar nenhuma assinatura ativa
        if (subscriptions.data.length === 0) {
            return {
                statusCode: 200,
                body: JSON.stringify({ 
                    hasActiveSubscription: false,
                    message: 'No active subscription found'
                })
            };
        }

        // Pega a primeira assinatura ativa
        const subscription = subscriptions.data[0];
        
        return {
            statusCode: 200,
            body: JSON.stringify({
                hasActiveSubscription: true,
                status: subscription.status,
                currentPeriodEnd: subscription.current_period_end,
                plan: subscription.items.data[0].price.id
            })
        };
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: error.message })
        };
    }
}; 