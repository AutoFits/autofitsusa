const Stripe = require("stripe");
const nodemailer = require("nodemailer");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
    console.error("Webhook signature failed:", err.message);
    return { statusCode: 400, body: "Webhook Error" };
  }

  if (stripeEvent.type !== "checkout.session.completed") {
    return { statusCode: 200, body: "Ignored event" };
  }

  const session = stripeEvent.data.object;

  /* =========================
     CUSTOMER INFO
  ========================= */
  const customerName = session.customer_details?.name || "N/A";
  const customerEmail = session.customer_details?.email || "N/A";

const addr = session.customer_details?.address || {};

const fullAddress = [
  addr.line1,
  addr.line2,
  addr.city,
  addr.state,
  addr.postal_code,
  addr.country
].filter(Boolean).join("\n");


  /* =========================
     ITEMS (FROM METADATA)
  ========================= */
  let itemsText = "Items not available";

  if (session.metadata?.items) {
    try {
      const items = JSON.parse(session.metadata.items);
      itemsText = items
        .map(i => `• ${i.name}  ×  ${i.qty}`)
        .join("\n");
    } catch (e) {
      console.error("Item parse error:", e.message);
    }
  }

  /* =========================
     PAYMENT INFO
  ========================= */
  const amountPaid = (session.amount_total / 100).toFixed(2);
  const currency = session.currency?.toUpperCase() || "USD";
  const orderId = session.id;

  /* =========================
     EMAIL SETUP
  ========================= */
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.ORDER_EMAIL,
      pass: process.env.ORDER_EMAIL_PASS
    }
  });

  const emailBody = `
AUTOFiTS USA — ORDER INVOICE
──────────────────────────────

Order ID:
${orderId}

Customer:
${customerName}
${customerEmail}

Shipping Address:
${fullAddress || "Address not provided"}

──────────────────────────────
Items Ordered:
${itemsText}

──────────────────────────────
Total Paid: ${currency} $${amountPaid}

Payment Status: PAID
Payment Method: Card (Stripe)

──────────────────────────────
Please process this order.

— AutoFits USA
`;

  await transporter.sendMail({
    from: `"AutoFits USA Orders" <${process.env.ORDER_EMAIL}>`,
    to: process.env.ORDER_EMAIL,
    subject: `🧾 New Order Invoice — ${orderId}`,
    text: emailBody
  });

  return { statusCode: 200, body: "Email sent" };
};

// ===============================
// CUSTOMER INVOICE EMAIL
// ===============================

const customerEmail = session.customer_details?.email;

if (customerEmail) {
  const custName = session.customer_details?.name || "Customer";
  const addr = session.customer_details?.address || {};

  const customerAddress = `
${addr.line1 || ""}
${addr.line2 || ""}
${addr.city || ""}, ${addr.state || ""} ${addr.postal_code || ""}
${addr.country || ""}
  `.trim();

  const customerItems = session.metadata?.items
    ? JSON.parse(session.metadata.items)
        .map(i => `• ${i.name} × ${i.qty}`)
        .join("\n")
    : "Item details unavailable";

  const paidAmount = (session.amount_total / 100).toFixed(2);

  await transporter.sendMail({
    from: `"AutoFits USA" <${process.env.ORDER_EMAIL}>`,
    to: customerEmail,
    subject: "🧾 Your AutoFits USA Order Confirmation",
    text: `
Thank you for your order with AutoFits USA!

Your order has been successfully placed and payment is confirmed.

━━━━━━━━━━━━━━━━━━━━━━
ORDER DETAILS
━━━━━━━━━━━━━━━━━━━━━━

Order ID:
${session.id}

Customer:
${custName}
${customerEmail}

Shipping Address:
${customerAddress}

Items Ordered:
${customerItems}

Total Paid: USD $${paidAmount}

Payment Status: PAID
Payment Method: Card (Stripe)

━━━━━━━━━━━━━━━━━━━━━━
NEED HELP?
━━━━━━━━━━━━━━━━━━━━━━
📧 Email: support@autofitsusa.com
📞 Phone: (Contact number coming soon)

We appreciate your business!
Your order will be processed shortly.

— AutoFits USA
    `
  });
}


