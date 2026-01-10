const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  const sig = event.headers["stripe-signature"];
  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return { statusCode: 400, body: err.message };
  }

  if (stripeEvent.type === "checkout.session.completed") {
    const session = stripeEvent.data.object;

    const name = session.customer_details?.name || "Not provided";
    const email = session.customer_details?.email || "Not provided";
    const addr = session.customer_details?.address || {};

    // ✅ Proper formatted full address
    const fullAddress = [
      addr.line1,
      addr.line2,
      `${addr.city || ""}, ${addr.state || ""} ${addr.postal_code || ""}`,
      addr.country
    ]
      .filter(Boolean)
      .join("\n");

    // ✅ Fetch cart items from metadata (from create-checkout-session.js)
    const cartItems = session.metadata?.cart
      ? JSON.parse(session.metadata.cart)
      : [];

    const itemsText = cartItems.length
      ? cartItems.map(i => `${i.name || "Unknown item"} (Qty: ${i.qty || 1})`).join("\n")
      : "Items not available";

    const amount = (session.amount_total / 100).toFixed(2);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ORDER_EMAIL,
        pass: process.env.ORDER_EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"AutoFits USA Orders" <${process.env.ORDER_EMAIL}>`,
      to: process.env.ORDER_EMAIL,
      subject: `🧾 New Order – ${session.id}`,
      text: `
New Order Received

Order ID: ${session.id}

Customer:
${name}
${email}

Shipping Address:
${fullAddress}

Items:
${itemsText}

Amount Paid: $${amount}

Please process this order.
      `,
    });
  }

  return { statusCode: 200, body: "ok" };
};
