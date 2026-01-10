/* =========================
   SHOW TOTAL
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const totalEl = document.getElementById("total");
  if (!totalEl) return;

  const storedTotal = localStorage.getItem("cartTotal");
  totalEl.textContent = storedTotal ? `$${storedTotal}` : "$0.00";
});

/* =========================
   PLACE ORDER
========================= */
async function placeOrder(e) {
  e.preventDefault();

  const firstName = document.getElementById("firstName")?.value.trim();
  const lastName  = document.getElementById("lastName")?.value.trim();
  const email     = document.getElementById("email")?.value.trim();
  const address   = document.getElementById("address")?.value.trim();

  const name = `${firstName} ${lastName}`.trim();

  if (!firstName || !lastName || !address) {
    alert("Please fill in all required fields.");
    return;
  }

  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  if (!cart.length) {
    alert("Your cart is empty.");
    return;
  }

  const total = parseFloat(localStorage.getItem("cartTotal") || "0");
  if (total <= 0) {
    alert("Invalid order total.");
    return;
  }

  const orderId = "AFU-" + Date.now();

  try {
    const response = await fetch(
      "/.netlify/functions/create-checkout-session",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          totalAmount: total,
          customer_name: name,
          customer_email: email,
          customer_address: address
        })
      }
    );

    const data = await response.json();

    if (data.url) {
      window.location.href = data.url; // 🚀 Stripe redirect
    } else {
      console.error(data);
      alert("Payment initialization failed.");
    }

  } catch (err) {
    console.error("Checkout error:", err);
    alert("Something went wrong. Please try again.");
  }
}


/* =========================
   EMAIL (OPTIONAL – KEEP)
========================= */
function sendOrderEmail(orderData) {
  emailjs
    .send("service_7smhfj3", "template_ldvnhyj", orderData)
    .then(() => console.log("Order email sent"))
    .catch(err => console.error("Email error:", err));
}

/* =========================
   BUTTON BINDING
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("placeOrderBtn");
  if (btn) btn.addEventListener("click", placeOrder);
});
