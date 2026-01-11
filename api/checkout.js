const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
    if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(500).json({ error: 'Configuration Error: STRIPE_SECRET_KEY is missing in Vercel settings.' });
    }

    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { items } = req.body;

        // Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: items,
            mode: 'payment',
            success_url: `${req.headers.origin}/?success=true#booking`,
            cancel_url: `${req.headers.origin}/?canceled=true#booking`,
        });

        res.status(200).json({ id: session.id, url: session.url });
    } catch (err) {
        console.error('Stripe Error:', err);
        res.status(500).json({ error: err.message });
    }
}
