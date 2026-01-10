const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  try {
    
    const body = JSON.parse(event.body);

// 🔥 FIX: read cartItems instead of items
const items = Array.isArray(body.cartItems) ? body.cartItems : [];

if (!items.length) {
  return {
    statusCode: 400,
    body: JSON.stringify({ error: "Cart is empty" })
  };
}

   


    if (!items.length) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Cart is empty" })
      };
    }

    // 🔒 NORMALIZE ITEMS (THIS FIXES NaN FOREVER)
    const lineItems = items.map((item, index) => {
      const name =
        item.name || item.title || `Item ${index + 1}`;

      const price = Number(
        String(item.price).replace(/[^0-9.]/g, "")
      );

      const qty = Number(item.qty || item.quantity || 1);

      if (!Number.isFinite(price) || price <= 0) {
        throw new Error(`Invalid price for item: ${name}`);
      }

      if (!Number.isInteger(qty) || qty <= 0) {
        throw new Error(`Invalid quantity for item: ${name}`);
      }

      return {
        price_data: {
          currency: "usd",
          product_data: { name },
          unit_amount: Math.round(price * 100)
        },
        quantity: qty
      };
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,

      metadata: {
        items: JSON.stringify(
          items.map(i => ({
            name: i.name || i.title || "Unknown Item",
            qty: i.qty || i.quantity || 1
          }))
        )
      },

      success_url: `${process.env.SITE_URL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.SITE_URL}/checkout.html`
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url })
    };

  } catch (err) {
    console.error("CHECKOUT ERROR:", err.message);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};

