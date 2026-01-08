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
    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`,
    };
  }

  // ✅ PAYMENT SUCCESS
  if (stripeEvent.type === "checkout.session.completed") {
    const session = stripeEvent.data.object;

    const customerEmail = session.customer_details.email;
    const address = session.customer_details.address;
    const amount = session.amount_total / 100;
    const orderId = session.id;

    // -------- SEND EMAIL --------
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ORDER_EMAIL,
        pass: process.env.ORDER_EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"AutoFitsUSA Orders" <${process.env.ORDER_EMAIL}>`,
      to: process.env.ORDER_EMAIL,
      subject: `🧾 New Order Received – ${orderId}`,
      text: `
New Order Received

Order ID: ${orderId}
Customer Email: ${customerEmail}

Shipping Address:
${address.line1}
${address.city}, ${address.state} ${address.postal_code}
${address.country}

Amount Paid: $${amount}

Please process this order.
      `,
    };

    await transporter.sendMail(mailOptions);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ received: true }),
  };
};
