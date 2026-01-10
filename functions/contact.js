const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { name, email, message } = JSON.parse(event.body);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.ORDER_EMAIL,
      pass: process.env.ORDER_EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"AutoFitsUSA Contact" <${process.env.ORDER_EMAIL}>`,
    to: process.env.ORDER_EMAIL,
    subject: "📩 New Contact Message",
    text: `
Name: ${name}
Email: ${email}

Message:
${message}
    `,
  });

  return { statusCode: 200, body: "Sent" };
};
