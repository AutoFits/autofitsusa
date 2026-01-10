/* =========================
   SHOW TOTAL
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const totalEl = document.getElementById("total");
  const rawTotal = localStorage.getItem("cartTotal");

  if (totalEl) {
    totalEl.textContent = rawTotal ? `$${rawTotal}` : "$0.00";
  }
});

/* =========================
   PLACE ORDER
========================= */
async function placeOrder() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (!Array.isArray(cart) || cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  const firstName = document.getElementById("firstName")?.value.trim();
  const lastName  = document.getElementById("lastName")?.value.trim();
  const email     = document.getElementById("email")?.value.trim();
  const address   = document.getElementById("address")?.value.trim();

  if (!firstName || !lastName || !email || !address) {
    alert("Please fill all required fields.");
    return;
  }

  const rawTotal = localStorage.getItem("cartTotal");
  const totalAmount = Number(rawTotal);

  if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
    alert("Invalid cart total.");
    return;
  }

  try {
    const res = await fetch("/.netlify/functions/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        totalAmount,
        items: cart, // 🔥 SINGLE SOURCE OF TRUTH
        customer: {
          name: `${firstName} ${lastName}`,
          email,
          address
        }
      })
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      console.error(data);
      alert("Payment initialization failed.");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong.");
  }
}

/* =========================
   BUTTON
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("placeOrderBtn");
  if (btn) btn.addEventListener("click", placeOrder);
});
