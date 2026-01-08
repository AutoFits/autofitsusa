document.addEventListener("DOMContentLoaded", () => {
  const totalEl = document.getElementById("total");

  if (!totalEl) return;

  const storedTotal = localStorage.getItem("cartTotal");

  if (!storedTotal) {
    totalEl.textContent = "$0.00";
    return;
  }

  totalEl.textContent = `$${storedTotal}`;
});

/* =========================
   PLACE ORDER
   ========================= */

function placeOrder() {
  // ✅ Generate order ID FIRST
  const orderId = "AFU-" + Date.now();

  // ✅ Get values safely
  const firstName = document.getElementById("firstName")?.value.trim();
  const lastName = document.getElementById("lastName")?.value.trim();
  const email = document.getElementById("email")?.value.trim();
  const address = document.getElementById("address")?.value.trim();

  if (!firstName || !lastName || !address) {
    alert("Please fill in all required fields.");
    return;
  }

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (!cart.length) {
    alert("Your cart is empty.");
    return;
  }

  const total = localStorage.getItem("cartTotal") || "0.00";

  // ✅ Build items text
  let orderItems = "";
  cart.forEach(item => {
    orderItems += `${item.name} (Qty: ${item.qty})\n`;
  });

  // ✅ Send email (orderId exists here)
  sendOrderEmail({
    order_id: orderId,
    customer_name: `${firstName} ${lastName}`,
    customer_email: email || "Not provided",
    customer_address: address,
    items: orderItems,
    total: `$${total}`
  });

  // ✅ Stripe redirect (next step)
  startStripeCheckout(orderId, total);

  console.log("Order placed:", orderId);
}





  // Cleanup
  localStorage.removeItem("cart");
  localStorage.removeItem("cartTotal");

  alert(
    `✅ Order Confirmed!\n\nOrder ID: ${orderId}\n\nSit back & relax — your order will be processed soon.`
  );

  window.location.href = "index.html";


/* =========================
   EMAIL
   ========================= */

function sendOrderEmail(orderData) {
  emailjs.send(
    "service_7smhfj3",
    "template_ldvnhyj",
    orderData
  ).then(() => {
    console.log("Order email sent");
  }).catch(err => {
    console.error("Email error:", err);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("placeOrderBtn")
    .addEventListener("click", placeOrder);
});
