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

async function placeOrder() {
  const name = document.getElementById("name")?.value.trim();
  const email = document.getElementById("email")?.value.trim();
  const address = document.getElementById("address")?.value.trim();

  if (!name || !address) {
    alert("Please fill in all required fields.");
    return;
  }

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (!cart.length) {
    alert("Your cart is empty.");
    return;
  }

  const total = parseFloat(localStorage.getItem("cartTotal") || "0");

  if (total <= 0) {
    alert("Invalid order total.");
    return;
  }

  try {
    const response = await fetch(
      "/.netlify/functions/create-checkout-session",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalAmount: total,
          customer_name: name,
          customer_email: email,
          customer_address: address
        })
      }
    );

    const data = await response.json();

    if (data.url) {
      // 🔥 Redirect to Stripe Checkout
      window.location.href = data.url;
    } else {
      alert("Payment initialization failed. Please try again.");
      console.error(data);
    }

  } catch (err) {
    console.error("Checkout error:", err);
    alert("Something went wrong. Please try again.");
  }
}


  // Send email
  sendOrderEmail({
    order_id: orderId,
    customer_name: name,
    customer_email: email || "Not provided",
    customer_address: address,
    items: orderItems,
    total: `$${total}`
  });

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
