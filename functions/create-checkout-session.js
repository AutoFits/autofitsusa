const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: "Method Not Allowed",
      };
    }

const { totalAmount, cartItems } = JSON.parse(event.body);

const session = await stripe.checkout.sessions.create({
  payment_method_types: ["card"],
  mode: "payment",

  line_items: cartItems.map(item => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.name, // ✅ REAL PRODUCT NAME
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.qty,
  })),

  metadata: {
    cart: JSON.stringify(cartItems), // ✅ FOR WEBHOOK EMAIL
  },

  success_url: `${process.env.SITE_URL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${process.env.SITE_URL}/checkout.html`,
});


      
 

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    console.error("Stripe error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
  
};



