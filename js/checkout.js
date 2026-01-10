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
async function placeOrder() {
  // 1️⃣ Read cart safely
  const rawCart = localStorage.getItem("cart");
  const cart = rawCart ? JSON.parse(rawCart) : [];

  if (!Array.isArray(cart) || cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  // 2️⃣ Read form fields
  const firstName = document.getElementById("firstName")?.value.trim();
  const lastName  = document.getElementById("lastName")?.value.trim();
  const email     = document.getElementById("email")?.value.trim();
  const address   = document.getElementById("address")?.value.trim();

  if (!firstName || !lastName || !email || !address) {
    alert("Please fill in all required fields.");
    return;
  }

  // 3️⃣ Normalize cart items (🔥 THIS IS THE FIX 🔥)
  const cartItems = cart.map(item => ({
    name: item.name || item.title || "AutoFits USA Product",
    price: Number(item.price ?? item.selling ?? 0),
    qty: Number(item.qty ?? item.quantity ?? 1)
  }));

  // 4️⃣ Validate prices (Stripe is strict)
  for (const item of cartItems) {
    if (!item.price || isNaN(item.price) || item.price <= 0) {
      alert(`Invalid price for item: ${item.name}`);
      return;
    }
  }

  // 5️⃣ Call Netlify function
  try {
    const response = await fetch(
      "/.netlify/functions/create-checkout-session",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems
        })
      }
    );

    const data = await response.json();

    if (data.url) {
      window.location.href = data.url; // ✅ Redirect to Stripe
    } else {
      console.error("Stripe error:", data);
      alert("Payment initialization failed.");
    }

  } catch (err) {
    console.error("Checkout error:", err);
    alert("Something went wrong. Please try again.");
  }
}

/* =========================
   BUTTON BINDING
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("placeOrderBtn");
  if (btn) btn.addEventListener("click", placeOrder);
});

